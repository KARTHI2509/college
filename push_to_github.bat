@echo off
echo ==============================================
echo PUSHING COLLEGE WEBSITE TO GITHUB
echo ==============================================
cd /d "%~dp0"

:: 1. Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    pause
    exit /b
)

:: 2. Check if .git exists, if not initialize
if not exist .git (
    echo Initializing local Git repository...
    git init
)

:: 3. Configure Remote URL
echo Setting remote origin to https://github.com/KARTHI2509/college.git ...
git remote remove origin >nul 2>nul
git remote add origin https://github.com/KARTHI2509/college.git

:: 4. Add all files
echo Adding files to git stage...
git add -A

:: 5. Commit changes
echo Committing changes...
git commit -m "Replace repository with premium responsive college website"

:: 6. Push to Main Branch (Forces replacement)
echo Pushing changes to GitHub main branch (forcing overwrite)...
git branch -M main
git push -u origin main --force

echo ==============================================
echo PROCESS COMPLETED!
echo Please check your repository online.
echo ==============================================
pause
