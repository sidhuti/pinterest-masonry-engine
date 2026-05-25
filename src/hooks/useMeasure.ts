// src/hooks/useMeasure.ts
import { useEffect, useRef } from "react";

export function useMeasure(onMeasure: (id: string, h: number) => void) {
  const ro = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    ro.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        const id = entry.target.getAttribute("data-id");
        if (!id) continue;

        onMeasure(id, entry.contentRect.height);
      }
    });

    return () => ro.current?.disconnect();
  }, [onMeasure]);

  const observe = (el: HTMLElement | null) => {
    if (el && ro.current) ro.current.observe(el);
  };

  return { observe };
}