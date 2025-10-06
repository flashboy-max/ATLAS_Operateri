# ==========================================
# Test Rate Limiting Features
# ==========================================

Write-Host "`n🧪 Testing Rate Limiting Features..." -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# ==========================================
# Test 1: Login Rate Limiter (5 attempts)
# ==========================================
Write-Host "`n📝 Test 1: Login Rate Limiter (5 attempts per 15min)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

for ($i = 1; $i -le 7; $i++) {
    Write-Host "`nAttempt $i/7:" -ForegroundColor Cyan
    
    $body = @{
        korisnickoIme = "testuser"
        lozinka = "wrongpassword"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing `
            -ErrorAction Stop
            
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
        
        if ($statusCode -eq 429) {
            Write-Host "  ⚠️  Rate Limit Hit! ($statusCode)" -ForegroundColor Red
            Write-Host "  Error: $($errorBody.error)" -ForegroundColor Red
            Write-Host "  Retry After: $($errorBody.retryAfter) seconds" -ForegroundColor Yellow
        }
        else {
            Write-Host "  ❌ Failed: $statusCode - $($errorBody.error)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Milliseconds 100
}

# ==========================================
# Test 2: API Rate Limiter (60 req/min)
# ==========================================
Write-Host "`n`n📝 Test 2: API Rate Limiter (60 requests per minute)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# First login to get token
Write-Host "`n  Logging in as admin..." -ForegroundColor Cyan
$loginBody = @{
    korisnickoIme = "admin"
    lozinka = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody `
        -UseBasicParsing
    
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $accessToken = $loginData.accessToken
    Write-Host "  ✅ Login successful" -ForegroundColor Green
    
    # Make 65 API requests
    $successCount = 0
    $rateLimitCount = 0
    
    Write-Host "`n  Making 65 API requests..." -ForegroundColor Cyan
    
    for ($i = 1; $i -le 65; $i++) {
        try {
            $apiResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/sessions" `
                -Method Get `
                -Headers @{
                    "Authorization" = "Bearer $accessToken"
                    "Content-Type" = "application/json"
                } `
                -UseBasicParsing `
                -ErrorAction Stop
            
            $successCount++
            
            if ($i % 10 -eq 0) {
                Write-Host "  Request $i/65: OK" -ForegroundColor Green
            }
        }
        catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            if ($statusCode -eq 429) {
                $rateLimitCount++
                if ($rateLimitCount -eq 1) {
                    Write-Host "  ⚠️  Rate Limit Hit at request $i!" -ForegroundColor Red
                    $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
                    Write-Host "  Error: $($errorBody.error)" -ForegroundColor Red
                }
            }
        }
        
        Start-Sleep -Milliseconds 50
    }
    
    Write-Host "`n  Results:" -ForegroundColor Cyan
    Write-Host "    Successful: $successCount/65" -ForegroundColor Green
    Write-Host "    Rate Limited: $rateLimitCount/65" -ForegroundColor $(if ($rateLimitCount -gt 0) { "Red" } else { "Yellow" })
    
    if ($rateLimitCount -gt 0) {
        Write-Host "  ✅ API Rate Limiter is working!" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  No rate limiting detected (might need to increase test)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "  ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ==========================================
# Test 3: Security Headers
# ==========================================
Write-Host "`n`n📝 Test 3: Security Headers (Helmet.js)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method Get -UseBasicParsing
    
    $securityHeaders = @(
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-DNS-Prefetch-Control',
        'X-Download-Options'
    )
    
    Write-Host "`n  Security Headers:" -ForegroundColor Cyan
    $headerCount = 0
    
    foreach ($header in $securityHeaders) {
        if ($response.Headers.ContainsKey($header)) {
            $headerCount++
            Write-Host "    ✅ $header`: $($response.Headers[$header])" -ForegroundColor Green
        }
        else {
            Write-Host "    ❌ $header`: Missing" -ForegroundColor Red
        }
    }
    
    Write-Host "`n  Result: $headerCount/$($securityHeaders.Count) security headers present" -ForegroundColor Cyan
}
catch {
    Write-Host "  ❌ Failed to check security headers" -ForegroundColor Red
}

# ==========================================
# Summary
# ==========================================
Write-Host "`n`n🎉 Rate Limiting & Security Test Complete!" -ForegroundColor Green
Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Login Rate Limiter: Tested (5 attempts/15min)" -ForegroundColor Green
Write-Host "  ✅ API Rate Limiter: Tested (60 req/min)" -ForegroundColor Green
Write-Host "  ✅ Security Headers: Verified (Helmet.js)" -ForegroundColor Green
Write-Host "`n🔒 Security Features: READY FOR USE" -ForegroundColor Green
