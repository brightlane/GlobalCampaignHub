/**
 * audit-post.mjs — GlobalCampaignHub
 * ─────────────────────────────────────────────────────
 * Four independent auditors that score every blog post before it deploys.
 *
 * AUDITOR 1 — SEO           (min score: 80)
 * AUDITOR 2 — Content Quality (min score: 85)
 * AUDITOR 3 — Affiliate Links (min score: 100) ← zero tolerance
 * AUDITOR 4 — Translation     (min score: 80)  ← runs per language
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const THRESHOLDS = {
  seo:         80,
  quality:     85,
  affiliate:  100,
  translation: 80,
};

const MAX_RETRIES = 3;

async function claude(system, user, maxTokens = 600) {
  const MAX_API_RETRIES = 5;
  const BASE_DELAY      = 3000;
  for (let attempt = 1; attempt <= MAX_API_RETRIES; attempt++) {
    try {
      const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: maxTokens, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
      });
      if (res.status === 429 || res.status >= 500) {
        await new Promise(r => setTimeout(r, BASE_DELAY * Math.pow(2, attempt - 1)));
        continue;
      }
      const data = await res.json();
      if (data.error?.code === 'rate_limit_exceeded') { await new Promise(r => setTimeout(r, BASE_DELAY * Math.pow(2, attempt - 1))); continue; }
      if (data.error) throw new Error(`GitHub Models: ${data.error.message}`);
      let clean = data.choices[0].message.content.replace(/```json|```/g, '').trim();
      const start = clean.indexOf('{'), end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1) clean = clean.slice(start, end + 1);
      clean = clean.replace(/,\s*([}\]])/g, '$1').replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"');
      return JSON.parse(clean);
    } catch (err) {
      if (attempt === MAX_API_RETRIES) throw err;
      await new Promise(r => setTimeout(r, BASE_DELAY * Math.pow(2, attempt - 1)));
    }
  }
}

export async function auditSEO(post, keyword) {
  console.log('    🔍  Auditor 1: SEO...');
  const kw         = (typeof keyword === 'string' ? keyword : (keyword?.keyword || '')).toLowerCase();
  const titleLower = (post.title || '').toLowerCase();
  const metaLower  = (post.metaDescription || post.meta_description || '').toLowerCase();
  const h1Lower    = (post.h1 || '').toLowerCase();
  const allContent = [post.intro, ...(post.sections || []).map(s => s.content), post.conclusion].join(' ');

  const checks = {
    keyword_in_title:   titleLower.includes(kw),
    keyword_in_meta:    metaLower.includes(kw),
    keyword_in_h1:      h1Lower.includes(kw),
    title_length_ok:    post.title?.length >= 40 && post.title?.length <= 65,
    meta_length_ok:     (post.metaDescription || post.meta_description || '').length >= 140 && (post.metaDescription || post.meta_description || '').length <= 165,
    word_count_ok:      (post.wordCount || post.word_count || 0) >= 1200,
    has_sections:       (post.sections || []).length >= 4,
    has_faq:            (post.faq || []).length >= 4,
    has_internal_links: (post.internal_links || []).length >= 2,
    meta_keywords_set:  !!post.meta_keywords,
    h2_count_ok:        (post.sections || []).length >= 4,
    keyword_in_content: allContent.toLowerCase().includes(kw),
  };

  const weights = { keyword_in_title: 20, keyword_in_h1: 15, keyword_in_meta: 10, title_length_ok: 10, meta_length_ok: 10, word_count_ok: 10, has_sections: 8, has_faq: 7, has_internal_links: 5, meta_keywords_set: 2, h2_count_ok: 2, keyword_in_content: 1 };

  let score = 0;
  const issues = [], fixes = [];
  for (const [check, passed] of Object.entries(checks)) {
    if (passed) { score += weights[check] || 0; }
    else {
      switch (check) {
        case 'keyword_in_title': issues.push(`Keyword "${kw}" missing from title`); fixes.push(`Include "${kw}" in the title`); break;
        case 'keyword_in_h1': issues.push(`H1 missing keyword`); fixes.push(`Rewrite H1 to include "${kw}"`); break;
        case 'keyword_in_meta': issues.push(`Meta missing keyword`); fixes.push(`Add "${kw}" to meta description`); break;
        case 'title_length_ok': issues.push(`Title ${post.title?.length} chars — must be 40-65`); fixes.push(`Rewrite title to 40-65 chars`); break;
        case 'meta_length_ok': issues.push(`Meta ${(post.metaDescription||'').length} chars — must be 140-165`); fixes.push(`Rewrite meta to 140-165 chars`); break;
        case 'word_count_ok': issues.push(`Word count ${post.wordCount} below 1200`); fixes.push(`Expand to 1200+ words`); break;
        case 'has_sections': issues.push(`Only ${post.sections?.length} sections — need 4+`); fixes.push(`Add more sections`); break;
        case 'has_faq': issues.push(`Only ${post.faq?.length} FAQs — need 4+`); fixes.push(`Add more FAQ items`); break;
        case 'has_internal_links': issues.push(`Missing internal links`); fixes.push(`Add internal_links array`); break;
      }
    }
  }

  const passed = score >= THRESHOLDS.seo;
  console.log(`    📊  SEO score: ${score}/100 — ${passed ? '✅ PASS' : '❌ FAIL'}`);
  if (issues.length) console.log(`        Issues: ${issues.join(' | ')}`);
  return { score, passed, issues, fixes, checks };
}

export async function auditQuality(post) {
  console.log('    🔍  Auditor 2: Content Quality...');
  const result = await claude(
    `You are a ruthless content quality editor. Score strictly. Most AI content scores 60-75. Only genuinely excellent content scores 85+. Return ONLY valid JSON.`,
    `Score this blog post quality strictly.\n\nTITLE: ${post.title}\n\nINTRO:\n${(post.intro||'').substring(0,500)}\n\nSECTIONS:\n${(post.sections||[]).slice(0,2).map(s=>`H2: ${s.h2}\n${(s.content||'').substring(0,300)}`).join('\n\n')}\n\nFAQ COUNT: ${(post.faq||[]).length}\nWORD COUNT: ${post.wordCount||post.word_count}\n\nReturn ONLY JSON:\n{"score":0-100,"readability":0-100,"value_to_reader":0-100,"originality":0-100,"intro_hook":0-100,"natural_tone":true/false,"keyword_stuffed":true/false,"thin_content":true/false,"generic_ai_feel":true/false,"issues":[],"fixes":[]}`
  );

  let score = result.score || 0;
  if (result.keyword_stuffed) score = Math.min(score, 60);
  if (result.thin_content)    score = Math.min(score, 55);
  if (result.generic_ai_feel) score = Math.min(score, 65);
  result.score  = score;
  result.passed = score >= THRESHOLDS.quality;
  console.log(`    📊  Quality score: ${score}/100 — ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
  if (result.issues?.length) console.log(`        Issues: ${result.issues.join(' | ')}`);
  return result;
}

export function auditAffiliate(post, expectedAffUrl) {
  console.log('    🔍  Auditor 3: Affiliate Links...');
  if (!expectedAffUrl) return { passed: true, score: 100, issues: [], fixes: [] };

  const allContent = [post.intro||'', ...(post.sections||[]).map(s=>s.content||''), post.conclusion||''].join(' ');
  const escaped    = expectedAffUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const urlCount   = (allContent.match(new RegExp(escaped, 'g')) || []).length;

  const checks = {
    url_stored_correctly: post.affiliate_url === expectedAffUrl,
    url_in_content_3x:   urlCount >= 3,
    url_in_conclusion:   (post.conclusion||'').includes(expectedAffUrl),
    url_not_modified:    allContent.includes(expectedAffUrl),
    tool_matches:        !!post.tool,
  };

  const issues = [], fixes = [];
  if (!checks.url_stored_correctly) { issues.push(`Wrong affiliate_url. Expected: ${expectedAffUrl}`); fixes.push(`Set affiliate_url to: ${expectedAffUrl}`); }
  if (!checks.url_in_content_3x)   { issues.push(`URL only ${urlCount}x — needs 3+`); fixes.push(`Add URL ${3-urlCount} more times`); }
  if (!checks.url_in_conclusion)   { issues.push(`URL missing from conclusion`); fixes.push(`Add CTA with URL in conclusion`); }

  const passCount = Object.values(checks).filter(Boolean).length;
  const score     = passCount === Object.keys(checks).length ? 100 : Math.round((passCount / Object.keys(checks).length) * 80);
  const passed    = score >= THRESHOLDS.affiliate;

  console.log(`    📊  Affiliate score: ${score}/100 (URL count: ${urlCount}) — ${passed ? '✅ PASS' : '❌ FAIL'}`);
  if (issues.length) console.log(`        Issues: ${issues.join(' | ')}`);
  return { score, passed, issues, fixes, checks, url_count: urlCount };
}

export async function auditTranslation(originalPost, translatedPost, lang, affUrl) {
  console.log(`    🔍  Auditor 4: Translation (${lang.name})...`);
  const tContent = [translatedPost.intro||'', ...(translatedPost.sections||[]).map(s=>s.content||''), translatedPost.conclusion||''].join(' ');
  const escaped  = affUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const urlCount = (tContent.match(new RegExp(escaped, 'g')) || []).length;

  if (urlCount < 3) return { score: 0, passed: false, issues: [`URL only ${urlCount}x after translation`], fixes: [`Re-translate preserving URL ${affUrl} 3+ times`], url_count: urlCount };

  const result = await claude(
    `You are a professional ${lang.name} editor. Return ONLY JSON.`,
    `Rate this English → ${lang.name} translation.\n\nENGLISH:\n${(originalPost.intro||'').substring(0,300)}\n\n${lang.name}:\n${(translatedPost.intro||'').substring(0,300)}\n\nReturn ONLY JSON:\n{"score":0-100,"natural":true/false,"accurate":true/false,"culturally_appropriate":true/false,"robotic_phrasing":true/false,"issues":[],"fixes":[]}`
  );

  if (result.robotic_phrasing) result.score = Math.min(result.score || 0, 65);
  result.passed    = (result.score || 0) >= THRESHOLDS.translation;
  result.url_count = urlCount;
  console.log(`    📊  Translation (${lang.name}): ${result.score}/100 — ${result.passed ? '✅' : '❌'}`);
  return result;
}

export async function runAllAudits(post, keyword, affUrl) {
  console.log('\n  📋  Running all auditors...');
  const [seo, quality, affiliate] = await Promise.all([
    auditSEO(post, keyword),
    auditQuality(post),
    Promise.resolve(auditAffiliate(post, affUrl)),
  ]);

  const passed   = seo.passed && quality.passed && affiliate.passed;
  const allIssues = [...(seo.issues||[]), ...(quality.issues||[]), ...(affiliate.issues||[])];
  const allFixes  = [...(seo.fixes||[]),  ...(quality.fixes||[]),  ...(affiliate.fixes||[])];
  const feedback  = [allIssues.length ? `ISSUES:\n${allIssues.map(i=>`- ${i}`).join('\n')}` : '', allFixes.length ? `FIXES:\n${allFixes.map(f=>`- ${f}`).join('\n')}` : ''].filter(Boolean).join('\n\n');
  const scores    = { seo: seo.score, quality: quality.score, affiliate: affiliate.score, overall: Math.round((seo.score + quality.score + affiliate.score) / 3) };

  console.log(`\n  📊  SEO: ${scores.seo} | Quality: ${scores.quality} | Affiliate: ${scores.affiliate} | Overall: ${scores.overall}`);
  console.log(`  ${passed ? '✅  ALL PASSED' : '❌  FAILED — rewriting'}\n`);
  return { passed, scores, feedback, details: { seo, quality, affiliate } };
}

export function saveAuditReport(keyword, scores, attempt, passed) {
  const __dir = dirname(fileURLToPath(import.meta.url));
  const dir   = resolve(__dir, 'audit-logs');
  mkdirSync(dir, { recursive: true });
  const slug = keyword.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const date = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(resolve(dir, `${slug}-${date}.json`), JSON.stringify({ keyword, attempt, passed, scores, timestamp: new Date().toISOString(), thresholds: THRESHOLDS }, null, 2), 'utf-8');
}

export { THRESHOLDS, MAX_RETRIES };
