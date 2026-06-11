# Running Status

## Current State

- Repo holds 8 build prompts downloaded from motionsites.ai, one `.md` file each at the repo root.
- Each prompt has a matching implementation directory (see the table in `README.md`).
- `lithos/` is the only built site so far (React 18 + TypeScript + Vite + Tailwind). The other directories hold placeholder READMEs.

## How To Use This Repo

```bash
git clone git@github.com:interface4agi/cool_websites.git
cd cool_websites
```

To run the built lithos site:

```bash
cd lithos
npm install
npm run dev
```

To build a new site: read its `<name>.md` prompt and implement it self-contained inside `<name>/`, following `lithos/` as the reference.

## Remaining Gaps

- 7 of 8 sites are not yet implemented: 3d_portfolio, aethera_studio, aetheris_voyage, asme, retro_futurist, velorah, vex_ventures.

## Files To Check First

- `AGENTS.md`
- `README.md`
- `config.json`
- `md/plan.md`
