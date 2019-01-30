#!/bin/bash

npm test && npm run lint --fix && docker build -t web-disseminator .
