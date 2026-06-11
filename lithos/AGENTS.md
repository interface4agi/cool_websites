# Lithos — agent instructions

Single-page hero section for a geology brand, built with React 18 + TypeScript + Vite + Tailwind CSS (v3) + lucide-react.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck (`tsc -b`) and build for production

## Layout

- `src/App.tsx` — the entire UI: fixed nav, hero section, and the `RevealLayer` cursor-spotlight component (canvas-generated radial mask applied as `mask-image` on the reveal image layer).
- `src/index.css` — Google Fonts (Inter, Playfair Display), Tailwind directives, and hero load animations (`hero-reveal`, `hero-fade`, `hero-zoom`).
- Background images are remote URLs defined as `BG_IMAGE_1` / `BG_IMAGE_2` constants in `src/App.tsx`.

## Rules

- Keep the hero spec exact: spotlight radius is `SPOTLIGHT_R = 260`, mouse lerp factor is `0.1`.
- Respect `prefers-reduced-motion` for all animations.
- See `md/running.md` for current state and `md/plan.md` for the roadmap.
