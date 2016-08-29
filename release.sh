#!/bin/bash

echo Making sure files use correct line endings

dos2unix *.js

echo Publish via npm

echo "What type of release is this?"

select MODE in "Pre-release" "Stable"; do
  break
done

if [[ ! $MODE ]]; then
	echo "Incorrect release type"
	exit 1
fi

if [ "$MODE" = "Pre-release" ]; then
	npm publish --tag=pre
elif [ "$MODE" = "Stable" ]; then
	npm publish
fi