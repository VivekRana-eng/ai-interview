# GitHub rulesets — import instructions

Import these JSON files to lock down branches for the intern workflow.

## Steps

1. Open **https://github.com/Kabir-Yadav/SelectAI/settings/rules**
2. Click **New ruleset** → **Import a ruleset**
3. Upload each file **one at a time** (order does not matter):
   - `protect-main.json`
   - `protect-intern-dev.json`
4. Review each imported ruleset and click **Create** (or **Save**)

## What each ruleset does

| File | Branch | Effect |
|------|--------|--------|
| `protect-main.json` | `main` | No direct push. PR + CODEOWNERS approval required. Only **admin** can merge. |
| `protect-intern-dev.json` | `intern-dev` | No direct push. PR + 1 approval required. Only **admin** can merge. |

Interns push freely to `intern/<name>/<task>` branches (no ruleset). They open PRs into `intern-dev` or `main` but **cannot merge** — only repo admin (`Kabir-Yadav`) can.

## Personal repo note

`bypass_actors` uses `RepositoryRole` with `actor_id: 5` (admin). Do **not** use `OrganizationAdmin` — that fails on personal repos.

## After import

Add interns under **Settings → Collaborators** with **Write** access (not Admin).
