@echo off
cd front
if "$1"=="-n" 
then
  echo Tip: Skip Build
else
  rm -rf server
  mkdir server
  npm run-script buildTest
fi
echo ================
cd ..
mkdir ./back/lib
mkdir ./back/lib/data
mkdir ./back/lib/utils
cp -rf "./front/server/" "./back/dist/"
cp -rf "./front/src/data/" "./back/lib/data/"
cp -rf "./front/src/utils/" "./back/lib/utils/"
echo .
echo .
echo ================
cd back
node index.js
