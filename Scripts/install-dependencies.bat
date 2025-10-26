@echo off
echo Installing Python dependencies...
pip install -r requirements.txt

if %ERRORLEVEL% EQU 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
)

