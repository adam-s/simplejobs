#!/bin/bash

git checkout build
grunt build
git add .
git commit -m "build"
git push heroku build:master
git checkout master