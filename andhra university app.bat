@echo off
title Andhra University Portal
echo.
echo  =============================================
echo   Andhra University Portal - Starting...
echo  =============================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
