@echo off
cd front
if "%1"=="-n" (
  echo Tip: Skip Build
) else (
  rd /S /Q server
  mkdir server
  call npm run-script buildTest
)
echo ================
cd ..
xcopy ".\\front\\server" ".\\back\\dist" /E /Y
echo .
echo .
echo ================
cd back
node index.js