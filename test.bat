@echo off
cd front
if "%1"=="-n" (
  echo Tip: Skip Build
) else (
  rd /S /Q web
  mkdir web
  call npm run-script build
)
echo ================
cd ..
xcopy ".\\front\\web" ".\\back\\dist" /E /Y
echo .
echo .
echo ================
cd back
node index.js