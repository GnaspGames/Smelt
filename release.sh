#!/bin/bash

echo Making sure files use correct line endings

dos2unix *.js

echo Pushing to Github

git push origin master:master

echo Publish via npm

npm publish