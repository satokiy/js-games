export const PanelTypes = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
] as const;

export type PanelType = (typeof PanelTypes)[number];

export type Panel = {
  type: PanelType;
};

export const getRandomPanel = (): Panel => {
  const r = Math.floor(Math.random() * PanelTypes.length);
  return { type: PanelTypes[r] };
};
