#!/bin/bash
set -e
# docker login
docker login -u Carrot -p Passw0rd 192.168.1.52
# build base image
base_image="192.168.1.52/base_image/node:msa-base-10-alpine"
docker build -t ${base_image} -f Dockerfile.base .
# push base image
docker push ${base_image}
