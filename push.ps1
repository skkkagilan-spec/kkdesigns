# ==============================================================================
# Push KK Designs repository to GitHub
# Target: https://github.com/skkkagilan-spec/kkdesigns.git
# ==============================================================================

$git = "C:\Users\sures\.gemini\antigravity-ide\scratch\mingit\cmd\git.exe"
$repoUrl = "https://github.com/skkkagilan-spec/kkdesigns.git"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Pushing KK Designs to GitHub: $repoUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if a token was passed as an argument
param(
    [string]$token = ""
)

if (-not [string]::IsNullOrWhiteSpace($token)) {
    # If token provided, push with authenticated URL
    $authUrl = "https://$token@github.com/skkkagilan-spec/kkdesigns.git"
    Write-Host "`nPushing with provided Personal Access Token..." -ForegroundColor Yellow
    & $git push -u $authUrl main
} else {
    Write-Host "`nPushing to remote origin main..." -ForegroundColor Yellow
    Write-Host "If prompted, enter your GitHub Username and Personal Access Token." -ForegroundColor Gray
    & $git push -u origin main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nRepository successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "View online at: https://github.com/skkkagilan-spec/kkdesigns" -ForegroundColor Green
} else {
    Write-Host "`nPush did not complete automatically." -ForegroundColor Red
    Write-Host "To push using your GitHub Personal Access Token, run:" -ForegroundColor Yellow
    Write-Host "  .\push.ps1 -token YOUR_GITHUB_TOKEN" -ForegroundColor White
}
