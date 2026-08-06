# Fix permission issue for Hermes installation
# Change installation directory to user-writable location

$HERMES_HOME = "C:\Users\Administrator\hermes-agent"

# Ensure directory exists
if (-not (Test-Path $HERMES_HOME)) {
    New-Item -ItemType Directory -Path $HERMES_HOME -Force | Out-Null
}

# Update environment variables
$env:HERMES_HOME = $HERMES_HOME

# Update PATH to include the new installation directory
$env:PATH = Join-Path $HERMES_HOME "hermes-agent\node\node.exe" + ";" + $env:PATH