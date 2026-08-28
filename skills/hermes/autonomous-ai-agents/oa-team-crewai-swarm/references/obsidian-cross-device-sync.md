# Obsidian Cross-Device Sync — Free Options

## Option 1: iCloud Sync (Apple Ecosystem)

**Vault on iCloud Drive**: Syncs automatically between Mac, iPad, iPhone.
- Desktop: Set vault path to `~/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/<vault>`
- Mobile: Vault appears in Obsidian iOS app's iCloud vault picker
- **Hermes integration**: Both Obsidian and Hermes Desktop can use iCloud for their respective sync

**Limitation**: 5GB free tier shared across all iCloud services

## Option 2: GitHub Sync (via obsidian-git plugin)

**Setup**:
1. Install `obsidian-git` community plugin in Obsidian
2. Create a private GitHub repo
3. Configure SSH key or PAT token in the plugin settings
4. Auto-commit/push on a schedule (e.g., every 10 minutes)

**Mobile**:
- Install "Working Copy" app (free)
- Clone your vault repo
- In Obsidian iOS: "Open folder as vault" → select the Working Copy cloned directory
- Working Copy handles the sync, Obsidian reads/writes files

**Hermes integration**: Hermes skills, cron configs, and memories live in `~/.hermes/` — NOT in the vault. To sync Hermes config, use a separate mechanism (see Option 3 or 4).

## Option 3: Syncthing (LAN/WiFi P2P)

**Setup**:
1. Install Syncthing on desktop: `brew install syncthing` (macOS) or download from syncthing.net
2. Install "Syncthing" app on Android (free, F-Droid)
3. Create a folder in Syncthing for your Obsidian vault
4. Add your phone as a device, approve on both sides
5. On phone: In Syncthing app, add the folder, then point Obsidian iOS to "Open folder as vault" → select the Syncthing-synced directory

**Pros**: No cloud, completely private, works cross-platform
**Cons**: Requires both devices on same network or relay (for remote sync, set up a relay server)

## Option 4: Google Drive / Dropbox via folder mount

**Android**:
- Install "FolderSync" or "DriveSync" app
- Configure Google Drive/Dropbox account
- Set up sync pair: cloud folder ↔ local folder
- In Obsidian iOS: "Open folder as vault" → select the synced local folder

**Desktop**: Point Obsidian to the Google Drive/Dropbox sync folder

**macOS**: iCloud Drive is natively supported (Option 1)
**Windows**: Google Drive for Desktop or Dropbox desktop app

## Hermes Config Sync

Hermes Agent stores its data in `~/.hermes/` (or `%USERPROFILE%\.hermes\` on Windows). This is **separate from the Obsidian vault**. Options:

### A. Include .hermes/ in the same sync
- **Linux/macOS**: Add `~/.hermes/` to your iCloud Drive or Syncthing folder
- **Windows**: Add hermes config to your Google Drive folder
- **Caution**: This will sync API keys and secrets across devices — use with trusted sync only

### B. Syncthing for .hermes/ separately
- Set up a second Syncthing folder just for `.hermes/` between your devices
- Keeps vault sync and Hermes config sync independent

### C. TencentDB Agent Memory (for cross-device memory)
- Hermes supports TencentDB Agent Memory as a cloud memory backend
- Configure in Hermes settings: `memory_tencentdb` provider
- This syncs memories (not config) across devices via a shared database

## Recommended Setup for Most Users

1. **Obsidian vault**: Use iCloud (macOS) or Syncthing (cross-platform) for the vault itself
2. **Hermes config**: Use Syncthing to sync `~/.hermes/` between devices, or set up TencentDB Agent Memory for cloud-backed shared memory
3. **Mobile**: Use "Working Copy" for GitHub sync, or Syncthing app for P2P sync

## Cost Summary

| Method | Cost | Cloud Required | Notes |
|--------|------|-----------------|-------|
| iCloud Drive | Free (5GB) | Yes (Apple) | Easiest for Apple users |
| GitHub Private Repo | Free (500MB) | Yes (GitHub) | Requires Working Copy on mobile |
| Syncthing | Free | No | Most private, needs LAN setup |
| Google Drive / Dropbox | Free (15GB / 2GB) | Yes | FolderSync app needed on Android |
| TencentDB Agent Memory | Free tier available | Yes (Tencent) | Only syncs memories, not full config |
