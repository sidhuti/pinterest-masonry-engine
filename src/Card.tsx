// src/Card.tsx
import type { Pin } from "./types";

export function Card({
  pin,
  observe,
}: {
  pin: Pin;
  observe: (el: HTMLElement | null) => void;
}) {
  return (
    <div ref={observe} data-id={pin.id} style={styles.card}>
      <img src={pin.image} style={styles.img} />
      <div style={styles.text}>{pin.title}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: "absolute",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  img: {
    width: "100%",
    display: "block",
  },
  text: {
    padding: 8,
  },
};