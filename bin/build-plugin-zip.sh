#!/usr/bin/env bash
#
# Builds newsly.zip for submission to the WordPress.org plugin directory
# (or any manual install). Assembles a clean copy of the plugin honouring
# .distignore, with build/ and vendor/ included since both are required at
# runtime and neither is tracked in git. The zip's top-level folder is
# "newsly" so it installs correctly via Plugins -> Upload.
#
# Composer is reinstalled with dev dependencies afterwards, so this leaves
# the local vendor/ exactly as it was before running.

set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist-archive newsly.zip

npm run build

composer install --no-dev --optimize-autoloader --no-interaction --no-progress

mkdir -p dist-archive/newsly
rsync -a --exclude-from=.distignore --exclude=dist-archive ./ dist-archive/newsly/
(cd dist-archive && zip -rq ../newsly.zip newsly)
rm -rf dist-archive

composer install --no-interaction --no-progress

echo "Built newsly.zip"
