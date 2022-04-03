#!/bin/bash

set -e

npm run build:api

cp api/Dockerfile api/dist/
cp api/package.json api/dist/

docker build -t rod-test api/dist/.
docker tag rod-test:latest 663242346353.dkr.ecr.ap-southeast-1.amazonaws.com/rod-test:"$VERSION"
docker push 663242346353.dkr.ecr.ap-southeast-1.amazonaws.com/rod-test:"$VERSION"

docker image rm rod-test:latest
docker image rm 663242346353.dkr.ecr.ap-southeast-1.amazonaws.com/rod-test:"$VERSION"

regex="$(echo rod-test | grep -oE "^([^:]+)"):[0-9]+"
(grep -Erl $regex /$(pwd)/api/serverless.yml || true) | xargs -r sed -i -r "s/$regex/rod-test:$VERSION/g"

npm run deploy:api

rm -rf api/dist/
rm -rf api/.serverless
