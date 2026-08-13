Analyze all staged and unstaged changes, then generate a well-structured commit message for the user.

## Steps

1. Run `git status` to see all changed and untracked files (never use `-uall` flag).
2. Run `git diff` to see unstaged changes and `git diff --cached` to see staged changes.
3. Run `git log --oneline -10` to understand the recent commit message style in this repo.
4. Analyze the changes and draft a commit message following these rules:

## Commit Message Format

Use **Conventional Commits** style consistent with this repo's history:

```
<type>(<scope>): <short summary>

<body - optional, explain WHY not WHAT>
```

### Types
- `feat` — new feature or capability
- `fix` — bug fix
- `docs` — documentation-only changes (MDX, guides, API specs)
- `style` — formatting, CSS, UI changes (no logic change)
- `refactor` — code restructuring without behavior change
- `chore` — build, config, dependency updates
- `perf` — performance improvement
- `test` — adding or updating tests
- `ci` — CI/CD pipeline changes

### Scope
Use the area of the codebase affected, e.g.:
- `chat` — ChatWidget, AI assistant features
- `staking` — staking docs or components
- `api` — API docs, OpenAPI specs
- `nav` — navigation, sidebar, header
- `build` — build config, webpack, plugins
- `deps` — dependency updates
- Component or section name as appropriate

### Rules
- Keep the summary line under 70 characters
- Use imperative mood ("add", "fix", "update", not "added", "fixes")
- Body should explain motivation/context when changes are non-trivial
- Do NOT include files that look like secrets (.env, credentials)
- Do NOT include .DS_Store or other OS-generated files

5. Present the commit message to the user and ask for confirmation before committing.
6. If confirmed, stage the relevant files (exclude .DS_Store and other OS artifacts) and create the commit with the message ending with:

   Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>

7. Run `git status` after commit to verify success.
