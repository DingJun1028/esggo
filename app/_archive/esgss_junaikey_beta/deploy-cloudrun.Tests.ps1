
Describe "deploy-cloudrun.ps1" {
    # Define a variable for the script path
    $scriptPath = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "deploy-cloudrun.ps1"

    # Before running any tests, load the script into the session
    BeforeAll {
        . $scriptPath
    }

    Context "GCP Authentication Check" {
        It "should exit if not authenticated" {
            # Mock gcloud auth list to simulate not being logged in
            Mock -Command "gcloud" -ParameterFilter { $args[0] -eq "auth" -and $args[1] -eq "list" } -MockWith {
                Write-Output "" # Simulate no active account
                $LASTEXITCODE = 1 # Simulate command failure
            }

            # Attempt to run the relevant part of the script that checks authentication
            # This is a bit tricky as the original script uses 'exit 1'.
            # For testing, we can wrap the relevant part in a try/catch or refactor the script to use functions
            # For now, we'll assume the script's 'exit 1' behavior would stop execution,
            # and we'll check if a specific error message was written to the host.
            # A more robust test would require refactoring the script into functions.

            # Since the script exits, we can't directly assert on exit code easily without complex setup.
            # Instead, we'll test the output.
            $ErrorActionPreference = "Continue" # Ensure errors don't stop the test
            $scriptOutput = Invoke-Command -ScriptBlock { . $scriptPath } | Out-String

            # The current script structure makes it hard to test the 'exit 1' directly with Pester.
            # A better approach would be to refactor the script into testable functions.
            # For this example, we'll check for the error message in the output if the script were to continue.
            # This mock might not directly cause an 'exit 1' in a test context without refactoring.
            # We'll simulate the part of the script responsible for checking auth.
            
            # Since the script has 'exit 1', running the whole script will terminate the test session.
            # A common Pester pattern for this is to wrap the script call in a function that then
            # calls the actual script, and then test the behavior of that wrapper.
            # Or, mock the 'exit' command, which Pester allows.

            Mock -Command "gcloud" -ParameterFilter { $args[0] -eq "auth" -and $args[1] -eq "list" } -MockWith {
                Write-Output "" # Simulate no active account
                $LASTEXITCODE = 1 # Simulate command failure
            }
            Mock -Command "exit" { param($code) throw "Exited with code $code" }

            { . $scriptPath } | Should -Throw "Exited with code 1"
            (Receive-Host | Out-String) | Should -Contain "❌ Not logged in. Please run: gcloud auth login"
        }

        It "should continue if authenticated" {
            # Mock gcloud auth list to simulate being logged in
            Mock -Command "gcloud" -ParameterFilter { $args[0] -eq "auth" -and $args[1] -eq "list" } -MockWith {
                Write-Output "some-account@example.com"
                $LASTEXITCODE = 0
            }

            # Mock subsequent gcloud calls to prevent actual execution,
            # allowing the script to proceed past authentication
            Mock -Command "gcloud" -ParameterFilter { $args[0] -eq "config" } -MockWith { $LASTEXITCODE = 0 }
            Mock -Command "gcloud" -ParameterFilter { $args[0] -eq "services" } -MockWith { $LASTEXITCODE = 0 }
            Mock -Command "gcloud" -ParameterFilter { $args[0] -eq "iam" } -MockWith { $LASTEXITCODE = 0 }
            Mock -Command "gcloud" -ParameterFilter { $args[0] -eq "run" } -MockWith { $LASTEXITCODE = 0 }
            Mock -Command "git.exe" -MockWith { Write-Output "abcdef1" }
            Mock -Command "docker" -MockWith { $LASTEXITCODE = 0 }
            Mock -Command "Write-Host" # Suppress Write-Host for cleaner output unless specifically testing it
            Mock -Command "Start-Sleep" # Suppress Start-Sleep
            Mock -Command "Invoke-WebRequest" -MockWith {
                return [pscustomobject]@{ StatusCode = 200 }
            }

            # Mock 'exit' to prevent the script from terminating the test session
            Mock -Command "exit" { param($code) if ($code -ne 0) { throw "Exited with code $code" } }

            # Running the script block directly
            $scriptOutput = Invoke-Command -ScriptBlock { . $scriptPath } -ErrorAction SilentlyContinue | Out-String

            $scriptOutput | Should -Contain "✓ Authenticated: some-account@example.com"
            $scriptOutput | Should -Contain "✓ Project set: junaikey-genesis"
            $scriptOutput | Should -Contain "✓ APIs enabled"
            $scriptOutput | Should -Contain "✓ Service Account exists"
            $scriptOutput | Should -Contain "✓ Git commit: abcdef1"
            $scriptOutput | Should -Contain "✓ Docker Build Success"
            $scriptOutput | Should -Contain "✓ Docker Push Success"
            $scriptOutput | Should -Contain "🎉 DEPLOYMENT SUCCESS!"
            $scriptOutput | Should -Contain "✓ Health Check Passed"
        }
    }
}
