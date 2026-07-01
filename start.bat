@echo off
title IARA - Fisheries Information System
echo ============================================================
echo   IARA - Fisheries Information System (school project)
echo ============================================================
echo.

cd /d "%~dp0"

REM --- Find Python (try 'python', then the 'py' launcher) ---
set "PY=python"
where python >nul 2>nul || set "PY=py"
where %PY% >nul 2>nul
if errorlevel 1 (
  echo [!] Python was not found on this computer.
  echo     Download it from https://www.python.org/downloads/
  echo     During setup, check the box "Add Python to PATH".
  echo.
  echo     Or just open web\index.html directly in your browser.
  echo.
  pause
  exit /b
)

echo [1/2] Installing Flask (only needed the first time)...
%PY% -m pip install -r requirements.txt

echo.
echo [2/2] Starting the server...
echo Open http://localhost:5000 in your browser.
echo (press Ctrl+C to stop)
echo.
%PY% app.py
pause
