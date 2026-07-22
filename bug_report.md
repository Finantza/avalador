# 🐛 Onyx Assessment Platform — Bug Report & Fixes

## Bugs Found

---

### 🔴 BUG 1 — `quiz.html`: Critical Script Load Order (Breaks Quiz)

**File**: [quiz.html](file:///e:/documentos/GitHub/GitHub/avaliiador/avalador/quiz.html#L78-L83)

**Problem**: Scripts are loaded in the wrong order. `legacy/tutor.js`, `onyx_ui.js`, `onyx_database.js`, and `onyx_engines.js` are ALL loaded **before** `onyx_core.js`. This means when those scripts run, `window.OnyxCore` is `undefined`. Calls to `OnyxEngines.QuestionEngine.generateQuestions()` and `OnyxCore.Tutor.simplifyText()` will fail silently or throw runtime errors.

**Correct dependency order**:
1. `onyx_core.js` (defines `window.OnyxCore`)
2. `onyx_db_manager.js` (uses `OnyxCore`)
3. `onyx_database.js` (uses `OnyxCore`)
4. `onyx_engines.js` (uses `OnyxCore`)
5. `onyx_ui.js`
6. `legacy/tutor.js` (self-contained class)

---

### 🔴 BUG 2 — `register.html`: New User Missing `coins` & `inventory`

**File**: [register.html](file:///e:/documentos/GitHub/GitHub/avaliiador/avalador/register.html#L206)

**Problem**: When a new user registers, the saved object doesn't include `coins` and `inventory` fields. Since the quiz immediately reads these for the item toolbar UI, new users will always see `0` on all item slots (Tutor, Life, 50/50, Time, Skip), but existing default users will have them from `createTestUser()`.

**Fix**: Add `coins: 0, inventory: { tutor: 3, life: 1, fifty: 1, time: 1, skip: 1 }` to the new user object.

---

### 🟡 BUG 3 — `results.html`: Hardcoded Question Total

**File**: [results.html](file:///e:/documentos/GitHub/GitHub/avaliiador/avalador/results.html#L99)

**Problem**: Accuracy is computed as `(lastMission.score / 10) * 100`, where `10` is hardcoded. If the quiz ever runs a different number of questions (e.g., from `extremo.js` bootcamp challenges), the percentage will be wrong.

**Fix**: Use `lastMission.total || 10` to read from the history record (which the quiz already saves via `questions.length`). Quiz history currently doesn't save `total`, so we fix both files.

---

### 🟡 BUG 4 — `quiz.html`: `tutor-floating-panel` starts with class `hidden` but is never toggled via that class

**File**: [quiz.html](file:///e:/documentos/GitHub/GitHub/avaliiador/avalador/quiz.html#L69-L76)

**Problem**: The floating tutor panel has the class `hidden` on the initial HTML. The JS shows/hides it via `classList.add('active')` and `classList.remove('active')`. The `hidden` class is never removed, meaning if CSS has `display: none` on `.hidden`, the panel may never appear. The close button only removes `active` without removing `hidden`.

**Fix**: Remove the `hidden` class from the initial HTML and use only `active` to control visibility.

---

## Summary of Fixes Applied

| # | File | Severity | Fix |
|---|------|----------|-----|
| 1 | `quiz.html` | 🔴 Critical | Reorder script tags |
| 2 | `register.html` | 🔴 Critical | Add coins + inventory to new user |
| 3 | `results.html` | 🟡 Medium | Use dynamic total from history |
| 4 | `quiz.html` | 🟡 Medium | Fix tutor panel hidden/active class |
