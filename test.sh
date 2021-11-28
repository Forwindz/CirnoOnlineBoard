@echo off
cd front
if "$1"=="-n" 
then
  echo Tip: Skip Build
else
  rm -rf web
  mkdir web
  npm run-script build
fi
echo ================
cd ..
cp -avx "./front/dist" "./back/dist"
echo .
echo .
echo ================
cd back
node index.js