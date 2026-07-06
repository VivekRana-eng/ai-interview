@echo off
echo ===================================================
echo Starting SelectAI Backend on http://localhost:5000
echo ===================================================
start "SelectAI Backend" cmd /c "cd /d %~dp0backend && npm run dev"

echo ===================================================
echo Starting SelectAI Frontend on http://localhost:3000
echo ===================================================
cd /d "%~dp0frontend"
npm run dev -- -p 3000
