#!/usr/bin/env node
/**
 * fix-auto-keyword-generator.js
 * Run once from repo root: node fix-auto-keyword-generator.js
 * Patches auto-keyword-generator.js to fix the log.push() TypeError.
 */

const fs = require('fs');
const path = require('path');

const TARGET = path.join(__dirname, 'auto-keyword-generator.js');
if (!fs.existsSync(TARGET)) {
  console.error('auto-keyword-generator.js not found in current directory');
  process.exit(1);
}

let src = fs.readFileSync(TARGET, 'utf8');
const orig = src;
let changes = 0;

// ── FIX 1: log.push(entry) → log[TODAY] = entry ──────────────────────────────
// Handles the exact crash line and any variant of it
const pushPatterns = [
  // Exact match from stack trace
  /log\.push\(\{[\s\S]*?date:\s*TODAY[\s\S]*?lang_breakdown:\s*langBreakdown\s*\}\);/,
  // Fallback: any log.push with a date property
  /log\.push\(\{[^}]*date:[^}]*\}\);/,
];

for (const pat of pushPatterns) {
  if (pat.test(src)) {
    src = src.replace(pat, match => {
      // Extract the object literal content and replace push with keyed assignment
      const objContent = match.replace(/^log\.push\(/, '').replace(/\);$/, '');
      return `log[TODAY] = ${objContent};`;
    });
    changes++;
    console.log('✓ Fix 1 applied: log.push() → log[TODAY] =');
    break;
  }
}

if (changes === 0) {
  // Broader fallback: any log.push call
  src = src.replace(/log\.push\((\{[\s\S]*?\})\);/g, (match, obj) => {
    changes++;
    console.log('✓ Fix 1 applied (broad): log.push() → log[TODAY] =');
    return `log[TODAY] = ${obj};`;
  });
}

// ── FIX 2: log initialization — replace array init with object init ───────────
// Pattern: let log = [] or let log = ...parse...|| []
const arrayInitPatterns = [
  // let log = [];
  { find: /let\s+log\s*=\s*\[\];/g, name: 'let log = []' },
  // let log = JSON.parse(...) || []
  { find: /let\s+log\s*=\s*(?:fs\.existsSync\([^)]+\)\s*\?\s*)?JSON\.parse\([^)]+\)\s*(?:\|\|\s*\[\])?;/g, name: 'let log = JSON.parse() || []' },
  // let log = existsSync ? parse : []
  { find: /let\s+log\s*=\s*fs\.existsSync\([^)]+\)\s*\?\s*JSON\.parse[^:]+:\s*\[\];/g, name: 'let log = existsSync ? ... : []' },
];

const logInitReplacement = `let log = {};
if (fs.existsSync(LOG_FILE)) {
  try {
    const raw = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    // Migrate: if old format was array, convert to date-keyed object
    if (Array.isArray(raw)) {
      raw.forEach(entry => { if (entry.date) log[entry.date] = entry; });
    } else {
      log = raw;
    }
  } catch(e) { log = {}; }
}`;

let initFixed = false;
for (const { find, name } of arrayInitPatterns) {
  if (find.test(src)) {
    // Reset lastIndex for global regex
    find.lastIndex = 0;
    src = src.replace(find, logInitReplacement);
    changes++;
    initFixed = true;
    console.log(`✓ Fix 2 applied: replaced log init (${name})`);
    break;
  }
}

if (!initFixed) {
  console.log('⚠  Fix 2: log init pattern not matched — check manually');
  console.log('   Ensure log is initialized as {} not [] before logRun() is called');
}

// ── WRITE ─────────────────────────────────────────────────────────────────────
if (src !== orig) {
  // Backup original
  fs.writeFileSync(TARGET + '.bak', orig);
  fs.writeFileSync(TARGET, src);
  console.log(`\n✅ ${changes} fix(es) applied to auto-keyword-generator.js`);
  console.log('   Backup saved as auto-keyword-generator.js.bak');
} else {
  console.log('\n⚠  No changes made — patterns not matched');
  console.log('   Apply manually: change log.push({...}) to log[TODAY] = {...}');
  console.log('   And initialize: let log = {} instead of let log = []');
  process.exit(1);
}
