#!/usr/bin/env bash

set -e

if [[ "$TRAVIS_EVENT_TYPE" == "cron" ]] || [[ $TRAVIS_BRANCH != "master" ]]
    then
        echo "This script only works for MASTER and for non-CRON tasks..."
        exit 0
fi

# Makes sure Travis CI is able to push to github.
git remote set-url origin https://tafax:$GITHUB_TOKEN@github.com/tafax/layerr.git
git checkout master
git pull --tags origin master

# Allows to login to NPM using environment variables.
./node_modules/.bin/npm-cli-login
# Release a new version and publish to NPM.
yarn release-it
