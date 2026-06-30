@echo off
echo ===================================================
echo Starting SelectAI Frontend on http://localhost:3000
echo ===================================================
cd /d "%~dp0frontend"
npm run dev -- -p 3000
pause
