# cool_websites

A collection of build prompts for futuristic / cinematic landing pages, downloaded from [motionsites.ai](https://motionsites.ai/), plus the implementations built from them.

## How this repo is organized

- Each `<name>.md` file at the repo root is a detailed build prompt for one website (tech stack, fonts, assets, animations, exact specs).
- Each prompt has a matching `<name>/` directory where that website's implementation lives. For example, `lithos.md` is the prompt and `lithos/` is the built site (React 18 + TypeScript + Vite + Tailwind).
- Directories without an implementation yet contain only a placeholder README until the site is built.

## Prompts

| Prompt | Directory | Description |
| --- | --- | --- |
| [3d_portfolio.md](3d_portfolio.md) | [3d_portfolio/](3d_portfolio/) | Dark-themed 3D creator portfolio for "Jack" — React, Tailwind, Framer Motion, Kanit font, gradient hero headings |
| [aethera_studio.md](aethera_studio.md) | [aethera_studio/](aethera_studio/) | Cinematic fullscreen hero with looping video background and custom fade-in/out loop logic |
| [aetheris_voyage.md](aetheris_voyage.md) | [aetheris_voyage/](aetheris_voyage/) | Space-travel landing page — two full-height video sections, liquid-glass design system, CDN-only React |
| [asme.md](asme.md) | [asme/](asme/) | Dark cinematic hero with full-screen looping video and liquid glass UI, Instrument Serif typography |
| [lithos.md](lithos.md) | [lithos/](lithos/) | Geology brand hero with a cursor-following spotlight that reveals a second image through a circular mask |
| [retro_futurist.md](retro_futurist.md) | [retro_futurist/](retro_futurist/) | Retro-futurist hero for creative agency "Mainframe" — Helvetica Now, React + Vite + Tailwind |
| [velorah.md](velorah.md) | [velorah/](velorah/) | Fullscreen video hero with glassmorphic navigation and cinematic typography, shadcn/ui |
| [vex_ventures.md](vex_ventures.md) | [vex_ventures/](vex_ventures/) | Venture firm "VEX" hero — per-character animated headings over a full-screen background video |

## Working on a site

To build one of the sites, read its prompt file and implement it inside the matching directory. `lithos/` is the reference for what a finished implementation looks like.

See `AGENTS.md` for agent instructions and `md/` for working docs.
