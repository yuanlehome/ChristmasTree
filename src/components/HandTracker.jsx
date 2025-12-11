import React, { useEffect, useRef, useState } from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import useStore from '../store';

const HandTracker = () => {
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [recognizer, setRecognizer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestRef = useRef();
  const { setGesture, gesture } = useStore();

  useEffect(() => {
    const initRecognizer = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing MediaPipe...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO"
        });
        setRecognizer(recognizer);
        console.log("MediaPipe Initialized!");
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to init MediaPipe:", err);
        setError("Failed to load AI Model");
        setIsLoading(false);
      }
    };
    initRecognizer();
  }, []);

  const toggleCamera = async () => {
    if (!isCameraOpen) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraOpen(true);
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Cannot access camera. Please allow permission.");
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraOpen(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      }
    }
  };

  const predictWebcam = () => {
    if (recognizer && videoRef.current && videoRef.current.readyState === 4) {
      try {
        const results = recognizer.recognizeForVideo(videoRef.current, Date.now());
        
        if (results.gestures.length > 0) {
          const gestureName = results.gestures[0][0].categoryName;
          const score = results.gestures[0][0].score;
          
        //   console.log(`Gesture: ${gestureName}, Score: ${score}`);
          
          if (score > 0.5) {
              if (gestureName === 'Open_Palm') setGesture('Open_Palm');
              else if (gestureName === 'Closed_Fist') setGesture('Closed_Fist');
              else setGesture('None');
          }
        } else {
            setGesture('None');
        }
      } catch (e) {
          console.error("Prediction error:", e);
      }
    }
    
    if (isCameraOpen) {
        requestRef.current = requestAnimationFrame(predictWebcam);
    }
  };

  useEffect(() => {
      if (isCameraOpen && recognizer) {
          // Start loop
          requestRef.current = requestAnimationFrame(predictWebcam);
      }
      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
  }, [isCameraOpen, recognizer]);

  return (
    <div className="absolute top-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        {/* Camera Preview Panel - Cinema Style */}
        <div className={`transition-all duration-500 ease-out overflow-hidden ${isCameraOpen ? 'w-48 opacity-100 mb-4' : 'w-0 opacity-0 mb-0'}`}>
             <div className="relative aspect-[3/4] bg-black rounded-lg border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
                <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover opacity-80" 
                    playsInline 
                    muted 
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <p className="text-[10px] text-white/60 tracking-widest uppercase font-sans">DETECTED</p>
                    <p className="text-sm text-yellow-500 font-cinzel font-bold tracking-wider">
                        {gesture === 'None' ? 'SEARCHING...' : gesture.replace('_', ' ')}
                    </p>
                </div>
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
             </div>
        </div>

        {/* Toggle Button */}
        <button 
            onClick={toggleCamera}
            disabled={isLoading || error}
            className={`
                group relative px-6 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full 
                transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isCameraOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_8px_currentColor] transition-colors`} />
                <span className="font-cinzel text-xs font-bold tracking-[0.2em] text-white/90">
                    {isLoading ? 'LOADING AI...' : error ? 'AI ERROR' : isCameraOpen ? 'DISCONNECT' : 'ENABLE GESTURE'}
                </span>
            </div>
        </button>
    </div>
  );
};

export default HandTracker;
