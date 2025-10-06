# Redis Session Testing Script
# Run each command separately to test the Redis session implementation

# Test 1: Login and get tokens
Write-Host "`n=== Test 1: Login ===" -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"username":"admin","password":"admin123"}'

Write-Host "✅ Login successful!" -ForegroundColor Green
Write-Host "Access Token: $($loginResponse.accessToken.Substring(0, 50))..." -ForegroundColor Yellow
Write-Host "Refresh Token: $($loginResponse.refreshToken.Substring(0, 32))..." -ForegroundColor Yellow
Write-Host "Expires In: $($loginResponse.expiresIn) seconds" -ForegroundColor Yellow
Write-Host "User: $($loginResponse.user.username) ($($loginResponse.user.role))" -ForegroundColor Yellow

# Save tokens for other tests
$accessToken = $loginResponse.accessToken
$refreshToken = $loginResponse.refreshToken

# Test 2: Verify session in Redis
Write-Host "`n=== Test 2: Verify Session in Redis ===" -ForegroundColor Cyan
$tokenParts = $accessToken.Split('.')
$payload = $tokenParts[1]
# Decode JWT payload (Base64Url)
$payloadBytes = [Convert]::FromBase64String($payload + "==")
$payloadJson = [System.Text.Encoding]::UTF8.GetString($payloadBytes)
$payloadData = $payloadJson | ConvertFrom-Json
$sessionId = $payloadData.sessionId

Write-Host "Session ID: $sessionId" -ForegroundColor Yellow
docker exec -it atlas-redis redis-cli -a "atlas_redis_2024" HGETALL "session:$sessionId"

# Test 3: Test authenticated request
Write-Host "`n=== Test 3: Authenticated Request ===" -ForegroundColor Cyan
$sessionResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/session" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $accessToken" }

Write-Host "✅ Session endpoint works!" -ForegroundColor Green
Write-Host "User: $($sessionResponse.user.username) ($($sessionResponse.user.role))" -ForegroundColor Yellow

# Test 4: List sessions
Write-Host "`n=== Test 4: List Sessions ===" -ForegroundColor Cyan
$sessionsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/sessions" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $accessToken" }

Write-Host "✅ Sessions listed!" -ForegroundColor Green
Write-Host "Total sessions: $($sessionsResponse.sessions.Count)" -ForegroundColor Yellow
foreach ($session in $sessionsResponse.sessions) {
    $currentMark = if ($session.isCurrent) { " (CURRENT)" } else { "" }
    Write-Host "  - $($session.deviceName) from $($session.ip) $currentMark" -ForegroundColor Yellow
    Write-Host "    Created: $($session.createdAt)" -ForegroundColor DarkGray
    Write-Host "    Last Activity: $($session.lastActivity)" -ForegroundColor DarkGray
}

# Test 5: Login from another "device"
Write-Host "`n=== Test 5: Login from Another Device ===" -ForegroundColor Cyan
$device2Response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ "User-Agent" = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile" } `
    -Body '{"username":"admin","password":"admin123"}'

Write-Host "✅ Second device login successful!" -ForegroundColor Green
$accessToken2 = $device2Response.accessToken

# List sessions again
$sessionsResponse2 = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/sessions" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $accessToken" }

Write-Host "Total sessions now: $($sessionsResponse2.sessions.Count)" -ForegroundColor Yellow

# Test 6: Token refresh
Write-Host "`n=== Test 6: Token Refresh ===" -ForegroundColor Cyan
$refreshResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/refresh" `
    -Method POST `
    -ContentType "application/json" `
    -Body "{`"refreshToken`":`"$refreshToken`"}"

Write-Host "✅ Token refreshed!" -ForegroundColor Green
Write-Host "New Access Token: $($refreshResponse.accessToken.Substring(0, 50))..." -ForegroundColor Yellow
Write-Host "New Refresh Token: $($refreshResponse.refreshToken.Substring(0, 32))..." -ForegroundColor Yellow

# Update tokens
$accessToken = $refreshResponse.accessToken
$refreshToken = $refreshResponse.refreshToken

# Test 7: Logout from second device
Write-Host "`n=== Test 7: Logout from Second Device ===" -ForegroundColor Cyan
$tokenParts2 = $accessToken2.Split('.')
$payload2 = $tokenParts2[1]
$payloadBytes2 = [Convert]::FromBase64String($payload2 + "==")
$payloadJson2 = [System.Text.Encoding]::UTF8.GetString($payloadBytes2)
$payloadData2 = $payloadJson2 | ConvertFrom-Json
$sessionId2 = $payloadData2.sessionId

$deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/sessions/$sessionId2" `
    -Method DELETE `
    -Headers @{ "Authorization" = "Bearer $accessToken" }

Write-Host "✅ Session deleted!" -ForegroundColor Green

# Test 8: Verify second device token no longer works
Write-Host "`n=== Test 8: Verify Second Device Token Expired ===" -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/auth/session" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $accessToken2" }
    Write-Host "❌ Second device token still works (should be expired)" -ForegroundColor Red
} catch {
    Write-Host "✅ Second device token expired as expected!" -ForegroundColor Green
}

# Test 9: Logout
Write-Host "`n=== Test 9: Logout ===" -ForegroundColor Cyan
$logoutResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/logout" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $accessToken" }

Write-Host "✅ Logout successful!" -ForegroundColor Green

# Test 10: Verify session deleted in Redis
Write-Host "`n=== Test 10: Verify Session Deleted in Redis ===" -ForegroundColor Cyan
$existsResult = docker exec -it atlas-redis redis-cli -a "atlas_redis_2024" EXISTS "session:$sessionId"
if ($existsResult -match "0") {
    Write-Host "✅ Session deleted from Redis!" -ForegroundColor Green
} else {
    Write-Host "❌ Session still exists in Redis" -ForegroundColor Red
}

Write-Host "`n=== All Tests Complete! ===" -ForegroundColor Cyan
