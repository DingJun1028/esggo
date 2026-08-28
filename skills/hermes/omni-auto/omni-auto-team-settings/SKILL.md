---
name: omni-auto-team-settings
description: "OA-Team collaborative workflow settings for OmniAuto project"
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [omni-auto, team, collaboration, settings]
    related_skills: [hermes-usage-best-practices]
---

# OA-Team Settings Implementation

## Overview

This skill documents the OA-Team collaborative workflow settings for the OmniAuto project, including pitfalls and implementation notes from real incidents.

## Configuration Variables

The following environment variables control team features:

- `TEAM_MEMBERS`: JSON array of team member info
  - Format: `[{"id": "user1", "name": "Name", "role": "admin", "email": "email@example.com"}]`
- `TEAM_PROJECTS`: JSON array of team projects
  - Format: `[{"id": "project1", "name": "Project Name", "owner": "user1"}]`
- `TEAM_NOTIFICATION_WEBHOOK`: Slack/Discord webhook URL for team alerts
- `TEAM_DEFAULT_PROJECT`: Default project for team work (default: "omni-auto-main")

## Role-Based Permissions

```python
TEAM_ROLE_PERMISSIONS = {
    "admin": ["create_job", "delete_job", "view_all", "manage_project"],
    "editor": ["create_job", "view_own", "edit_own"],
    "viewer": ["view_own"],
    "guest": ["view_own"],
}
```

## Pitfall: Test Failures After Adding Team Features

**Reference:** Session 2026-07-28

When adding new keys to `feature_summary()` in config.py:
1. Tests checking `len(fs) == 5` will fail when you add new modules
2. Always update test assertions when extending feature_summary
3. Alternatively, make tests check for specific keys rather than total count

**Example fix:**
```python
# In test_feature_summary_has_all_modules
assert isinstance(fs, dict) and len(fs) == 6  # Updated for OA-Team features
```

## Helper Functions

```python
def get_team_member(member_id: str) -> Optional[dict]
def get_team_projects() -> list[dict]
def has_permission(member_id: str, action: str) -> bool
def send_team_notification(message: str, level: str = "info") -> bool
```

## Support Files

- `references/oa-team-settings-pitfall.md` - Detailed incident report on test failures