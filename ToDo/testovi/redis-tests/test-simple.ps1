# Simple Redis Session Test
# Test login and verify tokens

Write-Host "`n🧪 Testing Redis Session Management`n" -ForegroundColor Cyan

# Test 1: Login
Write-Host "Test 1: Login" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"username":"admin","password":"admin123"}' `
        -UseBasicParsing
    
    $loginData = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Access Token: $($loginData.accessToken.Substring(0, 60))..." -ForegroundColor Gray
    Write-Host "   Refresh Token: $($loginData.refreshToken.Substring(0, 40))..." -ForegroundColor Gray
    Write-Host "   Expires In: $($loginData.expiresIn) seconds (15 minutes)" -ForegroundColor Gray
    Write-Host "   User: $($loginData.user.username) - $($loginData.user.full_name)" -ForegroundColor Gray
    
    $global:accessToken = $loginData.accessToken
    $global:refreshToken = $loginData.refreshToken
    
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Check session endpoint
Write-Host "`nTest 2: Check session endpoint" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/session" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $global:accessToken" } `
        -UseBasicParsing
    
    $sessionData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Session valid!" -ForegroundColor Green
    Write-Host "   User: $($sessionData.user.username)" -ForegroundColor Gray
    Write-Host "   Role: $($sessionData.user.role)" -ForegroundColor Gray
    Write-Host "   Device: $($sessionData.user.deviceName)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Session check failed: $_" -ForegroundColor Red
}

# Test 3: List sessions
Write-Host "`nTest 3: List user sessions" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/sessions" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $global:accessToken" } `
        -UseBasicParsing
    
    $sessionsData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Sessions listed: $($sessionsData.sessions.Count) active" -ForegroundColor Green
    
    foreach ($session in $sessionsData.sessions) {
        $current = if ($session.isCurrent) { " (CURRENT)" } else { "" }
        Write-Host "   - $($session.deviceName) from $($session.ip)$current" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ List sessions failed: $_" -ForegroundColor Red
}

# Test 4: Logout
Write-Host "`nTest 4: Logout" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/logout" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer $global:accessToken" } `
        -UseBasicParsing
    
    Write-Host "✅ Logout successful!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Logout failed: $_" -ForegroundColor Red
}

# Test 5: Verify token is invalid after logout
Write-Host "`nTest 5: Verify token expired after logout" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/session" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $global:accessToken" } `
        -UseBasicParsing
    
    Write-Host "❌ Token still valid (should be expired)" -ForegroundColor Red
    
} catch {
    Write-Host "✅ Token expired as expected!" -ForegroundColor Green
}

Write-Host "`n🎉 All tests completed!`n" -ForegroundColor Cyan
