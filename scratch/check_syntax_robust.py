import os
import re

def check_brackets_robust(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    errors = []
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    i = 0
    n = len(content)
    
    state = 'NORMAL'  # NORMAL, STRING_S, STRING_D, STRING_T, LINE_COMMENT, BLOCK_COMMENT, REGEX
    escaped = False
    
    # Trace bracket source lines
    line_nums = []
    curr_line = 1
    for char in content:
        line_nums.append(curr_line)
        if char == '\n':
            curr_line += 1
            
    while i < n:
        char = content[i]
        
        if state == 'NORMAL':
            if char == '/' and i + 1 < n and content[i+1] == '/':
                state = 'LINE_COMMENT'
                i += 1
            elif char == '/' and i + 1 < n and content[i+1] == '*':
                state = 'BLOCK_COMMENT'
                i += 1
            elif char == "'":
                state = 'STRING_S'
                escaped = False
            elif char == '"':
                state = 'STRING_D'
                escaped = False
            elif char == '`':
                state = 'STRING_T'
                escaped = False
            elif char == '/':
                # Basic heuristic for regex vs division: 
                # regex is usually after assignment, punctuation, keywords, or start of file/statement
                # We can check the last few non-space characters
                prev_text = content[max(0, i-50):i].strip()
                is_regex = False
                if prev_text:
                    last_char = prev_text[-1]
                    if last_char in ('=', '(', ',', '[', ':', '!', '&', '|', '?', '{', '}', ';', '>'):
                        is_regex = True
                    elif prev_text.endswith('return') or prev_text.endswith('throw') or prev_text.endswith('yield'):
                        is_regex = True
                else:
                    is_regex = True
                
                if is_regex:
                    state = 'REGEX'
                    escaped = False
                else:
                    # Division operator, do nothing
                    pass
            elif char in ('(', '{', '['):
                stack.append((char, i, line_nums[i]))
            elif char in (')', '}', ']'):
                if not stack:
                    errors.append(f"Line {line_nums[i]}: Unexpected closing '{char}' at position {i}")
                else:
                    top, start_idx, start_line = stack.pop()
                    if pairs[char] != top:
                        errors.append(f"Line {line_nums[i]}: Mismatched closing '{char}' (expected matching for '{top}' from line {start_line}) at position {i}")
                        
        elif state == 'LINE_COMMENT':
            if char == '\n':
                state = 'NORMAL'
                
        elif state == 'BLOCK_COMMENT':
            if char == '*' and i + 1 < n and content[i+1] == '/':
                state = 'NORMAL'
                i += 1
                
        elif state == 'STRING_S':
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == "'":
                state = 'NORMAL'
                
        elif state == 'STRING_D':
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == '"':
                state = 'NORMAL'
                
        elif state == 'STRING_T':
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == '`':
                state = 'NORMAL'
                
        elif state == 'REGEX':
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == '/':
                state = 'NORMAL'
                
        i += 1
        
    while stack:
        top, start_idx, start_line = stack.pop()
        errors.append(f"Line {start_line}: Unclosed opening '{top}' near position {start_idx}")
        
    return errors

js_dir = r"e:\documentos\GitHub\GitHub\avaliiador\avalador\js"
for file in sorted(os.listdir(js_dir)):
    if file.endswith('.js'):
        path = os.path.join(js_dir, file)
        errs = check_brackets_robust(path)
        if errs:
            print(f"[ERROR] {file} has {len(errs)} bracket/parentheses errors:")
            for e in errs[:10]:
                print("  ", e)
        else:
            print(f"[OK] {file} brackets/parentheses OK")
