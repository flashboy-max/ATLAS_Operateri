@echo off
title ATLAS HTML v2.2 - Smart Launcher
color 0A

echo.
echo ======================================================
echo     ATLAS HTML v2.2 - Pametni Pokretac
echo ======================================================
echo.
echo Pokretanje aplikacije...

:: --- FAZA 1: PROVERA SERVERA I PORTA ---
SETLOCAL ENABLEDELAYEDEXPANSION
SET PORT=8000
:find_port
echo Proveravam port %PORT%...
netstat -an | find ":%PORT%" > nul
if %errorlevel% == 0 (
    SET /A PORT+=1
    if !PORT! GTR 8010 (
    echo [UPOZORENJE] Nije pronadjen slobodan port. Pokusavam sa otvaranjem direktno.
        goto:direct_open
    )
    goto find_port
)
echo [OK] Slobodan port pronadjen: %PORT%
echo.

:: --- PROVERA PYTHONA ---
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [UPOZORENJE] Python nije instaliran ili nije dostupan u PATH-u.
    echo Pokusavam alternativno pokretanje...
    goto:check_node
)

:: --- FAZA 2: POKRETANJE SERVERA ---
echo Pokretanje Python HTTP servera na portu %PORT%...
start /b python -m http.server %PORT% > nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Lokalni server pokrenut na http://localhost:%PORT%
) else (
    echo [UPOZORENJE] Greska pri pokretanju Python servera. Pokusavam alternativu.
    goto:check_node
)

:: Dajemo serveru trenutak da se pokrene
timeout /t 2 /nobreak > nul

:: --- FAZA 3: DETEKCIJA I POKRETANJE PRETRAZIVACA ---
SET BROWSER_CMD=
echo.
echo Trazim instalirane pretraživace...

:: Provera za Chrome
for /f "tokens=2*" %%a in ('reg query "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" /ve 2^>nul') do (
    SET CHROME_PATH=%%b
)
if defined CHROME_PATH (
    SET BROWSER_CMD="%CHROME_PATH%" --app=http://localhost:%PORT%
    echo   -> [OK] Pronadjen Google Chrome. Pokrecem u app modu...
    goto:launch
)

:: Provera za Edge
for /f "tokens=2*" %%a in ('reg query "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe" /ve 2^>nul') do (
    SET EDGE_PATH=%%b
)
if defined EDGE_PATH (
    SET BROWSER_CMD="%EDGE_PATH%" --app=http://localhost:%PORT%
    echo   -> [OK] Pronadjen Microsoft Edge. Pokrecem u app modu...
    goto:launch
)

:: Provera za Firefox
for /f "tokens=2*" %%a in ('reg query "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\App Paths\firefox.exe" /ve 2^>nul') do (
    SET FIREFOX_PATH=%%b
)
if defined FIREFOX_PATH (
    SET BROWSER_CMD="%FIREFOX_PATH%" -url http://localhost:%PORT%
    echo   -> [OK] Pronadjen Mozilla Firefox. Pokrecem...
    goto:launch
)

:: Fallback na podrazumevani pretrazivac
echo   -> [UPOZORENJE] Nijedan preferirani pretrazivac nije pronadjen. Koristim podrazumevani.
SET BROWSER_CMD=http://localhost:%PORT%
goto:launch

:check_node
echo.
echo Proveravam Node.js za alternativno pokretanje...
npx --version > nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Node.js pronadjen. Pokretam HTTP server...
    start /b npx http-server -p %PORT% -o > nul 2>&1
    timeout /t 3 /nobreak > nul
    echo [OK] Node.js server pokrenut na http://localhost:%PORT%
    goto:find_browser_node
) else (
    echo [UPOZORENJE] Ni Python ni Node.js nisu dostupni.
    goto:direct_open
)

:find_browser_node
echo.
echo Trazim pretraživace za Node.js server...
:: Ista logika kao gore, samo sa Node.js serverom
for /f "tokens=2*" %%a in ('reg query "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" /ve 2^>nul') do (
    SET CHROME_PATH=%%b
)
if defined CHROME_PATH (
    start "" "%CHROME_PATH%" --app=http://localhost:%PORT%
    goto:success_node
)

for /f "tokens=2*" %%a in ('reg query "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe" /ve 2^>nul') do (
    SET EDGE_PATH=%%b
)
if defined EDGE_PATH (
    start "" "%EDGE_PATH%" --app=http://localhost:%PORT%
    goto:success_node
)

start http://localhost:%PORT%
goto:success_node

:direct_open
echo.
echo ======================================================
echo   Direktno otvaranje datoteke (offline mode)
echo ======================================================
echo.
echo [UPOZORENJE] Server nije dostupan. Otvaram aplikaciju direktno.
echo.
echo NAPOMENA: Neke funkcionalnosti možda neće raditi
echo u offline modu. Za najbolje iskustvo instalirajte:
echo   - Python 3.x (preporučeno)
echo   - Node.js (alternativa)
echo.

:: Traži pretraživače za direktno otvaranje
for /f "tokens=2*" %%a in ('reg query "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" /ve 2^>nul') do (
    start "" "%%b" "%~dp0index.html"
    goto:end_direct
)

for /f "tokens=2*" %%a in ('reg query "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe" /ve 2^>nul') do (
    start "" "%%b" "%~dp0index.html"
    goto:end_direct
)

start index.html
goto:end_direct

:launch
start "" %BROWSER_CMD%
echo.
echo [OK] Aplikacija je uspesno pokrenuta u pretrazivaco!
echo.
echo ======================================================
echo   ATLAS HTML v2.2 - Uspešno pokrenuto
echo ======================================================
echo.
echo [WEB] URL: http://localhost:%PORT%
echo [SRV] Server: Python HTTP Server  
echo [NET] Port: %PORT%
echo.
echo [!] INSTRUKCIJE:
echo   - Aplikacija radi u pozadini
echo   - Za zatvaranje pritisnite Ctrl+C u ovom prozoru
echo   - Ili zatvorite browser i ovaj prozor
echo.
echo [!] VAZNO: Ne zatvarajte ovaj prozor dok koristite aplikaciju!
echo.
goto:wait_for_exit

:success_node
echo.
echo [OK] Aplikacija je uspesno pokrenuta sa Node.js serverom!
echo.
echo ======================================================
echo   ATLAS HTML v2.2 - Uspešno pokrenuto
echo ======================================================
echo.
echo [WEB] URL: http://localhost:%PORT%
echo [SRV] Server: Node.js HTTP Server
echo [NET] Port: %PORT%
echo.
goto:wait_for_exit

:end_direct
echo.
echo [OK] Aplikacija je otvorena u pretrazivaco (offline mode)
echo.
echo Za bolje performanse instalirajte Python ili Node.js
echo.
echo Pritisnite bilo koji taster za zatvaranje...
pause >nul
goto:cleanup

:wait_for_exit
echo Pritisnite bilo koji taster za zatvaranje servera i aplikacije...
pause >nul

:cleanup
echo.
echo Zatvaranje servera...
taskkill /f /im python.exe /fi "WINDOWTITLE eq %~n0" > nul 2>&1
taskkill /f /im node.exe /fi "WINDOWTITLE eq %~n0" > nul 2>&1
echo [OK] Server zaustavljen.
echo.
echo Hvala što koristite ATLAS HTML v2.2!
timeout /t 2 > nul