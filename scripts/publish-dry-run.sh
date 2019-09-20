#!/usr/bin/env bash

set -e

echo "Run a publish in dry run mode..."

source ./.env

# Allows to login to NPM using environment variables.
./node_modules/.bin/npm-cli-login
# Release a new version and publish to NPM.
yarn release-it:debug
