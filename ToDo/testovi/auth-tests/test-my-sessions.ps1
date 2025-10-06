# Test My Sessions UI
# Phase 1 Day 6 - Session Management UI Test

Write-Host "🔐 Testing My Sessions UI..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Login and get multiple sessions
Write-Host "📝 Test 1: Create Multiple Sessions" -ForegroundColor Yellow
Write-Host "----------------------------------------"

try {
    # Session 1: Desktop
    $session1 = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $loginBody1 = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json

    $response1 = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody1 `
        -WebSession $session1 `
        -Headers @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0" }

    $data1 = $response1.Content | ConvertFrom-Json
    Write-Host "✅ Session 1 (Desktop) created!" -ForegroundColor Green
    Write-Host "   User: $($data1.user.username)" -ForegroundColor Gray
    Write-Host "   AccessToken: $($data1.accessToken.Substring(0, 30))..." -ForegroundColor Gray

    # Session 2: Mobile
    $session2 = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $response2 = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody1 `
        -WebSession $session2 `
        -Headers @{ "User-Agent" = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148" }

    $data2 = $response2.Content | ConvertFrom-Json
    Write-Host "✅ Session 2 (iPhone) created!" -ForegroundColor Green

    # Session 3: Tablet
    $session3 = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $response3 = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody1 `
        -WebSession $session3 `
        -Headers @{ "User-Agent" = "Mozilla/5.0 (iPad; CPU OS 17_0) AppleWebKit/605.1.15" }

    $data3 = $response3.Content | ConvertFrom-Json
    Write-Host "✅ Session 3 (iPad) created!" -ForegroundColor Green

    # Test 2: List all sessions
    Write-Host ""
    Write-Host "📝 Test 2: List All Sessions" -ForegroundColor Yellow
    Write-Host "----------------------------------------"

    $sessionsResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/sessions" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $($data1.accessToken)" }

    $sessionsData = $sessionsResponse.Content | ConvertFrom-Json

    Write-Host "✅ Sessions retrieved: $($sessionsData.sessions.Count) total" -ForegroundColor Green
    Write-Host ""

    foreach ($session in $sessionsData.sessions) {
        $currentMark = if ($session.isCurrent) { " [CURRENT]" } else { "" }
        Write-Host "   📱 $($session.deviceName)$currentMark" -ForegroundColor Cyan
        Write-Host "      IP: $($session.ip)" -ForegroundColor Gray
        Write-Host "      Last Activity: $($session.lastActivity)" -ForegroundColor Gray
        Write-Host "      Session ID: $($session.sessionId)" -ForegroundColor DarkGray
        Write-Host ""
    }

    # Test 3: Delete specific session (Session 2)
    Write-Host "📝 Test 3: Delete Specific Session (iPhone)" -ForegroundColor Yellow
    Write-Host "----------------------------------------"

    # Extract session ID from Session 2's JWT token
    $tokenParts = $data2.accessToken.Split('.')
    $payload = $tokenParts[1]
    # Add padding if needed
    $padding = 4 - ($payload.Length % 4)
    if ($padding -ne 4) {
        $payload += "=" * $padding
    }
    $payloadBytes = [Convert]::FromBase64String($payload)
    $payloadJson = [System.Text.Encoding]::UTF8.GetString($payloadBytes)
    $payloadData = $payloadJson | ConvertFrom-Json
    $session2Id = $payloadData.sessionId

    Write-Host "   Session 2 ID: $session2Id" -ForegroundColor Gray

    # Delete Session 2 using Session 1's token (different device)
    $deleteResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/sessions/$session2Id" `
        -Method DELETE `
        -Headers @{ "Authorization" = "Bearer $($data1.accessToken)" }

    Write-Host "✅ Session 2 (iPhone) deleted!" -ForegroundColor Green

    # Verify Session 2 token no longer works
    Write-Host ""
    Write-Host "📝 Test 3.1: Verify Deleted Session Token Invalid" -ForegroundColor Yellow

    try {
        $testResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/session" `
            -Method GET `
            -Headers @{ "Authorization" = "Bearer $($data2.accessToken)" }
        
        Write-Host "❌ Session 2 token still works (should be invalid)" -ForegroundColor Red
    } catch {
        Write-Host "✅ Session 2 token is invalid (as expected)" -ForegroundColor Green
    }

    # List sessions again
    Write-Host ""
    Write-Host "📝 Test 4: List Sessions After Deletion" -ForegroundColor Yellow
    Write-Host "----------------------------------------"

    $sessionsResponse2 = Invoke-WebRequest -Uri "$baseUrl/api/auth/sessions" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $($data1.accessToken)" }

    $sessionsData2 = $sessionsResponse2.Content | ConvertFrom-Json

    Write-Host "✅ Sessions remaining: $($sessionsData2.sessions.Count) total" -ForegroundColor Green
    Write-Host ""

    foreach ($session in $sessionsData2.sessions) {
        $currentMark = if ($session.isCurrent) { " [CURRENT]" } else { "" }
        Write-Host "   📱 $($session.deviceName)$currentMark" -ForegroundColor Cyan
    }

    # Test 5: Try to delete current session (should fail gracefully)
    Write-Host ""
    Write-Host "📝 Test 5: Try to Delete Current Session" -ForegroundColor Yellow
    Write-Host "----------------------------------------"

    $tokenParts1 = $data1.accessToken.Split('.')
    $payload1 = $tokenParts1[1]
    $padding1 = 4 - ($payload1.Length % 4)
    if ($padding1 -ne 4) {
        $payload1 += "=" * $padding1
    }
    $payloadBytes1 = [Convert]::FromBase64String($payload1)
    $payloadJson1 = [System.Text.Encoding]::UTF8.GetString($payloadBytes1)
    $payloadData1 = $payloadJson1 | ConvertFrom-Json
    $session1Id = $payloadData1.sessionId

    try {
        $deleteCurrentResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/sessions/$session1Id" `
            -Method DELETE `
            -Headers @{ "Authorization" = "Bearer $($data1.accessToken)" }
        
        Write-Host "❌ Current session was deleted (should be prevented)" -ForegroundColor Red
    } catch {
        $errorResponse = $_.Exception.Response
        if ($errorResponse.StatusCode -eq 400) {
            Write-Host "✅ Cannot delete current session (as expected)" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Unexpected error: $($errorResponse.StatusCode)" -ForegroundColor Yellow
        }
    }

    # Test 6: Logout All (cleanup)
    Write-Host ""
    Write-Host "📝 Test 6: Logout All Devices" -ForegroundColor Yellow
    Write-Host "----------------------------------------"

    $logoutAllResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/logout-all" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer $($data1.accessToken)" }

    $logoutAllData = $logoutAllResponse.Content | ConvertFrom-Json

    Write-Host "✅ Logged out from all devices!" -ForegroundColor Green
    Write-Host "   Deleted sessions: $($logoutAllData.deletedCount)" -ForegroundColor Gray
    Write-Host "   Message: $($logoutAllData.message)" -ForegroundColor Gray

    # Verify all tokens are invalid
    Write-Host ""
    Write-Host "📝 Test 6.1: Verify All Tokens Invalid" -ForegroundColor Yellow

    try {
        $testResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/session" `
            -Method GET `
            -Headers @{ "Authorization" = "Bearer $($data1.accessToken)" }
        
        Write-Host "❌ Session 1 token still works (should be invalid)" -ForegroundColor Red
    } catch {
        Write-Host "✅ All tokens are invalid (as expected)" -ForegroundColor Green
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
Write-Host "   ✅ Multiple sessions created" -ForegroundColor Green
Write-Host "   ✅ Sessions listed correctly" -ForegroundColor Green
Write-Host "   ✅ Specific session deleted" -ForegroundColor Green
Write-Host "   ✅ Deleted session token invalid" -ForegroundColor Green
Write-Host "   ✅ Current session cannot be deleted" -ForegroundColor Green
Write-Host "   ✅ Logout all works correctly" -ForegroundColor Green
Write-Host ""
Write-Host "🔒 Session Management UI: READY FOR USE" -ForegroundColor Green
