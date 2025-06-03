@echo off
REM Simple Git Auto-Push Script

REM Get commit message or use default
if "%~1"=="" (
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
    set COMMIT_MSG=Auto-commit: !mydate! !mytime!
) else (
    set COMMIT_MSG=%~1
)

REM Stage all changes
git add .

REM Commit changes
git commit -m "%COMMIT_MSG%"

REM Push to current branch
for /f %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
git push origin !CURRENT_BRANCH!

REM Done 