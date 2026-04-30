# Fix: `TypeError: log.push is not a function` in auto-keyword-generator.js

## Root cause
The log file (`keyword-generator-log.json`) is stored as a **date-keyed object** `{}` 
but the script initializes `log` as an array `[]` and calls `log.push()`.

## Option A — Run the patcher (easiest)
Drop `fix-auto-keyword-generator.js` in your repo root and run once:
```bash
node fix-auto-keyword-generator.js
```
Then commit the patched `auto-keyword-generator.js`.

## Option B — Manual edit (2 changes)

### Change 1: Log initialization (~top of file, near LOG_FILE constant)

**Before:**
```js
let log = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE)) : [];
// or: let log = [];
```

**After:**
```js
let log = {};
if (fs.existsSync(LOG_FILE)) {
  try {
    const raw = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    // Migrate old array format → date-keyed object
    if (Array.isArray(raw)) {
      raw.forEach(entry => { if (entry.date) log[entry.date] = entry; });
    } else {
      log = raw;
    }
  } catch(e) { log = {}; }
}
```

### Change 2: logRun() function (~line 340, exact crash line)

**Before:**
```js
log.push({ date: TODAY, generated, total_after: total, lang_breakdown: langBreakdown });
```

**After:**
```js
log[TODAY] = { date: TODAY, generated, total_after: total, lang_breakdown: langBreakdown };
```

## Why `log[TODAY] =` instead of `push`
Same-day runs overwrite instead of stacking — this is the intended behavior 
(prevents the 46-entry duplicate problem seen in the Quora log).
