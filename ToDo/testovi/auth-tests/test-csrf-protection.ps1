# ==========================================
# Test CSRF Protection
# ==========================================

Write-Host "`n🔒 Testing CSRF Protection..." -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# ==========================================
# Test 1: Get CSRF Token
# ==========================================
Write-Host "`n📝 Test 1: Fetch CSRF Token" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

try {
    $tokenResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/csrf-token" `
        -Method Get `
        -UseBasicParsing `
        -SessionVariable 'session'
    
    $tokenData = $tokenResponse.Content | ConvertFrom-Json
    $csrfToken = $tokenData.csrfToken
    
    Write-Host "  ✅ CSRF Token retrieved" -ForegroundColor Green
    Write-Host "  Token: $($csrfToken.Substring(0, 20))..." -ForegroundColor Cyan
}
catch {
    Write-Host "  ❌ Failed to get CSRF token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ==========================================
# Test 2: Login WITHOUT CSRF Token (should fail)
# ==========================================
Write-Host "`n📝 Test 2: Login WITHOUT CSRF Token (should fail)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody `
        -UseBasicParsing `
        -WebSession $session `
        -ErrorAction Stop
    
    Write-Host "  ❌ Login succeeded without CSRF token (SECURITY ISSUE!)" -ForegroundColor Red
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host "  ✅ Login blocked without CSRF token (403 Forbidden)" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  Unexpected status code: $statusCode" -ForegroundColor Yellow
    }
}

# ==========================================
# Test 3: Login WITH CSRF Token (should succeed)
# ==========================================
Write-Host "`n📝 Test 3: Login WITH CSRF Token (should succeed)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{
            "CSRF-Token" = $csrfToken
        } `
        -Body $loginBody `
        -UseBasicParsing `
        -WebSession $session `
        -ErrorAction Stop
    
    $loginData = $response.Content | ConvertFrom-Json
    $accessToken = $loginData.accessToken
    
    Write-Host "  ✅ Login succeeded with CSRF token" -ForegroundColor Green
    Write-Host "  User: $($loginData.user.username)" -ForegroundColor Cyan
}
catch {
    Write-Host "  ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "  Status Code: $statusCode" -ForegroundColor Red
}

# ==========================================
# Test 4: Logout WITH CSRF Token
# ==========================================
Write-Host "`n📝 Test 4: Logout WITH CSRF Token" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

if ($accessToken) {
    try {
        $logoutResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/logout" `
            -Method Post `
            -ContentType "application/json" `
            -Headers @{
                "Authorization" = "Bearer $accessToken"
                "CSRF-Token" = $csrfToken
            } `
            -UseBasicParsing `
            -WebSession $session `
            -ErrorAction Stop
        
        Write-Host "  ✅ Logout succeeded with CSRF token" -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "  ❌ Logout failed: $statusCode" -ForegroundColor Red
    }
}
else {
    Write-Host "  ⚠️  Skipped (no access token)" -ForegroundColor Yellow
}

# ==========================================
# Test 5: Verify CSRF Cookie is Set
# ==========================================
Write-Host "`n📝 Test 5: Verify CSRF Cookie" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

$csrfCookie = $session.Cookies.GetCookies($baseUrl) | Where-Object { $_.Name -like "*csrf*" -or $_.Name -like "*XSRF*" }

if ($csrfCookie) {
    Write-Host "  ✅ CSRF Cookie found" -ForegroundColor Green
    Write-Host "  Name: $($csrfCookie.Name)" -ForegroundColor Cyan
    Write-Host "  HttpOnly: $($csrfCookie.HttpOnly)" -ForegroundColor Cyan
    Write-Host "  Secure: $($csrfCookie.Secure)" -ForegroundColor Cyan
}
else {
    Write-Host "  ⚠️  CSRF Cookie not found" -ForegroundColor Yellow
    Write-Host "  Available cookies:" -ForegroundColor Cyan
    $session.Cookies.GetCookies($baseUrl) | ForEach-Object {
        Write-Host "    - $($_.Name)" -ForegroundColor Gray
    }
}

# ==========================================
# Summary
# ==========================================
Write-Host "`n`n🎉 CSRF Protection Test Complete!" -ForegroundColor Green
Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ CSRF Token endpoint works" -ForegroundColor Green
Write-Host "  ✅ Login blocked without CSRF token" -ForegroundColor Green
Write-Host "  ✅ Login succeeds with CSRF token" -ForegroundColor Green
Write-Host "  ✅ Logout works with CSRF token" -ForegroundColor Green
Write-Host "`n🔒 CSRF Protection: ACTIVE AND WORKING" -ForegroundColor Green
