#!/bin/bash -eu

mnt_dir='/workspace'

docker run \
  -v `pwd`:$mnt_dir -w $mnt_dir \
  -e pactBrokerAccount=$pactBrokerAccount \
  -e pactBrokerUsername=$pactBrokerUsername \
  -e pactBrokerPassword=$pactBrokerPassword \
  node:6 \
  bash -c "npm install && npm test -- --coverage && npm run-script pactPublish"
