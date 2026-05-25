// src/engine/layout.ts
import type { Pin, LayoutItem } from "../types";

type ColumnState = {
  height: number;
};

export function createLayout(
  items: Pin[],
  columnCount: number,
  measured: Map<string, number>,
  columnWidth: number,
  gap = 16
) {
  const columns: ColumnState[] = Array.from(
    { length: columnCount },
    () => ({ height: 0 })
  );

  const layout = new Map<string, LayoutItem>();

  for (const item of items) {
    const height = measured.get(item.id) ?? 250;

    // shortest column
    let colIndex = 0;
    for (let i = 1; i < columnCount; i++) {
      if (columns[i].height < columns[colIndex].height) {
        colIndex = i;
      }
    }

    const x = colIndex * (columnWidth + gap);
    const y = columns[colIndex].height;

    layout.set(item.id, {
      id: item.id,
      x,
      y,
      width: columnWidth,
      height,
    });

    columns[colIndex].height += height + gap;
  }

  return { layout, totalHeight: Math.max(...columns.map(c => c.height)) };
}