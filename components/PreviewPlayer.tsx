import React, { useEffect, useState } from 'react';

interface PreviewPlayerProps {
  frames: string[];
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ frames }) => {
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState(5);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPreviewIndex((prev) => (prev + 1) % frames.length);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length, fps]);

  return (
    <div className="flex flex-col items-center gap-4 bg-neutral-800/50 p-6 rounded-xl border border-neutral-700 w-full max-w-xs">
      <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Preview</h3>
      
      <div className="relative border-4 border-black rounded-lg bg-black shadow-lg w-full">
        <img
          src={frames[currentPreviewIndex]}
          alt="Preview"
          style={{
            width: '100%',
            height: 'auto',
            imageRendering: 'pixelated',
          }}
          className="block"
        />
        <div className="absolute top-1 right-1 bg-black/60 text-[10px] px-1.5 py-0.5 rounded text-neutral-400 font-mono">
             {currentPreviewIndex + 1}/{frames.length}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full justify-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
            isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
          } text-white`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <div className="flex flex-col items-center gap-1 flex-1">
            <label className="text-[10px] text-neutral-400">Speed: {fps} FPS</label>
            <input 
                type="range" 
                min="1" 
                max="12" 
                step="1" 
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
        </div>
      </div>
    </div>
  );
};

export default PreviewPlayer;