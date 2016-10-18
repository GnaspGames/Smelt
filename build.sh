#!/bin/bash

echo Making sure files use correct line endings

find . -type f -name "*.js" -exec dos2unix {} \;

echo Installing locally

npm install -g