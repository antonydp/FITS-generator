export type FrameData = string; // Base64 Data URL

export interface Size {
  width: number;
  height: number;
}

export const CANVAS_SIZE: Size = { width: 120, height: 120 };
export const DOT_RADIUS = 2;
export const TOTAL_FRAMES = 4;
export const SCALE_FACTOR = 3; // Display scale (120 * 3 = 360px)