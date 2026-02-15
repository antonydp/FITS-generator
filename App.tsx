import React, { useState } from 'react';
import PixelCanvas from './components/PixelCanvas';
import FrameList from './components/FrameList';
import PreviewPlayer from './components/PreviewPlayer';
import { downloadFrames, createBlankFrame } from './utils/download';
import { TOTAL_FRAMES } from './types';
import { ArrowDownTrayIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/solid'; // Assumes heroicons is available or we use SVGs. I will use standard SVG to be safe.

// Fallback Icon Components to avoid dependency issues
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const OnionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
  </svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
    </svg>
)

const App: React.FC = () => {
  // Initialize frames with blank black canvas
  const [frames, setFrames] = useState<string[]>(() => {
    const initialFrames = [];
    const blank = createBlankFrame();
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      initialFrames.push(blank);
    }
    return initialFrames;
  });

  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  // Default onion skin to true as requested
  const [onionSkin, setOnionSkin] = useState(true);

  const handleUpdateFrame = (newDataUrl: string) => {
    setFrames((prev) => {
      const newFrames = [...prev];
      newFrames[activeFrameIndex] = newDataUrl;
      return newFrames;
    });
  };

  const handleClearFrame = (index: number) => {
    setFrames((prev) => {
      const newFrames = [...prev];
      newFrames[index] = createBlankFrame();
      return newFrames;
    });
  };

  const clearCurrentFrame = () => handleClearFrame(activeFrameIndex);

  const handleDownload = () => {
    downloadFrames(frames);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="p-6 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Dot Animator 120
            </h1>
            <p className="text-xs text-neutral-500 mt-1">120x120px • 4 Frames • 2px Dots</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
          >
            <DownloadIcon />
            <span>Download FITS</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-4 md:p-8 gap-8 items-start justify-center">
        
        {/* Left: Frame Selector */}
        <div className="w-full md:w-32 flex flex-col gap-4 order-2 md:order-1">
          <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700">
             <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Timeline</h2>
             <FrameList
                frames={frames}
                activeFrameIndex={activeFrameIndex}
                onSelectFrame={setActiveFrameIndex}
                onClearFrame={handleClearFrame}
             />
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 flex flex-col items-center gap-6 order-1 md:order-2">
          <div className="relative">
            <PixelCanvas
              activeFrameIndex={activeFrameIndex}
              currentFrameData={frames[activeFrameIndex]}
              frames={frames}
              onUpdate={handleUpdateFrame}
              onionSkinEnabled={onionSkin}
            />
            
            {/* Toolbar floating below canvas */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-neutral-800 p-2 rounded-full border border-neutral-700 shadow-xl">
              <button
                onClick={() => setOnionSkin(!onionSkin)}
                className={`p-2 rounded-full transition-colors ${
                  onionSkin ? 'bg-indigo-600 text-white' : 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
                title="Toggle Onion Skin"
              >
                <OnionIcon />
              </button>
              <div className="w-px h-6 bg-neutral-700"></div>
              <button
                 onClick={clearCurrentFrame}
                 className="p-2 rounded-full text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                 title="Clear Current Frame"
              >
                <ClearIcon />
              </button>
            </div>
          </div>
          
          <div className="text-neutral-500 text-sm mt-12 text-center max-w-md">
            <p>Tip: Draw on the black square. Dots are automatically sized to 2px radius.</p>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-full md:w-64 flex flex-col gap-4 order-3">
          <PreviewPlayer frames={frames} />
          
          <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-500 leading-relaxed">
            <h4 className="font-bold text-neutral-300 mb-2">Instructions</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Select a frame from the left.</li>
              <li>Draw white dots on the canvas.</li>
              <li>Use onion skin <span className="inline-block align-middle"><OnionIcon /></span> to see all previous frames.</li>
              <li>Check the animation preview.</li>
              <li>Click Download to get your FITS files.</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;