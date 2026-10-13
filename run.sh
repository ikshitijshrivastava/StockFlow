#!/bin/sh
# Usage: sh tests/run.sh      (run from the folder that contains index.html)
set -e
python3 - <<'PY'
import re
s=open('index.html',encoding='utf-8').read()
open('app.js','w',encoding='utf-8').write(re.search(r'<script>(.*)</script>',s,re.S).group(1))
PY
node --check app.js && echo "script syntax: OK"
node tests/static_check.js index.html
node tests/test_logic.js
node tests/test_billing.js
node tests/test_exceptions.js
rm -f app.js
echo "ALL CHECKS PASSED"
