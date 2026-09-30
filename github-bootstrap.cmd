@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0"
title PipeMark Studio - GitHub Publish

echo ==============================================================
echo PipeMark Studio - GitHub Pages Publisher
echo ==============================================================
echo.
echo This window will stay open even if publishing fails.
echo Log file: "%~dp0github-bootstrap.log"
echo.

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Windows PowerShell was not found.
  echo [INFO] Please open github-publish.ps1 manually with PowerShell.
  echo.
  pause
  exit /b 9009
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0github-publish.ps1"
set "CODE=%ERRORLEVEL%"

echo.
echo ==============================================================
if "%CODE%"=="0" (
  echo [OK] Publish script finished successfully.
) else (
  echo [ERROR] Publish script stopped with exit code %CODE%.
  echo [INFO] Check github-bootstrap.log in this folder.
)
echo ==============================================================
echo.
echo Press any key to close this window.
pause >nul
exit /b %CODE%
