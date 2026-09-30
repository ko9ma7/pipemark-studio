@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0"
title PipeMark Studio - Local Server

echo PipeMark Studio local server
echo.

where py.exe >nul 2>nul
if not errorlevel 1 (
  start "" "http://localhost:8765/"
  py.exe -3 -m http.server 8765
  goto :end
)

where python.exe >nul 2>nul
if not errorlevel 1 (
  start "" "http://localhost:8765/"
  python.exe -m http.server 8765
  goto :end
)

echo [ERROR] Python 3 was not found.
echo [INFO] You can still open index.html directly in a browser.

:end
echo.
echo Press any key to close this window.
pause >nul
