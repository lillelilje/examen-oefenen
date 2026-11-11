#!/usr/bin/env bash
# The design system lives here once. Each app keeps its own styles.css so the
# folder still works on its own (KNM is deployed from its own repo), so copy
# the sources in instead of linking across folders.
set -euo pipefail
cd "$(dirname "$0")/.."
header='/* Generated from shared/: edit the css in shared/ and run shared/build.sh */\n'
jsheader='/* Generated from shared/ai.js: edit it there and run shared/build.sh */\n'
{ printf "$header"; cat shared/site.css; } > knm/styles.css
{ printf "$header"; cat shared/site.css shared/schrijven.css; } > schrijven/styles.css
{ printf "$header"; cat shared/site.css shared/lezen.css; } > lezen/styles.css
for app in knm schrijven lezen; do
  { printf "$jsheader"; cat shared/ai.js; } > "$app/ai.js"
done
echo "wrote knm/styles.css, schrijven/styles.css, lezen/styles.css and the three ai.js copies"
