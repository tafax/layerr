#!/usr/bin/env bash

set -e

echo "Run a publish in dry run mode..."

source ./.env

# Release a new version and publish to NPM.
yarn semantic-release --debug
