import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'e:\documentos\GitHub\GitHub\avaliiador\avalador\dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

for i, line in enumerate(content.splitlines()):
    if any(x in line for x in ('checkAuth', 'getCurrentUser')):
        print(f"Line {i+1}: {line.strip()}")
