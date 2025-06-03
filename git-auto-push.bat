@echo off
REM Simple Git Auto-Push Script (reliable branch detection)

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

REM Get current branch name reliably
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%b

REM Push to current branch
git push origin %CURRENT_BRANCH%

REM Done 