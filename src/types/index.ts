export interface PartPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

export interface GameResult {
  id?: string;
  character: string;
  parts: Record<string, PartPosition>;
  timestamp: string;
  imageDataUrl?: string; // base64 image data
}

export interface Character {
  name: string;
  displayName: string;
  parts: string[];
}

export const KUMAMON_PARTS = [
  'head',
  'eye-right',
  'eye-left', 
  'nose',
  'body',
  'ear-right',
  'ear-left',
  'mouth',
  'eyebrow-right',
  'eyebrow-left',
  'flush-right',
  'flush-left',
  'hand-right',
  'hand-left',
  'leg-right',
  'leg-left'
] as const;

export type KumamonPartType = typeof KUMAMON_PARTS[number];

export const CHARACTERS: Character[] = [
  {
    name: 'kumamon',
    displayName: 'くまモン',
    parts: [...KUMAMON_PARTS]
  }
];
