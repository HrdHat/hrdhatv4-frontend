# Github Branching Policy & Code of Conduct

## Branch Overview

### 1. `sandbox-chapter-1`

- **Purpose:** Main development branch for active features and experimentation.
- **Who works here:** All developers.
- **Docs:** All documentation and progress updates are included.
- **Rules:**
  - Frequent commits encouraged.
  - Feature branches should be created for major features or experiments.
  - Code reviews are optional but recommended for large changes.

### 2. `main`

- **Purpose:** Stable branch for battle-tested, reviewed code.
- **Who works here:** Maintainers and reviewers.
- **Docs:** All documentation and progress updates are included.
- **Rules:**
  - Only merge code that has been tested in `sandbox-chapter-1`.
  - All merges should use descriptive commit messages (e.g., "Chapter 1 partially complete").
  - Code reviews required for all merges.
  - No direct commits—use pull/merge requests from `sandbox-chapter-1` or feature branches.

### 3. `live`

- **Purpose:** Production branch for Vercel deployment.
- **Who works here:** Maintainers only.
- **Docs:** No documentation or progress updates—keep branch lightweight.
- **Rules:**
  - Only merge from `main` after final verification.
  - No direct commits—use pull/merge requests from `main` only.
  - All merges must pass final safety and deployment checks.

---

## Promotion Workflow

1. **Develop in `sandbox-chapter-1`**
   - Commit and push changes frequently.
   - Keep documentation and progress updates up to date.
2. **Promote to `main`**
   - Only after code is tested and reviewed.
   - Use pull/merge requests with clear descriptions.
   - Ensure all documentation is present.
3. **Promote to `live`**
   - Only after final verification and approval.
   - Remove all documentation and progress updates before merging.
   - Use pull/merge requests from `main` only.

---

## Code of Conduct

- Write clear, descriptive commit messages.
- No force pushes to `main` or `live`.
- All merges to `main` and `live` must be reviewed
- Keep `live` branch lightweight—no docs or unnecessary files.
- Use feature branches for major features or experiments.
- Keep documentation up to date in `sandbox-chapter-1` and `main`.
- Respect the workflow and branch purposes.

---

_Last updated: June 2024_
