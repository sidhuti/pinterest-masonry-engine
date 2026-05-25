// src/hooks/usePinterestEngine.ts
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Pin } from "../types";
import { createLayout } from "../engine/layout";
import { createScheduler } from "../utils/raf";

export function usePinterestEngine(items: Pin[], columnCount: number, width: number) {
  const measured = useRef(new Map<string, number>());
  const [layout, setLayout] = useState<Map<string, any>>(new Map());
  const [height, setHeight] = useState(0);

  const schedule = useMemo(() => createScheduler(), []);

  const columnWidth = useMemo(() => {
    return (width - (columnCount - 1) * 16) / columnCount;
  }, [width, columnCount]);

  const recompute = useCallback(() => {
    const { layout: newLayout, totalHeight } = createLayout(
      items,
      columnCount,
      measured.current,
      columnWidth
    );

    setLayout(newLayout);
    setHeight(totalHeight);
  }, [items, columnCount, columnWidth]);

  // initial + updates
  useEffect(() => {
    schedule(recompute);
  }, [recompute, schedule]);

  const onMeasure = useCallback(
    (id: string, h: number) => {
      measured.current.set(id, h);

      schedule(() => {
        recompute();
      });
    },
    [recompute, schedule]
  );

  return { layout, height, onMeasure };
}