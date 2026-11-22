# Fix Vite Cache Permission Issues on Windows
# Run this script if you encounter EPERM errors

Write-Host "Fixing Vite cache issues..." -ForegroundColor Cyan

# Stop all Node processes
Write-Host ""
Write-Host "1. Stopping Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Clear Vite cache
Write-Host "2. Clearing Vite cache..." -ForegroundColor Yellow
$viteCachePath = "node_modules\.vite"
if (Test-Path $viteCachePath) {
    try {
        Remove-Item -Path $viteCachePath -Recurse -Force -ErrorAction Stop
        Write-Host "   Vite cache cleared successfully" -ForegroundColor Green
    } catch {
        Write-Host "   Could not clear cache: $_" -ForegroundColor Red
        Write-Host "   Try closing Explorer, pausing OneDrive, or run as Administrator" -ForegroundColor Yellow
    }
} else {
    Write-Host "   Vite cache already absent" -ForegroundColor Green
}

# Clear dist folder
Write-Host "3. Clearing build folder..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   Build folder cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done. Run npm run dev again." -ForegroundColor Green
Write-Host ""
Write-Host "Tips if EPERM returns:" -ForegroundColor Cyan
Write-Host "  - Close Explorer windows in this project folder" -ForegroundColor White
Write-Host "  - Pause OneDrive sync for this folder" -ForegroundColor White
Write-Host "  - Exclude node_modules from real-time antivirus scan" -ForegroundColor White
Write-Host "  - Run terminal as Administrator" -ForegroundColor White



















































