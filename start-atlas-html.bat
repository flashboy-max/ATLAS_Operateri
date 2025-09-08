@echo off
title ATLAS HTML - Telekom Operateri BiH
color 0A

echo.
echo ======================================================
echo        ATLAS HTML - Telekom Operateri BiH
echo ======================================================
echo.
echo Pokretanje aplikacije...
echo.

REM Check if Python is available for local server
python -c "import http.server" 2>nul
if %errorlevel% == 0 (
    echo Python dostupan - pokretanje lokalnog servera...
    echo.
    echo Server će biti dostupan na: http://localhost:8000
    echo.
    echo Za zatvaranje aplikacije pritisnite Ctrl+C
    echo.
    
    REM Start browser first
    timeout /t 2 /nobreak >nul
    start http://localhost:8000/index.html
    
    REM Then start Python server
    python -m http.server 8000
) else (
    echo Python nije dostupan - otvaranje direktno u browseru...
    echo.
    echo Aplikacija se otvara direktno iz datoteka...
    echo.
    
    REM Open directly in default browser
    start index.html
    
    echo.
    echo Aplikacija je pokrenuta!
    echo.
    echo Za najbolje iskustvo preporučujemo korišćenje:
    echo - Google Chrome
    echo - Mozilla Firefox
    echo - Microsoft Edge
    echo.
    echo Pritisnite bilo koji taster za zatvaranje...
    pause >nul
)