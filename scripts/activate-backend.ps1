# ESG GO | Backend Setup Script
# v1.0 | Supreme Commander Mandate
# Purpose: Securely configure Supabase and NocoDB endpoints.

$ENV_FILE = ".env"

function Update-EnvVar($key, $value) {
    if (Select-String -Path $ENV_FILE -Pattern "^$key=") {
        (Get-Content $ENV_FILE) -replace "^$key=.*", "$key=$value" | Set-Content $ENV_FILE
        Write-Host "[v] Updated $key" -ForegroundColor Green
    } else {
        Add-Content -Path $ENV_FILE -Value "$key=$value"
        Write-Host "[+] Added $key" -ForegroundColor Cyan
    }
}

Write-Host "--- Activating Backend Endpoints ---" -ForegroundColor Blue

# --- NocoDB Configuration ---
Update-EnvVar "NOCODB_API_TOKEN" "ncb_3457befca0d16ea709c7e72b2c4f00a6d36d1063ca63dce9"
Update-EnvVar "NOCODB_BASE_URL" "https://app.nocodb.com"
Update-EnvVar "NOCODB_PROJECT_ID" "p_junaikey_beta" # Assuming based on API name

# --- Supabase Configuration ---
Update-EnvVar "NEXT_PUBLIC_SUPABASE_URL" "https://mruetmtibkbzfaawfjbm.supabase.co"
Update-EnvVar "NEXT_PUBLIC_SUPABASE_ANON_KEY" "sb_publishable_Ljpb0dn7cnVA97I7KE__GA_pqXuKONN"
Update-EnvVar "SUPABASE_DB_PASSWORD" "S1421680sA127178099"

# --- SMTP Configuration ---
Update-EnvVar "SMTP_HOST" "esgsunshine.com"
Update-EnvVar "SMTP_PORT" "465"
Update-EnvVar "SMTP_USER" "jun@esgsunshine.com"
Update-EnvVar "SMTP_PASS" "!S1421680s"

Write-Host "--- Configuration Applied Locally ---" -ForegroundColor Green
