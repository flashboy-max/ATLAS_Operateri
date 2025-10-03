# Restore script
$original = Get-Content 'C:\Users\ROG_LAP\Desktop\Projekat\ATLAS html\backup\2025-09-09_14-39-00_pre_modularization\app.js' -Raw -ErrorAction SilentlyContinue
if ($null -eq $original) {
    Write-Host 'Backup not found. Creating new clean file...'
}
