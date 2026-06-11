# Running state

_Last updated: 2026-06-11_

## Current state

- Hero section implemented to spec: dark full-screen hero, fixed glass nav, cursor-following spotlight that reveals a second image via a canvas-generated radial mask, staggered load animations.
- Builds cleanly with `npm run build`; no tests yet.

## Maintenance workflow

1. `npm install` once, then `npm run dev` to work locally.
2. Run `npm run build` before considering any change done (it typechecks).
3. Keep `md/plan.md` updated when scope changes.
