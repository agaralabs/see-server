#!/bin/bash
npm install
./node_modules/.bin/pbjs types.proto -t commonjs > types.js
