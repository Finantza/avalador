import re

def check_brackets_robust_content(content):
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

def check_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extract javascript script block contents
    # We look for <script> tags that don't have src attributes
    script_blocks = re.findall(r'<script\b[^>]*>(.*?)</script>', html_content, re.DOTALL)
    
    all_errors = []
    for idx, block in enumerate(script_blocks):
        if not block.strip():
            continue
        
        # Check if it has a src attribute (skip external scripts)
        # We can do this by checking if the preceding matches had src
        # But findall only returns the group content. Let's do a more precise match
        pass
    
    # Let's search script tags iteratively
    for match in re.finditer(r'<script\b([^>]*)>(.*?)</script>', html_content, re.DOTALL):
        attrs = match.group(1)
        code = match.group(2)
        if 'src=' in attrs:
            continue
        
        # Find start line of this script block in the HTML file
        start_pos = match.start(2)
        preceding_content = html_content[:start_pos]
        start_line = preceding_content.count('\n') + 1
        
        errs = check_brackets_robust_content(code)
        if errs:
            for e in errs:
                # Adjust line number relative to the HTML file
                match_line = re.match(r'Line (\d+):', e)
                if match_line:
                    local_line = int(match_line.group(1))
                    adjusted_line = start_line + local_line - 1
                    err_msg = e.replace(f"Line {local_line}:", f"Line {adjusted_line}:")
                    all_errors.append(err_msg)
                else:
                    all_errors.append(f"Line {start_line} (relative): {e}")
                    
    return all_errors

html_path = r"e:\documentos\GitHub\GitHub\avaliiador\avalador\dashboard.html"
errors = check_html_file(html_path)
if errors:
    print(f"[ERROR] {html_path} has {len(errors)} script syntax errors:")
    for e in errors:
        print("  ", e)
else:
    print(f"[OK] {html_path} inline script syntax is perfectly balanced!")
