import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CANVAS_SIZE, DOT_RADIUS, SCALE_FACTOR } from '../types';

interface PixelCanvasProps {
  activeFrameIndex: number;
  currentFrameData: string;
  frames: string[]; // Changed from previousFrameData to frames array
  onUpdate: (dataUrl: string) => void;
  onionSkinEnabled: boolean;
}

const PixelCanvas: React.FC<PixelCanvasProps> = ({
  activeFrameIndex,
  currentFrameData,
  frames,
  onUpdate,
  onionSkinEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
      if (context) {
        context.imageSmoothingEnabled = false;
        setCtx(context);
      }
    }
  }, []);

  // Load frame data when index or data changes
  useEffect(() => {
    if (!ctx) return;

    const img = new Image();
    img.src = currentFrameData;
    img.onload = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [ctx, currentFrameData, activeFrameIndex]);

  const drawDot = useCallback((clientX: number, clientY: number) => {
    if (!ctx || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / SCALE_FACTOR);
    const y = Math.floor((clientY - rect.top) / SCALE_FACTOR);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // Trigger update immediately for responsiveness
  }, [ctx]);

  const saveFrame = useCallback(() => {
    if (canvasRef.current) {
      onUpdate(canvasRef.current.toDataURL('image/png'));
    }
  }, [onUpdate]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    drawDot(clientX, clientY);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scrolling on touch
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    drawDot(clientX, clientY);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveFrame();
    }
  };

  return (
    <div className="relative group shadow-2xl rounded-lg overflow-hidden border-4 border-neutral-700">
      {/* Onion Skin Layers */}
      {onionSkinEnabled && frames.map((frame, index) => {
        // Show all frames preceding the current one
        if (index >= activeFrameIndex) return null;
        
        return (
          <img
            key={index}
            src={frame}
            alt={`Onion Skin Frame ${index + 1}`}
            className="absolute top-0 left-0 pointer-events-none pixelated"
            style={{
              width: CANVAS_SIZE.width * SCALE_FACTOR,
              height: CANVAS_SIZE.height * SCALE_FACTOR,
              imageRendering: 'pixelated',
              opacity: 0.5,
              mixBlendMode: 'screen' // Essential to make black background transparent
            }}
          />
        );
      })}

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="block bg-black drawing-cursor touch-none"
        style={{
          width: CANVAS_SIZE.width * SCALE_FACTOR,
          height: CANVAS_SIZE.height * SCALE_FACTOR,
          imageRendering: 'pixelated',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />
      
      <div className="absolute bottom-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs px-2 py-1 rounded">
        Frame {activeFrameIndex + 1}
      </div>
    </div>
  );
};

export default PixelCanvas;