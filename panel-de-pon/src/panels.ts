export const NEUTRAL = 0; // 静止状態
export const EXTINCT = 1; // 発火中
export const VANISH = 2; // 消滅中
export const FALLING = 3; // 落下中
export const FIXED = 4; // 落下完了

export const PanelTypes = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
] as const;

export const state =[
  NEUTRAL,
  FALLING,
  FIXED,
] as const;

export type State = (typeof state)[number];

export type PanelType = (typeof PanelTypes)[number];

export type Panel = {
  type: PanelType;
  state: State
};

export const getRandomPanel = (): Panel => {
  const r = Math.floor(Math.random() * PanelTypes.length);
  return { type: PanelTypes[r], state: NEUTRAL };
};
