#!/bin/bash

echo Making sure files use correct line endings

dos2unix *.js

echo Installing locally

npm install -g