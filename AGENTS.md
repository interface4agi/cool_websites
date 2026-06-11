# Agent Notes

Start with [README.md](README.md) for the purpose of this repository and how prompts map to site directories.
Use [md/README.md](md/README.md) for the documentation layout and what belongs under `md/`.
Use [md/running.md](md/running.md) for the current state of the repo and the expected maintenance workflow.
Use [md/plan.md](md/plan.md) for the active roadmap for this repo.
Use [config.json](config.json) for the checked-in repo preferences and structure.

Canonical file rules:
- `AGENTS.md` is the canonical instruction file for this repository.
- `CLAUDE.md` should remain a short pointer to `AGENTS.md`.
- `md/` is the working-memory area for plans, status docs, and discussions.

Repo-specific rules:
- Each `<name>.md` prompt at the root pairs with a `<name>/` directory holding that site's implementation.
- Do not edit the prompt files — they are the downloaded source specs from motionsites.ai.
- Build each site self-contained inside its own directory (its own package.json, etc.), following `lithos/` as the reference.
- Keep `md/running.md` and `md/plan.md` updated as sites get built.
