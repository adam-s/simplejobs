#!/bin/bash

# Move config files outside the scope of git which doesn't track them
cp -rf server/config/environment ~/WebstormProjects/config

# Make sure we are working with the master branch
git checkout master

# Push latest commit to GitHub
# git add .
# printf "Commit message: "
# read -r message
# git commit -m "$message"
# git push origin master

# Move to staging local
git checkout staging

# Merge staging with master
git merge master -m "Preparing to build"

# Build the production files
grunt build
git add .
git commit -m "built"

# Push to remote staging
git push staging staging:master

# Return to the master branch
git checkout master