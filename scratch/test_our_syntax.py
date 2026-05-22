import re
import sys
from check_html_js_syntax import check_html_file

files = [
    r"e:\documentos\GitHub\GitHub\avaliiador\avalador\index.html",
    r"e:\documentos\GitHub\GitHub\avaliiador\avalador\parents_portal.html",
    r"e:\documentos\GitHub\GitHub\avaliiador\avalador\register.html"
]

all_ok = True
for html_path in files:
    errors = check_html_file(html_path)
    if errors:
        print(f"[ERROR] {html_path} has {len(errors)} script syntax errors:")
        for e in errors:
            print("  ", e)
        all_ok = False
    else:
        print(f"[OK] {html_path} inline script syntax is perfectly balanced!")

if not all_ok:
    sys.exit(1)
