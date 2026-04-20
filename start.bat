@echo off
echo ==========================================
echo     NutriMate - Starting Both Servers
echo ==========================================
echo.
echo Starting Backend on http://localhost:5000
echo Starting Frontend on http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

start "Backend Server" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 >nul
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
