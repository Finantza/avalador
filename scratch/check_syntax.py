import os
import re

def check_brackets(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip comments and strings to avoid false positives
    # Remove single line comments
    content = re.sub(r'//.*', '', content)
    # Remove multi-line comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    # Simple state machine to strip strings
    stripped = []
    in_string = False
    string_char = None
    escaped = False
    
    i = 0
    while i < len(content):
        char = content[i]
        if in_string:
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == string_char:
                in_string = False
            # ignore string contents
        else:
            if char in ("'", '"', '`'):
                in_string = True
                string_char = char
            else:
                stripped.append(char)
        i += 1
        
    stripped_code = "".join(stripped)
    
    # Stack checking for braces, brackets, parentheses
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    errors = []
    
    for idx, char in enumerate(stripped_code):
        if char in ('(', '{', '['):
            stack.append((char, idx))
        elif char in (')', '}', ']'):
            if not stack:
                errors.append(f"Unexpected closing {char} at position {idx}")
            else:
                top, _ = stack.pop()
                if pairs[char] != top:
                    errors.append(f"Mismatched closing {char} (expected matching for {top}) at position {idx}")
                    
    while stack:
        top, idx = stack.pop()
        errors.append(f"Unclosed opening {top} near position {idx}")
        
    return errors

js_dir = r"e:\documentos\GitHub\GitHub\avaliiador\avalador\js"
for file in os.listdir(js_dir):
    if file.endswith('.js'):
        path = os.path.join(js_dir, file)
        errs = check_brackets(path)
        if errs:
            print(f"[ERROR] {file} has {len(errs)} bracket/parentheses errors:")
            for e in errs[:5]:
                print("  ", e)
        else:
            print(f"[OK] {file} brackets/parentheses OK")
