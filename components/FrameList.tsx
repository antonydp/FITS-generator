import React from 'react';
import { CANVAS_SIZE } from '../types';

interface FrameListProps {
  frames: string[];
  activeFrameIndex: number;
  onSelectFrame: (index: number) => void;
  onClearFrame: (index: number) => void;
}

const FrameList: React.FC<FrameListProps> = ({ frames, activeFrameIndex, onSelectFrame, onClearFrame }) => {
  return (
    <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible py-2 px-1">
      {frames.map((frame, index) => (
        <div key={index} className="relative flex-shrink-0 flex flex-col items-center gap-2 group">
           <span className="text-xs font-mono text-neutral-400">Frame {index + 1}</span>
          <button
            onClick={() => onSelectFrame(index)}
            className={`relative p-1 rounded-lg border-2 transition-all ${
              activeFrameIndex === index
                ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] bg-neutral-800'
                : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900'
            }`}
          >
            <img
              src={frame}
              alt={`Frame ${index + 1}`}
              width={CANVAS_SIZE.width}
              height={CANVAS_SIZE.height}
              className="w-16 h-auto object-contain image-pixelated bg-black rounded-sm"
              style={{ imageRendering: 'pixelated' }}
            />
            {activeFrameIndex === index && (
                <div className="absolute inset-0 ring-2 ring-indigo-500/50 rounded-lg animate-pulse" />
            )}
          </button>
          
          <button
            onClick={(e) => {
                e.stopPropagation();
                onClearFrame(index);
            }}
            className="md:absolute md:-right-2 md:-top-2 md:opacity-0 md:group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] transition-all shadow-md z-10"
            title="Clear Frame"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default FrameList;