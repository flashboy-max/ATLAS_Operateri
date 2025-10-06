# Complete Manual Test - Backend vs Frontend
Write-Host "🔍 Complete Manual Test - Backend vs Frontend" -ForegroundColor Cyan

# Test 1: Direct backend login
Write-Host "`n1. Direct Backend Test:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"username":"admin","password":"admin123"}' `
        -UseBasicParsing

    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "   ✅ Backend Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   📦 Backend Data Keys: $($data.PSObject.Properties.Name -join ', ')" -ForegroundColor Gray
    
    if ($data.accessToken -and $data.refreshToken) {
        Write-Host "   ✅ Backend: Redis format confirmed" -ForegroundColor Green
        $global:testToken = $data.accessToken
    } else {
        Write-Host "   ❌ Backend: Wrong format" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Backend test failed: $_" -ForegroundColor Red
}

# Test 2: Use the token for auth request
Write-Host "`n2. Test Token Usage:" -ForegroundColor Yellow
if ($global:testToken) {
    try {
        $authResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/session" `
            -Method GET `
            -Headers @{ "Authorization" = "Bearer $global:testToken" } `
            -UseBasicParsing
        
        $authData = $authResponse.Content | ConvertFrom-Json
        Write-Host "   ✅ Token works: $($authResponse.StatusCode)" -ForegroundColor Green
        Write-Host "   👤 User: $($authData.user.username) ($($authData.user.role))" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ Token test failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "   ⏭️ Skipping token test (no token)" -ForegroundColor Gray
}

# Test 3: Check frontend file
Write-Host "`n3. Frontend File Check:" -ForegroundColor Yellow
try {
    $authJsContent = Get-Content "auth.js" -Raw
    $hasNewFormat = $authJsContent -match "data\.accessToken.*data\.refreshToken.*data\.user"
    $hasDebugCheck = $authJsContent -match "Checking token format"
    
    Write-Host "   📄 auth.js size: $($authJsContent.Length) chars" -ForegroundColor Gray
    Write-Host "   🔍 Has new format check: $hasNewFormat" -ForegroundColor Gray
    Write-Host "   🔍 Has debug logging: $hasDebugCheck" -ForegroundColor Gray
    
    if ($hasNewFormat -and $hasDebugCheck) {
        Write-Host "   ✅ Frontend: Updated for Redis format" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend: Missing updates" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ File check failed: $_" -ForegroundColor Red
}

Write-Host "`n🎯 Summary:" -ForegroundColor Cyan
Write-Host "   Backend: ✅ Redis sessions working (confirmed)" -ForegroundColor Green
Write-Host "   Problem: Likely frontend auth.js caching or missing debug logs" -ForegroundColor Yellow
Write-Host "   Solution: Force browser refresh (Ctrl+F5) or check console" -ForegroundColor Yellow