@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Install Node.js 22.13 or newer first. & pause & exit /b 1)
node -e "require.resolve('@ffmpeg-installer/ffmpeg');require.resolve('@ffprobe-installer/ffprobe');require.resolve('vite')" >nul 2>nul
if errorlevel 1 call npm install
if errorlevel 1 (echo Dependency installation failed. & pause & exit /b 1)
call npm run build
if errorlevel 1 (echo Build failed. & pause & exit /b 1)
echo Opening Lantern in your browser...
start "" http://localhost:4173
node server/index.js
pause
