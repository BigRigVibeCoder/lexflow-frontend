---
description: How to commit code changes in lexflow-frontend (handles parent repo + codex submodule)
---

# Git Commit Workflow — lexflow-frontend

This workflow handles commits for the `lexflow-frontend` repo which contains a `codex/` git submodule pointing to `lexflow-codex`. The submodule and parent repo are separate git repositories — commits must be handled in the correct order.

## Pre-Flight Checks

// turbo
1. Check status of both repos:
```bash
cd /home/bdavidriggins/Documents/lexpro/lexflow-frontend && echo "=== PARENT REPO ===" && git status --short && echo "=== CODEX SUBMODULE ===" && cd codex && git status --short && cd ..
```

If the codex submodule has changes, start at **Step A**. If only the parent repo has changes, skip to **Step B**.

---

## Step A: Commit Codex Submodule Changes (if any)

The codex submodule is its own git repo. Changes inside `codex/` must be committed there FIRST, then the updated submodule reference gets committed in the parent repo.

2. Stage and commit codex submodule changes:
```bash
cd /home/bdavidriggins/Documents/lexpro/lexflow-frontend/codex && git add -A && git commit -m "<type>(<scope>): <description>"
```

3. Push codex submodule:
```bash
cd /home/bdavidriggins/Documents/lexpro/lexflow-frontend/codex && git push origin main
```

> **Note:** Only commit to the codex submodule if you created/modified CODEX documents (DEF-, EVO-, etc.). Frontend code changes go in the parent repo only.

---

## Step B: Commit Parent Repo Changes

4. Create a feature branch (if not already on one):
```bash
cd /home/bdavidriggins/Documents/lexpro/lexflow-frontend && git checkout -b feature/SPR-NNN-TXXX-short-description
```

> **Branch naming convention (GOV-005 §5.1):**
> - Sprint task: `feature/SPR-NNN-TXXX-short-description`
> - Bug fix: `fix/DEF-NNN-short-description`
> - Research: `research/RES-NNN-short-description`

5. Stage all parent repo changes (includes updated submodule ref if Step A was done):
// turbo
```bash
cd /home/bdavidriggins/Documents/lexpro/lexflow-frontend && git add -A
```

6. Review what's staged:
// turbo
```bash
cd /home/bdavidriggins/Documents/lexpro/lexflow-frontend && git diff --cached --stat
```

7. Commit with proper format:
```bash
cd /home/bdavidriggins/Documents/lexpro/lexflow-frontend && git commit -m "<type>(SPR-NNN): <description>"
```

> **Commit message format (GOV-005 §5.2):**
> ```
> type(scope): short description
>
> Why: [reason this change exists]
> What: [what was changed]
> Agent: frontend
> Refs: [CODEX document IDs]
> ```
>
> **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`
>
> **Examples:**
> - `feat(SPR-001): scaffold Next.js 15 project with governance compliance`
> - `fix(DEF-003): correct trust client retry logic`
> - `test(SPR-002): add auth middleware unit tests`
> - `ci(SPR-001): add GitHub Actions CI pipeline`

8. Push the branch:
```bash
cd /home/bdavidriggins/Documents/lexpro/lexflow-frontend && git push -u origin $(git branch --show-current)
```

---

## Commit Order Summary

```
1. codex/ submodule changes committed + pushed (if any)
     ↓
2. Parent repo sees submodule as "modified" (new commit ref)
     ↓
3. Parent repo: git add -A (picks up code changes + submodule ref update)
     ↓
4. Parent repo: git commit + push
```

> **⚠️ NEVER** commit the parent repo first if the submodule has uncommitted changes — the parent will record a stale submodule ref.

---

## Quick Reference: Common Scenarios

### Scenario 1: Code-only changes (no CODEX edits)
Skip Step A entirely. Just do Steps 4–8.

### Scenario 2: CODEX-only changes (filed a DEF- or EVO- doc)
Do Steps A.2–A.3 for the submodule, then Steps B.5–B.8 for the parent (to update submodule ref).

### Scenario 3: Both code and CODEX changes
Do all steps in order: A first, then B.
