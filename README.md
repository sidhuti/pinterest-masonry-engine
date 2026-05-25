# Pinterest Engine

A from-scratch recreation of Pinterest's masonry layout engine in React + TypeScript.

<img width="1600" height="862" alt="image" src="https://github.com/user-attachments/assets/207d96f8-90f9-4a69-9fd8-b3c72d99fd56" />


## What it does

Renders a responsive, variable-height masonry grid — the same layout algorithm Pinterest uses. Cards are placed into columns by always filling the shortest one, producing a compact, gap-free layout regardless of card height.

## How it works

### Layout algorithm (`src/engine/layout.ts`)

Pure function — no React, no side effects. Given a list of items, column count, measured heights, and column width, it runs the **shortest-column-wins** greedy algorithm:

1. Tracks the fill height of each column.
2. For each pin, finds the shortest column and places the card there.
3. Computes absolute `x` / `y` from the column index and current fill height.
4. Returns a `Map<id, LayoutItem>` with every card's position.

### Measurement loop (`src/hooks/useMeasure.ts`)

Card heights aren't known upfront — images load async and text can wrap. A single shared `ResizeObserver` watches every card. When any card's height changes it fires `onMeasure(id, height)`, which updates the measured map and triggers a layout recompute.

### Engine hook (`src/hooks/usePinterestEngine.ts`)

Glues measurement and layout together:

- Maintains a `measured` ref (`Map<id, height>`) that persists across renders.
- Derives `columnWidth = (containerWidth - gaps) / columnCount`.
- On any change (new measurement, column count change, resize) calls `createLayout()` and updates React state.
- Debounces rapid recomputes through the RAF scheduler.

### RAF scheduler (`src/utils/raf.ts`)

A `requestAnimationFrame` debounce. If many images load in the same frame, only one layout recompute runs. A single `scheduled` flag prevents queuing duplicate RAF callbacks.

### Rendering (`src/Masonry.tsx`)

The container is `position: relative` with an explicit `height` equal to the tallest column's fill height. Each card is `position: absolute` with `top` / `left` from the layout map. A `ResizeObserver` on the container feeds the real available width into the engine so the layout responds correctly to the `max-width` cap.

### Data flow

```
images load / container resize
         ↓
ResizeObserver (useMeasure / container ref)
         ↓
measured Map updated
         ↓
schedule(recompute)   ← RAF debounce
         ↓
createLayout()        ← pure function
         ↓
layout Map (id → x, y, width, height)
         ↓
React renders absolute-positioned divs
```

## Project structure

```
src/
├── engine/
│   └── layout.ts             # Pure masonry layout algorithm
├── hooks/
│   ├── usePintrestEngine.ts  # Orchestrates layout + measurement state
│   └── useMeasure.ts         # ResizeObserver wrapper for card heights
├── utils/
│   └── raf.ts                # RAF-based debounce scheduler
├── App.tsx                   # Root — max-width centered container
├── Masonary.tsx              # Grid shell, column count breakpoints
├── Card.tsx                  # Individual pin card
├── data.ts                   # 100 generated pins (picsum.photos)
└── types.ts                  # Pin, LayoutItem types
```

## Getting started

```bash
npm install
npm run dev
```

## Tech stack

- React 18
- TypeScript
- Vite
- No layout libraries — everything is implemented from scratch
