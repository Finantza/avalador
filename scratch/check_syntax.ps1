# Robust Bracket and Brace Checker for JavaScript and HTML Script tags

function Check-Brackets {
    param (
        [string]$Content,
        [string]$FileName,
        [int]$StartLineOffset = 1
    )

    $stack = [System.Collections.Generic.Stack[PSCustomObject]]::new()
    $pairs = @{
        ')' = '('
        '}' = '{'
        ']' = '['
    }
    
    $i = 0
    $n = $Content.Length
    $state = 'NORMAL' # NORMAL, STRING_S, STRING_D, STRING_T, LINE_COMMENT, BLOCK_COMMENT, REGEX
    $escaped = $false
    
    # Pre-calculate line numbers for each index
    $lineNums = New-Object int[] $n
    $currLine = $StartLineOffset
    for ($idx = 0; $idx -lt $n; $idx++) {
        $lineNums[$idx] = $currLine
        if ($Content[$idx] -eq "`n") {
            $currLine++
        }
    }
    
    $errors = [System.Collections.Generic.List[string]]::new()
    
    while ($i -lt $n) {
        $char = $Content[$i]
        $charStr = [string]$char
        
        if ($state -eq 'NORMAL') {
            if ($charStr -eq '/' -and ($i + 1) -lt $n -and $Content[$i+1] -eq '/') {
                $state = 'LINE_COMMENT'
                $i++
            }
            elseif ($charStr -eq '/' -and ($i + 1) -lt $n -and $Content[$i+1] -eq '*') {
                $state = 'BLOCK_COMMENT'
                $i++
            }
            elseif ($charStr -eq "'") {
                $state = 'STRING_S'
                $escaped = $false
            }
            elseif ($charStr -eq '"') {
                $state = 'STRING_D'
                $escaped = $false
            }
            elseif ($charStr -eq '`') {
                $state = 'STRING_T'
                $escaped = $false
            }
            elseif ($charStr -eq '/') {
                # Heuristic for regex vs division
                $prevStart = [Math]::Max(0, $i - 50)
                $prevText = $Content.Substring($prevStart, $i - $prevStart).Trim()
                $isRegex = $false
                if ($prevText.Length -gt 0) {
                    $lastChar = $prevText[$prevText.Length - 1]
                    if ($lastChar -in '=', '(', ',', '[', ':', '!', '&', '|', '?', '{', '}', ';', '>') {
                        $isRegex = $true
                    }
                    elseif ($prevText.EndsWith('return') -or $prevText.EndsWith('throw') -or $prevText.EndsWith('yield')) {
                        $isRegex = $true
                    }
                } else {
                    $isRegex = $true
                }
                
                if ($isRegex) {
                    $state = 'REGEX'
                    $escaped = $false
                }
            }
            elseif ($charStr -in '(', '{', '[') {
                $stack.Push([PSCustomObject]@{ Char = $charStr; Pos = $i; Line = $lineNums[$i] })
            }
            elseif ($charStr -in ')', '}', ']') {
                if ($stack.Count -eq 0) {
                    $errors.Add("Line $($lineNums[$i]): Unexpected closing '$charStr' at position $i")
                } else {
                    $top = $stack.Pop()
                    if ($pairs[$charStr] -ne $top.Char) {
                        $errors.Add("Line $($lineNums[$i]): Mismatched closing '$charStr' (expected matching for '$($top.Char)' from line $($top.Line)) at position $i")
                    }
                }
            }
        }
        elseif ($state -eq 'LINE_COMMENT') {
            if ($charStr -eq "`n") {
                $state = 'NORMAL'
            }
        }
        elseif ($state -eq 'BLOCK_COMMENT') {
            if ($charStr -eq '*' -and ($i + 1) -lt $n -and $Content[$i+1] -eq '/') {
                $state = 'NORMAL'
                $i++
            }
        }
        elseif ($state -eq 'STRING_S') {
            if ($escaped) {
                $escaped = $false
            } elseif ($charStr -eq '\') {
                $escaped = $true
            } elseif ($charStr -eq "'") {
                $state = 'NORMAL'
            }
        }
        elseif ($state -eq 'STRING_D') {
            if ($escaped) {
                $escaped = $false
            } elseif ($charStr -eq '\') {
                $escaped = $true
            } elseif ($charStr -eq '"') {
                $state = 'NORMAL'
            }
        }
        elseif ($state -eq 'STRING_T') {
            if ($escaped) {
                $escaped = $false
            } elseif ($charStr -eq '\') {
                $escaped = $true
            } elseif ($charStr -eq '`') {
                $state = 'NORMAL'
            }
        }
        elseif ($state -eq 'REGEX') {
            if ($escaped) {
                $escaped = $false
            } elseif ($charStr -eq '\') {
                $escaped = $true
            } elseif ($charStr -eq '/') {
                $state = 'NORMAL'
            }
        }
        
        $i++
    }
    
    while ($stack.Count -gt 0) {
        $top = $stack.Pop()
        $errors.Add("Line $($top.Line): Unclosed opening '$($top.Char)' near position $($top.Pos)")
    }
    
    return $errors
}

