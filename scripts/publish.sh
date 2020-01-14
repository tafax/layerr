#!/usr/bin/env bash

set -e

if [[ "$TRAVIS_EVENT_TYPE" == "cron" ]] || [[ $TRAVIS_BRANCH != "master" ]]
    then
        echo "This script only works for MASTER and for non-CRON tasks..."
        exit 0
fi

# Makes sure Travis CI is able to push to github.
git checkout master
git pull --tags origin master

# Compile the project.
yarn compile

# Release a new version and publish to NPM.
yarn semantic-release
