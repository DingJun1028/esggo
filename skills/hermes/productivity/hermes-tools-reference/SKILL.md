---
name: hermes-tools-reference
description: Quick reference for available Hermes Agent tools and skills
category: productivity
---

# Hermes Tools & Skills Reference

## Overview
This skill provides quick reference for available tools and skills in Hermes Agent.

## Available Toolsets (31 tools)

### Browser Tools
- `browser_back` - Navigate back to previous page
- `browser_click` - Click element by ref ID
- `browser_navigate` - Navigate to URL
- `browser_type` - Type text into input field
- `browser_press` - Press keyboard key
- `browser_scroll` - Scroll page up/down
- `browser_snapshot` - Get page accessibility tree snapshot
- `browser_vision` - Take screenshot for visual analysis
- `browser_get_images` - Get list of images on page
- `browser_console` - Get browser console output

### File Tools
- `read_file` - Read text file with pagination
- `write_file` - Write content to file
- `patch` - Targeted find-and-replace edits
- `search_files` - Search file contents or find files by name

### Code Execution
- `execute_code` - Run Python script with Hermes tools

### Image Generation
- `image_generate` - Generate images from text prompts

### Terminal
- `terminal` - Execute shell commands

### Other Tools
- `cronjob` - Manage scheduled cron jobs
- `delegate_task` - Spawn subagents for tasks
- `text_to_speech` - Convert text to speech
- `todo` - Manage task list
- `memory` - Save durable facts
- `clarify` - Ask user questions
- `vision_analyze` - Analyze images
- `web_search` - Search the web
- `web_extract` - Extract content from URLs

## MCP Servers
- `my-server` (stdio) - connecting

## Available Skills (86 skills) by Category

### Autonomous AI Agents
- claude-code, codex, opencode, hermes-agent, windows-hermes-update-troubleshooting

### Cloud
- oci-vm-ops

### Creative
- architecture-diagram, ascii-art, ascii-video, baoyu-infographic, claude-design, comfyui, design-md, excalidraw, humanizer, manim-video, p5js, popular-web-designs, pretext, sketch, songwriting-and-ai-music, touchdesigner-mcp

### Data Science
- jupyter-live-kernel

### Desktop
- hermes-desktop-plugin-all-surfaces

### DevOps
- cloudflare-godaddy-dns

### Email
- himalaya

### General
- computer-use, dogfood, github, media, mlops, note-taking, productivity, research, smart-home, software-development

### GitHub Skills
- codebase-inspection, github-auth, github-code-review, github-issues, github-pr-conflict-resolution, github-pr-workflow, github-repo-management, github-secrets, github-wiki-publishing

### Media Skills
- gif-search, heartmula, songsee, youtube-content

### ML Ops
- huggingface-hub, llama-cpp, segment-anything-model, weights-and-biases

### Note Taking
- obsidian

### Productivity
- airtable, docx, esggo-style, google-workspace, maps, nano-pdf, notion, ocr-and-documents, pdf, petdex, powerpoint, teams-meeting-pipeline, tui-widgets, xlsx

### Research
- arxiv, blogwatcher, llm-wiki, polymarket

### Smart Home
- openhue

### Software Development
- cloud-instance-immutable-metadata, cross-repo-type-sync, esggo-learning-center-ui-cleanup, firebase-react-apps, google-apps-script-automation, hermes-agent-skill-authoring, hermes-usage-best-practices, jsx-safe-refactoring, node-inspect-debugger, plan, reporting-hygiene, requesting-code-review, simplify-code, spa-ssl-deployment, spike, systematic-debugging, test-driven-development, vps-bootstrap-and-deploy

## Usage Examples

### Using Browser Tools
```
browser_navigate(url="https://example.com")
browser_click(ref="@e5")
browser_type(ref="@e3", text="hello world")
```

### Using File Tools
```
read_file(path="/path/to/file.txt")
write_file(path="/path/to/new.txt", content="content")
patch(path="file.py", old_string="old", new_string="new")
```

### Using Cronjob
```
cronjob(action="create", schedule="0 9 * * *", prompt="Daily task", model={"provider": "anthropic", "model": "claude-sonnet-4"})
```

### Using Delegate Task
```
delegate_task(goal="Research topic X", context="Background info")
```