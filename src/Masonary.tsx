// src/Masonry.tsx
import { useEffect, useRef, useState } from "react";
import { pins } from "./data";
import { Card } from "./Card";
import { usePinterestEngine } from  './hooks/usePintrestEngine'
import { useMeasure } from "./hooks/useMeasure";

export function Masonry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const columnCount = width < 600 ? 1 : width < 900 ? 2 : 3;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { layout, height, onMeasure } = usePinterestEngine(
    pins,
    columnCount,
    width
  );

  const { observe } = useMeasure(onMeasure);

  return (
    <div ref={containerRef} style={{ position: "relative", height }}>
      {pins.map(pin => {
        const pos = layout.get(pin.id);
        if (!pos) return null;

        return (
          <div
            key={pin.id}
            style={{
              position: "absolute",
              top: pos.y,
              left: pos.x,
              width: pos.width,
            }}
          >
            <Card pin={pin} observe={observe} />
          </div>
        );
      })}
    </div>
  );
}