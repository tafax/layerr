#!/usr/bin/env bash

set -e

echo "Run a publish in dry run mode..."

# Allows to login to NPM using environment variables.
./node_modules/.bin/npm-cli-login
# Release a new version and publish to NPM.
./node_modules/.bin/release-it --non-interactive --verbose --dry-run
