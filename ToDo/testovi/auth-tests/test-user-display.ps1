# Test User Display Fix
Write-Host "🔧 Testing User Display Fix" -ForegroundColor Cyan

try {
    # Test backend response
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"username":"admin","password":"admin123"}' `
        -UseBasicParsing

    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "`n✅ Backend response:" -ForegroundColor Green
    Write-Host "   User.full_name: '$($data.user.full_name)'" -ForegroundColor Gray
    Write-Host "   User.username: '$($data.user.username)'" -ForegroundColor Gray
    Write-Host "   User.email: '$($data.user.email)'" -ForegroundColor Gray
    
    # Test if user fields exist
    if ($data.user.full_name) {
        Write-Host "   ✅ full_name field exists: '$($data.user.full_name)'" -ForegroundColor Green
        
        # Parse name like frontend will do
        $nameParts = $data.user.full_name.Trim().Split(' ')
        if ($nameParts.Length -ge 2) {
            $ime = $nameParts[0]
            $prezime = $nameParts[1..($nameParts.Length-1)] -join ' '
            Write-Host "   🔧 Parsed - ime: '$ime', prezime: '$prezime'" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️ full_name field missing" -ForegroundColor Yellow
    }
    
    if ($data.user.ime -and $data.user.prezime) {
        Write-Host "   ✅ ime/prezime fields exist: '$($data.user.ime) $($data.user.prezime)'" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ ime/prezime fields missing - will be parsed from full_name" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Test failed: $_" -ForegroundColor Red
}

Write-Host "`n🎯 Expected Result:" -ForegroundColor Cyan
Write-Host "   Frontend should show 'Aleksandar Jovičić' instead of 'undefined undefined'" -ForegroundColor White