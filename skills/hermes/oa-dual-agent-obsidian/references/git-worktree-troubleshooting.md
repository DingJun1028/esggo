# Git Worktree Troubleshooting (Windows)

## Problem
Git operations fail with `fatal: not a git repository` when the project directory is a worktree rather than the main repo root.

## Root Cause
When `.git` is a **directory** (not a gitfile), git searches upward from the current file. If the directory contains a `core.worktree` setting that points to a different path, or if the `.git` directory is actually a worktree-specific directory, git gets confused.

## Solution
Use the correct `--git-dir` and `--work-tree` flags:

```bash
# ❌ Wrong — doesn't work on worktrees
cd /c/Project/esggo && git status

# ✅ Correct — works on worktrees
cd /c/Project/esggo && git --git-dir=.git --work-tree=. status

# Or with absolute paths
git --git-dir=/c/Project/esggo/.git --work-tree=/c/Project/esggo status
```

## Fix: Correct the gitdir file
If the worktree's `gitdir` file is corrupted:

```bash
# The gitdir file in the worktree should point to the MAIN .git directory
echo "/c/Project/esggo/.git" > /c/Project/esggo/.git/worktrees/_verify_5tb/gitdir

# The main repo's .git might be a gitfile pointing elsewhere
cat /c/Project/_verify_5tb/.git  # Should show: gitdir: <path to main .git>
```

## Environment Variables (for CI/scripts)
```bash
export TENANCY_OCID=$(grep tenancy ~/.oci/config | cut -d= -f2)
export SUPPRESS_LABEL_WARNING=True  # Suppress OCI key warning
```

## OCI CLI Gotchas
1. **jmespath keys with hyphens fail**: `--query 'data[].region-name'` → use `--output json` + Python parse
2. **ADB storage must be integer TB**: `--data-storage-size-in-tbs 1` (not 0.02)
3. **Block volume min 50 GB**: `--size-in-gbs 50` (not 10)
4. **AMD launch "Out of host capacity"**: wrap in retry loop, cap 30 tries