# Contributing — Intern workflow

SelectAI uses a protected `main` branch. Interns work on feature branches and open pull requests; only the maintainer merges.

## Setup (first time)

```bash
git clone https://github.com/Kabir-Yadav/SelectAI.git
cd SelectAI
git checkout intern-dev
git pull origin intern-dev
```

## Daily workflow

```bash
# Start from the latest intern integration branch
git checkout intern-dev
git pull origin intern-dev

# Create your task branch (use your name + short task description)
git checkout -b intern/your-name/short-task-name

# Work, commit, push
git add .
git commit -m "feat: describe your change"
git push -u origin intern/your-name/short-task-name
```

Then on GitHub: open a **Pull Request** into `intern-dev` (or `main` if your maintainer asks). **Do not merge** — wait for review.

## Branch rules

| Branch                 | Who pushes          | Who merges      |
| ---------------------- | ------------------- | --------------- |
| `main`                 | Maintainer only     | Maintainer only |
| `intern-dev`           | Via PR after review | Maintainer      |
| `intern/<name>/<task>` | You (intern)        | N/A — open a PR |

## Naming

- Branch: `intern/firstname/task-name` (e.g. `intern/priya/apply-form`)
- Commits: short imperative message (`feat: add job filter`, `fix: status polling`)

## Before you push

1. Run `cd frontend && npm run format`
2. Run `cd frontend && npm run build` if you changed frontend code
3. Read `.cursor/rules/selectai-project.mdc` and `PROGRESS.md` for current tasks
4. Never commit secrets — no `.env.local`, API keys, or Supabase service role keys

## Questions

Ask your maintainer before changing architecture, database schema, or `lib/api/*` function signatures.
