# Quick Login Test with Debug
Write-Host "🧪 Quick Login Test with Debug Info" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"username":"admin","password":"admin123"}' `
        -UseBasicParsing

    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Backend Response:" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "   Has accessToken: $([bool]$data.accessToken)" -ForegroundColor Gray
    Write-Host "   Has refreshToken: $([bool]$data.refreshToken)" -ForegroundColor Gray  
    Write-Host "   Has user: $([bool]$data.user)" -ForegroundColor Gray
    Write-Host "   Has expiresIn: $([bool]$data.expiresIn)" -ForegroundColor Gray
    Write-Host "   ExpiresIn value: $($data.expiresIn)" -ForegroundColor Gray
    Write-Host "   User name: $($data.user.username)" -ForegroundColor Gray
    
    if ($data.accessToken -and $data.refreshToken -and $data.user) {
        Write-Host "✅ Backend returns NEW Redis session format!" -ForegroundColor Green
    } elseif ($data.token -and $data.user) {
        Write-Host "⚠️ Backend returns LEGACY token format!" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Backend returns UNKNOWN format!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Login test failed: $_" -ForegroundColor Red
}