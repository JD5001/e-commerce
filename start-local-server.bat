@echo off
REM This batch file starts a simple HTTP server using Python for the current directory

REM Check if python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH. Please install Python to use this server.
    pause
    exit /b 1
)

REM Start the server on port 8000
echo Starting local server at http://localhost:8000
python -m http.server 8000
