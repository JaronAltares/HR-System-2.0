## Git Branching Strategy & Protection

This project follows a strict branching strategy as defined in the Sprint Deliverables document.

### Protected Branches
- `main` — Production branch (stable)
- `dev` — Main integration branch (default)

**Branch Protection Rules Applied:**
- Require a pull request before merging
- Require at least 1 approving review
- Include administrators
- No direct pushes to `main` or `dev`

### Branch Naming Convention

| Prefix            | Purpose                        | Example                              |
|-------------------|--------------------------------|--------------------------------------|
| `feat/`           | New features                   | `feat/employee-api`                  |
| `fix/`            | Bug fixes                      | `fix/login-bug`                      |
| `db/`             | Database changes               | `db/employee-rls-policies`           |
| `test/`           | Testing                        | `test/51-rights-matrix`              |
| `docs/`           | Documentation                  | `docs/user-manual`                   |
| `chore/`          | Config, tooling, setup         | `chore/github-branch-protection`     |

### Workflow Rules
- Work on feature branches only
- All PRs target `dev`
- PR must be reviewed by at least one teammate before merging
- Delete branch after successful merge

---

**Now do this:**

1. Paste the above content into `README.md` (you can put it after the project title).
2. Save the file (`Ctrl + S`)
3. Reply with: **`Saved`**

Then I will give you the commit and push commands.