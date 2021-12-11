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
mkdir ".\\back\\dist"
mkdir ".\\back\\lib\\data"
mkdir ".\\back\\lib\\utils"
xcopy ".\\front\\server" ".\\back\\dist" /E /Y
xcopy ".\\front\\src\\data" ".\\back\\lib\\data" /E /Y
xcopy ".\\front\\src\\utils" ".\\back\\lib\\utils" /E /Y
echo .
echo .
echo ================
cd back
node index.js