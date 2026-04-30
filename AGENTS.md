# AGENTS.md

This repository is a harness for script-driven CAD generation with coding agents like Codex and Claude Code.

If you are modifying CAD Explorer itself, go to `.agents/skills/cad/explorer/README.md`.

## Skill Routing

Use the bundled skills for workflow details:

- `.agents/skills/cad/SKILL.md` for STEP, STL, 3MF, DXF, GLB/topology artifacts, snapshots, and `@cad[...]` prompt references.

`AGENTS.md` is intentionally harness-focused. Reusable CAD workflow rules live inside the skill.

## Harness Context

Project CAD files are repo-relative. This harness does not reserve a
project-file directory; current projects keep generated and source CAD entries
at the repository root under folders such as `STEP/`, `STL/`, `DXF/`, and
`3MF/`.

The CAD skill tools are file-targeted. They do not depend on a harness layout
or prepend a project root.

Project-specific context may live in compact root-level notes such as
`PROJECT.md`. Do not copy reusable generator contracts, prompt-ref rules,
validation policy, image review policy, vendor preflight policy, or full CLI
syntax into them; link to the relevant skill references instead.

CAD Explorer copies `@cad[...]` paths relative to the directory Vite was
launched from and omits the `.step` or `.stp` suffix.

## Python Environment

Prefer the repo-local CAD runtime managed by `uv`. From the repo root, install
or refresh Python dependencies with:

```bash
uv sync
```

Run CAD tooling through `uv` where possible:

```bash
uv run python
```

The synchronized `.venv` has the CAD dependencies required by the skill tools,
including `build123d` and `OCP`. Direct `./.venv/bin/python` usage is acceptable
when a tool specifically needs the interpreter path.

Other bundled skills own their Python dependencies in their skill directories; install them only when using those workflows.

## Source Of Truth

- Generated CAD outputs are derived artifacts.
- Package-local render, topology, component, and review-image artifacts are derived artifacts.
- Do not hand-edit generated artifacts unless explicitly instructed. Edit the owning source file or imported source file first, then regenerate explicit targets with the relevant skill tool.
- If regenerated output differs from checked-in generated files, the regenerated output is authoritative.

## Repo Policies

- Keep project CAD files in explicit repo-relative locations.
- Use explicit generation targets. Do not run directory-wide generation.
- Generation tools write and overwrite current configured outputs. They do not delete stale outputs when paths change.
- Update project-local documentation only when project focus, entry roles, inventory, dependency notes, durable quirks, or preferred rebuild roots change.
- CAD outputs are often LFS-tracked, and broad status checks can invoke LFS clean filters while generated files are changing; prefer path-limited `git status` during CAD work.
- For bookkeeping-only full status, use `git -c filter.lfs.clean= -c filter.lfs.smudge= -c filter.lfs.process= -c filter.lfs.required=false status --short`.
- Never disable LFS filters for `git add`, commits, or other object-writing operations.

## Execution Notes

- Start with the narrowest source-only search that can identify directly affected files.
- Exclude generated artifacts, binary CAD files, caches, and build outputs from default searches unless the task explicitly targets them.
- If the first pass makes scope clear, edit the source first and validate after.
- Do not run generation tools, `cadref`, and `snapshot` in parallel against geometry that is still changing in the same edit loop. Rebuild first, then inspect, then render.
- In cloud or constrained environments, avoid full-repo hydration when affected entries are known. Fetch only the needed inputs, generated outputs, and LFS objects for the entries being edited and explicitly regenerated.
