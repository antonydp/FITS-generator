export type FrameData = string; // Base64 Data URL

export interface Size {
  width: number;
  height: number;
}

export const CANVAS_SIZE: Size = { width: 200, height: 200 };
export const DOT_RADIUS = 4;
export const TOTAL_FRAMES = 4;
export const SCALE_FACTOR = 2; // Display scale (200 * 2 = 400px)