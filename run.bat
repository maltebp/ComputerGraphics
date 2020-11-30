


@echo off

set typescript="C:\Users\s185139\.IntelliJIdea2019.2\config\node\node-v10.16.0-win-x64\tsc"

:: Delete out folder
echo Cleaning targer folder...
rd /s /q out
rmdir /s /q out
mkdir out

:: Copying HTML and javascript
echo Copying HTML, JavaScript and resources
xcopy /E /S /q website out\

:: Building typescript
echo Building TypeScript
cd website &^
%typescript% & cd .. & echo Done!