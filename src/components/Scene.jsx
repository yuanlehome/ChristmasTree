import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import ChristmasTree from './ChristmasTree';
import PhotoOverlay from './PhotoOverlay';
import useStore from '../store';

const Controls = () => {
    const { focusedPhoto } = useStore();
    return (
        <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2 + 0.1} 
            minPolarAngle={Math.PI / 3} 
            minDistance={4}
            maxDistance={15}
            enableDamping
            dampingFactor={0.05}
            enabled={!focusedPhoto} // Disable controls when a photo is focused
        />
    );
};

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: false, toneMappingExposure: 2.0 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#050505']} />
      
      <Suspense fallback={null}>
        {/* Environment & Lighting - Cinematic Setup */}
        {/* Increased ambient light for better visibility */}
        <ambientLight intensity={0.5} />
        
        {/* Key Light (Warm Gold) - Boosted Intensity */}
        <spotLight 
            position={[10, 10, 10]} 
            angle={0.4} 
            penumbra={1} 
            intensity={50} 
            color="#FFD700" 
            castShadow 
        />
        
        {/* Rim Light (Cool Blue/Teal) - Boosted Intensity */}
        <spotLight 
            position={[-10, 5, -10]} 
            angle={0.6} 
            penumbra={1} 
            intensity={40} 
            color="#00FFFF" 
        />
        
        {/* Top Highlight (White) - Boosted */}
        <pointLight position={[0, 8, 0]} intensity={10} color="#ffffff" distance={15} decay={2} />
        
        {/* Background Elements */}
        <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
        {/* Subtle floating dust */}
        <Sparkles count={100} scale={10} size={1} speed={0.2} opacity={0.3} color="#FFD700" />
        <Sparkles count={100} scale={12} size={2} speed={0.3} opacity={0.2} color="#00FFFF" />

        {/* Core Content */}
        <ChristmasTree />
        
        {/* Fullscreen Photo Overlay (Independent of Tree Rotation) */}
        <PhotoOverlay />

        {/* Cinematic Post Processing */}
        <EffectComposer disableNormalPass>
          {/* Soft Bloom for glowy look */}
          <Bloom luminanceThreshold={0.6} mipmapBlur intensity={1.5} radius={0.4} />
          {/* Cinematic Vignette - Reduced Darkness */}
          <Vignette eskil={false} offset={0.1} darkness={0.6} />
          {/* Film Grain */}
          <Noise opacity={0.05} />
        </EffectComposer>

        <Controls />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
