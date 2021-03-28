#!/bin/bash

set -e

mkdir -p dist
mkdir -p docs/assets/js
mkdir -p docs/_includes
mkdir -p docs/_data
bookmarklet src/index.js dist/bookmarklet.js
sed -e 's#__site__url__#{{ site.url }}/departmento#' < dist/bookmarklet.js > docs/_includes/bookmarklet.js
cp src/*.mjs docs/assets/js/
node src/imperial_timestamp.js > docs/_data/build.yml
cat src/data.yml docs/_data/build.yml > docs/assets/js/data.yml