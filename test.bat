@echo off
cd front
if "%1"=="-n" (
  echo Tip: Skip Build
) else (
  call npm run-script build
)
echo ================
cd ..
xcopy ".\\front\\dist" ".\\back\\dist" /E /Y
echo .
echo .
echo ================
cd back
node index.js