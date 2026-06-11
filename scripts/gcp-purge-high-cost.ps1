# ESG GO | GPU & Artifact Registry Cleanup
# v1.0 | Mission: Financial Sovereignty

$PROJECT_ID = "esg-sunshine"

Write-Host "--- [OmniAgent] Initiating High-Cost Resource Purge ---" -ForegroundColor Red

# --- 1. Compute Engine (G4/GPU) ---
Write-Host "[*] Scanning for G4 standard instances..." -ForegroundColor Cyan
# gcloud compute instances list --filter="machineType:g4-standard-*" --project=$PROJECT_ID --format="value(name,zone)"

# --- 2. Artifact Registry (Storage) ---
Write-Host "[*] Scanning for Artifact repositories..." -ForegroundColor Cyan
# gcloud artifacts repositories list --project=$PROJECT_ID --format="value(name)"

# --- 3. Enforcement (Warning) ---
Write-Host "[!] COMMANDER NOTICE: This will permanently delete AI models and container images." -ForegroundColor Yellow
Write-Host "[!] Use 'gcloud artifacts repositories delete [NAME]' to stop the $950 billing leak." -ForegroundColor Magenta

Write-Host "--- Purge Commands Prepared ---" -ForegroundColor Green
