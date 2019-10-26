#!/bin/bash
cd /home/ubuntu/server
yarn install
nohup node index.js &
cd ../app
yarn install
yarn start
