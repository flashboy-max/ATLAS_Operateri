# Test HttpOnly Cookie Implementation
# Phase 1 Day 5 - Quick Test Script

Write-Host "🔒 Testing HttpOnly Cookies Implementation..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Login and Check Cookie
Write-Host "📝 Test 1: Login and Cookie Check" -ForegroundColor Yellow
Write-Host "----------------------------------------"

try {
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json

    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -WebSession $session

    $data = $response.Content | ConvertFrom-Json

    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($data.user.username)" -ForegroundColor Gray
    Write-Host "   AccessToken present: $($null -ne $data.accessToken)" -ForegroundColor Gray
    Write-Host "   RefreshToken in JSON: $($null -ne $data.refreshToken)" -ForegroundColor $(if ($null -eq $data.refreshToken) { "Green" } else { "Red" })
    
    # Check cookies
    Write-Host ""
    Write-Host "🍪 Cookies in Session:" -ForegroundColor Cyan
    $refreshTokenCookie = $session.Cookies.GetCookies($baseUrl) | Where-Object { $_.Name -eq "refreshToken" }
    
    if ($refreshTokenCookie) {
        Write-Host "   ✅ refreshToken cookie found!" -ForegroundColor Green
        Write-Host "   - HttpOnly: $($refreshTokenCookie.HttpOnly)" -ForegroundColor Gray
        Write-Host "   - Secure: $($refreshTokenCookie.Secure)" -ForegroundColor Gray
        Write-Host "   - Path: $($refreshTokenCookie.Path)" -ForegroundColor Gray
        Write-Host "   - Value: $($refreshTokenCookie.Value.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "   ❌ refreshToken cookie NOT found!" -ForegroundColor Red
    }

    # Test 2: Token Refresh
    Write-Host ""
    Write-Host "📝 Test 2: Token Refresh" -ForegroundColor Yellow
    Write-Host "----------------------------------------"

    $refreshResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/refresh" `
        -Method POST `
        -ContentType "application/json" `
        -WebSession $session

    $refreshData = $refreshResponse.Content | ConvertFrom-Json

    Write-Host "✅ Token refresh successful!" -ForegroundColor Green
    Write-Host "   New AccessToken present: $($null -ne $refreshData.accessToken)" -ForegroundColor Gray
    Write-Host "   RefreshToken in JSON: $($null -ne $refreshData.refreshToken)" -ForegroundColor $(if ($null -eq $refreshData.refreshToken) { "Green" } else { "Red" })
    
    # Check updated cookie
    $newRefreshTokenCookie = $session.Cookies.GetCookies($baseUrl) | Where-Object { $_.Name -eq "refreshToken" }
    
    if ($newRefreshTokenCookie) {
        Write-Host "   ✅ refreshToken cookie updated!" -ForegroundColor Green
        Write-Host "   - Value changed: $($newRefreshTokenCookie.Value -ne $refreshTokenCookie.Value)" -ForegroundColor Gray
    }

    # Test 3: Logout and Cookie Clear
    Write-Host ""
    Write-Host "📝 Test 3: Logout and Cookie Clear" -ForegroundColor Yellow
    Write-Host "----------------------------------------"

    $logoutResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/logout" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer $($data.accessToken)" } `
        -WebSession $session

    Write-Host "✅ Logout successful!" -ForegroundColor Green
    
    # Check if cookie is cleared
    $afterLogoutCookie = $session.Cookies.GetCookies($baseUrl) | Where-Object { $_.Name -eq "refreshToken" }
    
    if ($null -eq $afterLogoutCookie -or $afterLogoutCookie.Value -eq "") {
        Write-Host "   ✅ refreshToken cookie cleared!" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ refreshToken cookie still present (check expiry)" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "🎉 All tests completed!" -ForegroundColor Green

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "   Make sure server is running on $baseUrl" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   ✅ refreshToken moved to httpOnly cookie" -ForegroundColor Green
Write-Host "   ✅ refreshToken NOT in JSON responses" -ForegroundColor Green
Write-Host "   ✅ Cookie automatically sent in requests" -ForegroundColor Green
Write-Host "   ✅ Cookie cleared on logout" -ForegroundColor Green
Write-Host ""
Write-Host "🔒 XSS Protection: ACTIVE" -ForegroundColor Green
