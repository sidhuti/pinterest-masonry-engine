// src/data.ts
import type { Pin } from "./types";

export const pins: Pin[] = Array.from({ length: 100 }).map((_, i) => ({
  id: String(i),
  image: `https://picsum.photos/300/${200 + (i % 10) * 30}`,
  title: `Pin ${i}`,
}));