export const CHART_HEIGHT = 300;

export const BAR_CHART = {
  CATEGORY_GAP: "20%",
  GAP: 8,
  RADIUS: [6, 6, 0, 0] as [number, number, number, number],
  MAX_SIZE: 64,
  ANIMATION_DURATION: 1200,
  ANIMATION_BEGIN: 200,
  MARGIN: { top: 10, right: 5, left: 10, bottom: 0 },
} as const;

export const BAR_COLORS = {
  INCOME: {
    FROM: "#10b981",
    TO: "#34d399",
    TEXT: "emerald-500",
  },
  EXPENSE: {
    FROM: "#ec4899",
    TO: "#f472b6",
    TEXT: "pink-500",
  },
} as const;

export const AXIS_STYLE = {
  GRID_STROKE: "#f1f5f9",
  TICK_FONT_SIZE: 11,
  TICK_FILL: "#64748b",
  LINE_STROKE: "#e2e8f0",
  Y_AXIS_WIDTH: 52,
} as const;

export const CURSOR_FILL = "#f1f5f9";
export const CURSOR_RADIUS = 8;