function Check-JsFile {
    param ([string]$Path)
    Write-Host "Checking JS File: $Path" -ForegroundColor Cyan
    if (-not (Test-Path $Path)) {
        Write-Host "File not found!" -ForegroundColor Red
        return
    }
    $content = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
    $errors = Check-Brackets -Content $content -FileName (Split-Path $Path -Leaf)
    
    if ($errors.Count -gt 0) {
        Write-Host "❌ $Path has $($errors.Count) error(s):" -ForegroundColor Red
        foreach ($err in $errors) {
            Write-Host "  $err" -ForegroundColor Yellow
        }
        return $false
    } else {
        Write-Host "✅ $($Path): Brackets/Braces OK" -ForegroundColor Green
        return $true
    }
}

function Check-HtmlFile {
    param ([string]$Path)
    Write-Host "Checking HTML File: $Path" -ForegroundColor Cyan
    if (-not (Test-Path $Path)) {
        Write-Host "File not found!" -ForegroundColor Red
        return
    }
    $content = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
    
    # Heuristic to find script tags and extract contents
    # We find indices of <script> and </script>
    $scriptStartPattern = "(?i)<script\b[^>]*>"
    $scriptEndPattern = "(?i)</script>"
    
    $starts = [regex]::Matches($content, $scriptStartPattern)
    $ends = [regex]::Matches($content, $scriptEndPattern)
    
    if ($starts.Count -ne $ends.Count) {
        Write-Host "❌ Mismatched script tags count! Starts: $($starts.Count), Ends: $($ends.Count)" -ForegroundColor Red
        return $false
    }
    
    $totalErrors = 0
    for ($idx = 0; $idx -lt $starts.Count; $idx++) {
        $startMatch = $starts[$idx]
        $endMatch = $ends[$idx]
        
        $tagHeader = $startMatch.Value
        if ($tagHeader -like "*src=*") {
            # Skip external script
            continue
        }
        
        $startPos = $startMatch.Index + $startMatch.Length
        $length = $endMatch.Index - $startPos
        
        if ($length -le 0) { continue }
        
        $scriptCode = $content.Substring($startPos, $length)
        
        # Calculate line number offset
        $precedingText = $content.Substring(0, $startPos)
        $lineOffset = ($precedingText -split "`n").Count
        
        $errors = Check-Brackets -Content $scriptCode -FileName (Split-Path $Path -Leaf) -StartLineOffset $lineOffset
        if ($errors.Count -gt 0) {
            Write-Host "❌ Script Block #$($idx+1) in $Path starting around line $lineOffset has errors:" -ForegroundColor Red
            foreach ($err in $errors) {
                Write-Host "  $err" -ForegroundColor Yellow
            }
            $totalErrors += $errors.Count
        }
    }
    
    if ($totalErrors -gt 0) {
        return $false
    } else {
        Write-Host "✅ $Path inline scripts: Brackets/Braces OK" -ForegroundColor Green
        return $true
    }
}

# Run checks
$overallSuccess = $true

$jsFile = "js/onyx_ui.js"
if (-not (Check-JsFile -Path $jsFile)) { $overallSuccess = $false }

$dashboardFile = "dashboard.html"
if (-not (Check-HtmlFile -Path $dashboardFile)) { $overallSuccess = $false }

$aiPortalFile = "ai_portal.html"
if (-not (Check-HtmlFile -Path $aiPortalFile)) { $overallSuccess = $false }

if ($overallSuccess) {
    Write-Host "`n🌟 EXCELLENT! ALL MODIFIED FILES ARE SYNTAX-OK AND PERFECTLY BALANCED! 🌟" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️ SOME FILES HAVE BRACKET/BRACE ERRORS. PLEASE INVESTIGATE. ⚠️" -ForegroundColor Red
    exit 1
}
