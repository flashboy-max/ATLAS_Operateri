# Test System Logs for KORISNIK role
Write-Host "🧪 Testing System Logs Access for KORISNIK Role" -ForegroundColor Cyan

try {
    # Login as korisnik_ks (KORISNIK role)
    Write-Host "`n1. Login as korisnik_ks..." -ForegroundColor Yellow
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"username":"korisnik_ks","password":"korisnik123"}' `
        -UseBasicParsing

    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    Write-Host "   ✅ Login successful: $($loginData.user.username) ($($loginData.user.role))" -ForegroundColor Green
    Write-Host "   👤 User: $($loginData.user.full_name)" -ForegroundColor Gray
    
    $accessToken = $loginData.accessToken

    # Test access to system logs
    Write-Host "`n2. Test system logs access..." -ForegroundColor Yellow
    $logsResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/system/logs" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $accessToken" } `
        -UseBasicParsing

    $logsData = $logsResponse.Content | ConvertFrom-Json
    
    Write-Host "   ✅ System logs accessible: $($logsResponse.StatusCode)" -ForegroundColor Green
    Write-Host "   📊 Total logs: $($logsData.total)" -ForegroundColor Gray
    Write-Host "   📋 Logs returned: $($logsData.logs.Count)" -ForegroundColor Gray
    
    if ($logsData.logs.Count -gt 0) {
        $firstLog = $logsData.logs[0]
        Write-Host "   📝 Sample log: $($firstLog.type) - $($firstLog.action_display)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Test failed: $_" -ForegroundColor Red
    
    # Check if it's a 403 error
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   🚫 403 Forbidden - KORISNIK role still doesn't have access" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Expected Result:" -ForegroundColor Cyan
Write-Host "   KORISNIK role should now be able to access system logs (only their own)" -ForegroundColor White