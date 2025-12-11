import React, { useState } from 'react';
import useStore from '../store';

const UI = () => {
  const { phase, setPhase } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);

  // Manual control handlers
  const handleBloom = () => {
      if (phase === 'tree') setPhase('blooming');
  };

  const handleReset = () => {
      if (phase === 'nebula') setPhase('collapsing');
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none overflow-hidden">
      
      {/* Cinematic Title - Only visible in Tree Phase */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-1000 ${phase === 'tree' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'}`}>
        <h1 className="font-cinzel text-6xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C3] to-[#C19A6B] drop-shadow-[0_0_30px_rgba(255,215,0,0.3)] tracking-[0.1em] uppercase">
          Merry<br/>Christmas
        </h1>
        <p className="mt-6 font-sans text-xs md:text-sm text-[#C19A6B] tracking-[0.5em] uppercase opacity-60">
          Interactive WebGL Experience
        </p>
      </div>

      {/* Phase Indicator (Bottom Left) */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2 pointer-events-auto">
         <div className="flex items-end gap-4">
            <span className="font-cinzel text-5xl text-white/10 font-bold leading-none">
                {phase === 'tree' ? '01' : phase === 'blooming' ? '02' : phase === 'nebula' ? '03' : '04'}
            </span>
            <div className="flex flex-col mb-1">
                <span className="font-sans text-[10px] text-white/40 tracking-[0.3em] uppercase">Current Phase</span>
                <span className="font-cinzel text-xl text-[#C19A6B] tracking-widest uppercase">
                    {phase}
                </span>
            </div>
         </div>
         {/* Decoration Line */}
         <div className="w-32 h-[1px] bg-gradient-to-r from-[#C19A6B]/50 to-transparent" />
         
         {/* Interaction Hint */}
         <div className="mt-4 max-w-xs transition-opacity duration-500">
             <p className="font-sans text-xs text-white/60 leading-relaxed tracking-wide mb-2">
                {phase === 'tree' && <>Hover to repel. <span className="text-yellow-500">Open Palm</span> to bloom.</>}
                {phase === 'blooming' && <>Exploding stars into nebula...</>}
                {phase === 'nebula' && <><span className="text-yellow-500">Open Palm</span> to rotate. <span className="text-red-500">Closed Fist</span> to reset.</>}
                {phase === 'collapsing' && <>Restoring gravitational field...</>}
             </p>
             {/* Manual Controls */}
             <div className="flex gap-2">
                {phase === 'tree' && (
                    <button onClick={handleBloom} className="px-3 py-1 bg-[#C19A6B]/20 border border-[#C19A6B]/50 rounded text-[#C19A6B] text-xs font-sans hover:bg-[#C19A6B]/40 transition-colors uppercase tracking-widest">
                        Bloom (Manual)
                    </button>
                )}
                {phase === 'nebula' && (
                    <button onClick={handleReset} className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs font-sans hover:bg-red-500/40 transition-colors uppercase tracking-widest">
                        Reset (Manual)
                    </button>
                )}
             </div>
         </div>
      </div>

      {/* Music Player (Bottom Right) */}
      <div className="absolute bottom-10 right-10 pointer-events-auto flex items-center gap-6">
        <div className={`flex flex-col items-end transition-all duration-500 ${isPlaying ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <span className="font-cinzel text-xs text-[#C19A6B] tracking-widest">NOW PLAYING</span>
            <span className="font-sans text-sm text-white/80 tracking-wide">Merry Christmas Mr. Lawrence</span>
        </div>

        <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="group relative w-16 h-16 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:border-[#C19A6B]/50"
        >
            {/* Animated Ring */}
            <div className={`absolute inset-0 rounded-full border border-[#C19A6B]/30 ${isPlaying ? 'animate-ping opacity-20' : 'opacity-0'}`} />
            
            <span className="text-white text-xl ml-1">
                {isPlaying ? '⏸' : '▶'}
            </span>
        </button>
      </div>

      {/* Vignette / Grain Overlay (Cinematic Feel) */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
      
      {/* Border Frame */}
      <div className="absolute inset-4 border border-white/5 pointer-events-none rounded-3xl" />
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#C19A6B]/50" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#C19A6B]/50" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#C19A6B]/50" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#C19A6B]/50" />

    </div>
  );
};

export default UI;
