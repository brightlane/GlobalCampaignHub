#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB CONTENT GENERATOR v1.0
//  Run: node generate.js [command] [options]
//
//  Commands:
//    node generate.js topics          — generate 20 new post topics
//    node generate.js topics --n=50   — generate 50 new post topics
//    node generate.js keywords        — generate 50 new keywords
//    node generate.js keywords --n=100 — generate 100 new keywords
//    node generate.js campaign --kw="best vpn 2026" — generate campaign page content
//    node generate.js blog --slug=nordvpn-review-2026 — generate full blog post
//    node generate.js all             — run all generators
//    node generate.js status          — show current content status
//
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
// ═══════════════════════════════════════════════════════════════════════

const fs    = require('fs');
const https = require('https');
const path  = require('path');

const MODEL   = 'claude-sonnet-4-20250514';
const API_KEY = process.env.ANTHROPIC_API_KEY;
const TODAY   = new Date().toISOString().slice(0, 10);
const BASE    = 'https://brightlane.github.io/GlobalCampaignHub';

// ── All 68 merchants
const MERCHANTS = [
  { id:'gh-efile',               name:'E-file.com',              cat:'Tax',       lc:'007949021469002241' },
  { id:'gh-etax',                name:'E TAX LLC',               cat:'Tax',       lc:'007949113645003507' },
  { id:'gh-taxextension',        name:'TaxExtension.com',        cat:'Tax',       lc:'007949033342002305' },
  { id:'gh-eztaxreturn',         name:'ezTaxReturn.com',         cat:'Tax',       lc:'007949053344004952' },
  { id:'gh-nordvpn',             name:'NordVPN',                 cat:'Software',  lc:'007949143344006843' },
  { id:'gh-depositphotos',       name:'Depositphotos',           cat:'Software',  lc:'007949063344003921' },
  { id:'gh-filmora',             name:'Wondershare Filmora',     cat:'Software',  lc:'007949165260004532' },
  { id:'gh-pdfelement',          name:'Wondershare PDFelement',  cat:'Software',  lc:'007949165372004532' },
  { id:'gh-edraw',               name:'Edraw Mind/Max',          cat:'Software',  lc:'007949165246006886' },
  { id:'gh-sidify',              name:'Sidify',                  cat:'Software',  lc:'007949163344007882' },
  { id:'gh-movavi',              name:'Movavi Software',         cat:'Software',  lc:'007949153344007119' },
  { id:'gh-jalbum',              name:'jAlbum',                  cat:'Software',  lc:'007949143344006442' },
  { id:'gh-updf',                name:'UPDF',                    cat:'Software',  lc:'007949163344008112' },
  { id:'gh-itoolab',             name:'iToolab',                 cat:'Software',  lc:'007949163344008441' },
  { id:'gh-tenorshare',          name:'Tenorshare',              cat:'Software',  lc:'007949163344008992' },
  { id:'gh-appypie',             name:'Appy Pie',                cat:'Software',  lc:'007949153344007442' },
  { id:'gh-individualsoftware',  name:'Individual Software',     cat:'Software',  lc:'007949133344005882' },
  { id:'gh-youware',             name:'YouWare',                 cat:'Software',  lc:'007949163344008118' },
  { id:'gh-renoise',             name:'Renoise',                 cat:'Software',  lc:'007949143344006551' },
  { id:'gh-picador',             name:'Picador Multimedia',      cat:'Software',  lc:'007949133344006228' },
  { id:'gh-boardvitals',         name:'BoardVitals',             cat:'Education', lc:'007949114675005824' },
  { id:'gh-surgent',             name:'Surgent CPA',             cat:'Education', lc:'007949123344006122' },
  { id:'gh-hrcp',                name:'HRCP',                    cat:'Education', lc:'007949093344005114' },
  { id:'gh-oakstone',            name:'Oakstone Medical',        cat:'Education', lc:'007949103344005432' },
  { id:'gh-securitiesinstitute', name:'Securities Institute',    cat:'Education', lc:'007949113344005987' },
  { id:'gh-illumeo',             name:'Illumeo',                 cat:'Education', lc:'007949143344006221' },
  { id:'gh-wolterskluwer',       name:'Wolters Kluwer LWW',      cat:'Education', lc:'007949165370003224' },
  { id:'gh-learntasticcpr',      name:'LearnTastic CPR',         cat:'Education', lc:'007949143344006112' },
  { id:'gh-learntasticahca',     name:'LearnTastic AHCA',        cat:'Education', lc:'007949143344006113' },
  { id:'gh-pmtraining',          name:'PM Training',             cat:'Education', lc:'007949143344006992' },
  { id:'gh-canadapetcare',       name:'CanadaPetCare',           cat:'Pet Care',  lc:'007949083344004721' },
  { id:'gh-bestvetcare',         name:'BestVetCare',             cat:'Pet Care',  lc:'007949093344004992' },
  { id:'gh-budgetpetcare',       name:'BudgetPetCare',           cat:'Pet Care',  lc:'007949103344005118' },
  { id:'gh-budgetpetworld',      name:'BudgetPetWorld',          cat:'Pet Care',  lc:'007949113344005224' },
  { id:'gh-discountpetcare',     name:'DiscountPetCare',         cat:'Pet Care',  lc:'007949123344005441' },
  { id:'gh-nursejamie',          name:'Nurse Jamie',             cat:'Health',    lc:'007949153344007112' },
  { id:'gh-personalabs',         name:'Personalabs',             cat:'Health',    lc:'007949133344005442' },
  { id:'gh-ayurvedaexperience',  name:'Ayurveda Experience',     cat:'Health',    lc:'007949163344008221' },
  { id:'gh-maxpeedingrodsus',    name:'Maxpeedingrods US',       cat:'Auto',      lc:'007949133344006421' },
  { id:'gh-maxpeedingrodsau',    name:'Maxpeedingrods AU',       cat:'Auto',      lc:'007949143344006554' },
  { id:'gh-lafuente',            name:'La Fuente Imports',       cat:'Auto',      lc:'007949083344003992' },
  { id:'gh-buildasign',          name:'BuildASign',              cat:'Print',     lc:'007949043344001995' },
  { id:'gh-bannersonthecheap',   name:'BannersOnTheCheap',       cat:'Print',     lc:'007949073344003661' },
  { id:'gh-canvasonthecheap',    name:'CanvasOnTheCheap',        cat:'Print',     lc:'007949073344003662' },
  { id:'gh-easycanvasprints',    name:'Easy Canvas Prints',      cat:'Print',     lc:'007949063344003112' },
  { id:'gh-etchingexpressions',  name:'Etching Expressions',     cat:'Print',     lc:'007949083344004332' },
  { id:'gh-ryonet',              name:'Ryonet',                  cat:'Print',     lc:'007949084633004512' },
  { id:'gh-trademarkhardware',   name:'Trademark Hardware',      cat:'Hardware',  lc:'007949123344005912' },
  { id:'gh-trademarksoundproofing',name:'Trademark Soundproofing',cat:'Hardware', lc:'007949133344006118' },
  { id:'gh-warehouse115',        name:'Warehouse 115',           cat:'Hardware',  lc:'007949163344007442' },
  { id:'gh-fieldtex',            name:'Fieldtex Products',       cat:'Hardware',  lc:'007949123344005118' },
  { id:'gh-productsonthego',     name:'Products On The Go',      cat:'Hardware',  lc:'007949113344004882' },
  { id:'gh-halloweencostumes',   name:'HalloweenCostumes.com',   cat:'Lifestyle', lc:'007949053344002874' },
  { id:'gh-graeters',            name:"Graeter's Ice Cream",     cat:'Lifestyle', lc:'007949073344004112' },
  { id:'gh-thechessstore',       name:'The Chess Store',         cat:'Lifestyle', lc:'007949103344005112' },
  { id:'gh-museumreplicas',      name:'MuseumReplicas.com',      cat:'Lifestyle', lc:'007949113344005442' },
  { id:'gh-atlantacutlery',      name:'Atlanta Cutlery',         cat:'Lifestyle', lc:'007949123344005771' },
  { id:'gh-vipertec',            name:'Viper Tec',               cat:'Lifestyle', lc:'007949133344006224' },
  { id:'gh-combatflipflops',     name:'Combat Flip Flops',       cat:'Lifestyle', lc:'007949143344006881' },
  { id:'gh-camanoislandcoffee',  name:'Camano Island Coffee',    cat:'Lifestyle', lc:'007949053344002441' },
  { id:'gh-readygolf',           name:'ReadyGolf',               cat:'Lifestyle', lc:'007949103344004551' },
  { id:'gh-gunsinternational',   name:'GunsInternational',       cat:'Lifestyle', lc:'007949093344004221' },
  { id:'gh-carmellimo',          name:'Carmel Car & Limo',       cat:'Lifestyle', lc:'007949053344002881' },
  { id:'gh-bugatchi',            name:'Bugatchi',                cat:'Lifestyle', lc:'007949153344007662' },
  { id:'gh-surveyjunkie',        name:'Survey Junkie',           cat:'Lifestyle', lc:'007949033344001882' },
  { id:'gh-tastyribbon',         name:'Tasty Ribbon',            cat:'Lifestyle', lc:'007949153344007881' },
  { id:'gh-bgmgirl',             name:'BGM Girl',                cat:'Lifestyle', lc:'007949153344007992' },
  { id:'gh-incentrev',           name:'Incentrev',               cat:'Lifestyle', lc:'007949123344005991' },
];

// ── API call
function callApi(prompt, maxTokens = 8000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content && parsed.content[0]) resolve(parsed.content[0].text);
          else reject(new Error('No content: ' + data.slice(0, 300)));
        } catch(e) { reject(new Error('Parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function parseJson(text) {
  const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
  try { return JSON.parse(clean); } catch(e) {
    const match = clean.match(/[\[\{][\s\S]*[\]\}]/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Cannot parse JSON: ' + e.message);
  }
}

// ── STATUS command
function cmdStatus() {
  console.log('\n📊 GLOBALCAMPAIGNHUB CONTENT STATUS');
  console.log('════════════════════════════════════');

  const files = {
    'post-topics.json':        'Post Topics',
    'targetedkeys.js':         'Targeted Keywords',
    'injector-log.json':       'Injector Log',
    'keyword-generator-log.json': 'Keyword Generator Log',
    'keyword-injector-log.json':  'Keyword Injector Log',
  };

  Object.entries(files).forEach(([file, label]) => {
    if (!fs.existsSync(file)) {
      console.log(`  ✗ ${label}: NOT FOUND`);
      return;
    }
    const stat = fs.statSync(file);
    const kb = (stat.size / 1024).toFixed(1);

    if (file === 'post-topics.json') {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const total   = data.topics.length;
      const pending = data.topics.filter(t => !t.published).length;
      console.log(`  ✓ ${label}: ${total} total, ${pending} pending, ${total - pending} published`);
    } else if (file === 'targetedkeys.js') {
      const content = fs.readFileSync(file, 'utf8');
      const count = (content.match(/keyword:/g) || []).length;
      const langs = new Set();
      (content.match(/lang: '([^']+)'/g) || []).forEach(m => langs.add(m.replace("lang: '","").replace("'","")));
      console.log(`  ✓ ${label}: ${count} keywords, ${langs.size} languages (${kb}KB)`);
    } else if (file === 'injector-log.json') {
      const log = JSON.parse(fs.readFileSync(file, 'utf8'));
      const last = log[log.length - 1];
      console.log(`  ✓ ${label}: ${log.length} runs, last: ${last?.date || 'N/A'} — "${last?.slug || 'N/A'}"`);
    } else {
      console.log(`  ✓ ${label}: ${kb}KB`);
    }
  });

  // Blog files
  const blogFiles = ['blog.html','blog-es.html','blog-fr.html','blog-de.html','blog-zh.html','blog-ar.html','blog-ru.html','blog-ja.html','blog-ko.html','blog-hi.html','blog-pt.html','blog-pt-br.html','blog-it.html','blog-nl.html','blog-pl.html','blog-tr.html','blog-id.html','blog-vi.html','blog-th.html','blog-zh-tw.html'];
  const found = blogFiles.filter(f => fs.existsSync(f)).length;
  console.log(`  ✓ Blog Files: ${found}/20 language files present`);

  console.log('\n  Key Pages:');
  ['index.html','merchants.html','inventory.html','campaign-page.html','sitemap.xml','robots.txt','llms.txt','lmss.txt'].forEach(f => {
    console.log(`  ${fs.existsSync(f) ? '✓' : '✗'} ${f}`);
  });

  console.log('\n  Scripts:');
  ['inject.js','auto-topic-generator.js','auto-keyword-generator.js','keyword-injector.js','generate.js','language-redirect.js'].forEach(f => {
    console.log(`  ${fs.existsSync(f) ? '✓' : '✗'} ${f}`);
  });

  console.log('════════════════════════════════════\n');
}

// ── TOPICS command
async function cmdTopics(n = 20) {
  console.log(`\n📝 Generating ${n} new post topics...`);

  if (!fs.existsSync('post-topics.json')) {
    console.error('✗ post-topics.json not found');
    return;
  }

  const data = JSON.parse(fs.readFileSync('post-topics.json', 'utf8'));
  const existingSlugs = data.topics.map(t => t.slug);
  const pending = data.topics.filter(t => !t.published).length;
  console.log(`  Current: ${data.topics.length} total, ${pending} pending`);

  // Pick least-covered merchants
  const coverage = {};
  MERCHANTS.forEach(m => coverage[m.id] = 0);
  data.topics.forEach(t => { if (coverage[t.merchant] !== undefined) coverage[t.merchant]++; });
  const targets = [...MERCHANTS].sort((a,b) => coverage[a.id] - coverage[b.id]).slice(0, Math.min(n, 20));

  const merchantList = targets.map(m => `- "${m.id}" | ${m.name} | ${m.cat}`).join('\n');
  const existingSample = existingSlugs.slice(-20).join(', ');

  const prompt = `Generate exactly ${n} blog post topics for GlobalCampaignHub affiliate site (LinkConnector Account 007949, gh- atid prefix).

Target merchants (prioritize — they need more content):
${merchantList}

Existing slugs (do NOT duplicate): ${existingSample}

Rules:
- Genuine buyer guides, reviews, comparisons, how-tos
- Target real high-volume search keywords
- English content only in _en fields
- Unique slugs in kebab-case

Return ONLY a valid JSON array. No markdown. Start with [ end with ]

Each topic format:
{
  "slug": "unique-slug-2026",
  "merchant": "gh-merchantid",
  "published": false,
  "title_en": "Full SEO Title",
  "category_en": "Category",
  "metaDesc_en": "155 char meta description",
  "keywords_en": "kw1,kw2,kw3,kw4,kw5",
  "intro_en": "2-3 sentence intro",
  "callout_en": "Key insight or tip",
  "h2a_en": "First H2 heading",
  "body1_en": "2-3 sentence body paragraph",
  "bullets_en": ["Point 1","Point 2","Point 3","Point 4","Point 5","Point 6"],
  "verdict_title_en": "Merchant — Short Verdict",
  "verdict_desc_en": "2-3 sentence verdict",
  "h2b_en": "Second H2 heading",
  "body2_en": "2-3 sentence paragraph",
  "cta_en": "CTA button text",
  "cta2_en": "Secondary CTA text",
  "faqs_en": [
    {"q":"Question 1?","a":"Answer 1."},
    {"q":"Question 2?","a":"Answer 2."},
    {"q":"Question 3?","a":"Answer 3."}
  ]
}`;

  const response = await callApi(prompt, 8000);
  const topics = parseJson(response);

  if (!Array.isArray(topics)) throw new Error('Not an array');

  const existing = new Set(existingSlugs);
  const valid = topics.filter(t => {
    if (!t.slug || !t.merchant || !t.title_en) return false;
    if (existing.has(t.slug)) { console.log(`  ⚠ Skip duplicate: ${t.slug}`); return false; }
    existing.add(t.slug);
    t.published = false;
    return true;
  });

  data.topics.push(...valid);
  data.meta.total = data.topics.length;
  data.meta.last_updated = TODAY;
  fs.writeFileSync('post-topics.json', JSON.stringify(data, null, 2));

  console.log(`  ✓ Added ${valid.length} new topics`);
  console.log(`  Total: ${data.topics.length} topics, ${data.topics.filter(t=>!t.published).length} pending`);
}

// ── KEYWORDS command
async function cmdKeywords(n = 50) {
  console.log(`\n🔍 Generating ${n} new keywords in 20 languages...`);

  const existing = fs.existsSync('targetedkeys.js')
    ? (fs.readFileSync('targetedkeys.js','utf8').match(/keyword: '([^']+)'/g) || []).map(m => m.replace("keyword: '","").replace("'",""))
    : [];

  console.log(`  Existing: ${existing.length} keywords`);

  const sample = existing.slice(-15).join(', ');
  const prompt = `Generate exactly ${n} targeted keywords for GlobalCampaignHub (68 merchants, LinkConnector 007949).

Rules:
- Minimum 40% non-English keywords IN their native language
- Languages: en, es, fr, de, zh, zh-tw, ja, ko, pt, pt-br, hi, it, nl, pl, ar, ru, tr, id, vi, th
- High volume keywords (100K+ monthly searches preferred)
- Do NOT use any of these existing keywords: ${sample}

Return ONLY a valid JSON array. No markdown.

Format:
[
  { "keyword": "best vpn 2026", "volume": 2100000, "merchant": "gh-nordvpn", "lc": "007949143344006843", "cat": "Software", "blogSlug": "nordvpn-review-2026", "lang": "en" },
  { "keyword": "mejor vpn 2026", "volume": 890000, "merchant": "gh-nordvpn", "lc": "007949143344006843", "cat": "Software", "blogSlug": "nordvpn-review-2026", "lang": "es" }
]

Available merchant IDs and LCs:
${MERCHANTS.slice(0,20).map(m => `${m.id} (${m.lc}) — ${m.name} — ${m.cat}`).join('\n')}
...and all 68 merchants.`;

  const response = await callApi(prompt, 8000);
  const keywords = parseJson(response);

  if (!Array.isArray(keywords)) throw new Error('Not an array');

  const existingSet = new Set(existing.map(k => k.toLowerCase()));
  const valid = keywords.filter(k => {
    if (!k.keyword || !k.merchant || !k.volume) return false;
    if (existingSet.has(k.keyword.toLowerCase())) return false;
    existingSet.add(k.keyword.toLowerCase());
    if (!k.lang) k.lang = 'en';
    return true;
  });

  valid.sort((a,b) => b.volume - a.volume);

  if (fs.existsSync('targetedkeys.js')) {
    let content = fs.readFileSync('targetedkeys.js', 'utf8');
    const newEntries = valid.map(k =>
      `  { keyword: ${JSON.stringify(k.keyword)}, volume: ${k.volume}, merchant: ${JSON.stringify(k.merchant)}, lc: ${JSON.stringify(k.lc)}, cat: ${JSON.stringify(k.cat)}, blogSlug: ${JSON.stringify(k.blogSlug||k.merchant+'-review-2026')}, lang: ${JSON.stringify(k.lang)} },`
    ).join('\n');

    const marker = content.lastIndexOf('];');
    if (marker !== -1) {
      content = content.slice(0, marker) + '\n  // Generated ' + TODAY + '\n' + newEntries + '\n' + content.slice(marker);
      fs.writeFileSync('targetedkeys.js', content);
    }
  }

  const langBreakdown = {};
  valid.forEach(k => { langBreakdown[k.lang] = (langBreakdown[k.lang]||0)+1; });
  console.log(`  ✓ Added ${valid.length} keywords`);
  console.log(`  Languages: ${Object.entries(langBreakdown).sort((a,b)=>b[1]-a[1]).map(([l,n])=>`${l}:${n}`).join(', ')}`);
}

// ── BLOG command
async function cmdBlog(slug) {
  if (!slug) { console.error('✗ Provide --slug=your-slug'); return; }
  console.log(`\n📄 Generating full blog post for: ${slug}`);

  if (!fs.existsSync('post-topics.json')) { console.error('✗ post-topics.json not found'); return; }

  const data = JSON.parse(fs.readFileSync('post-topics.json', 'utf8'));
  const topic = data.topics.find(t => t.slug === slug);

  if (!topic) {
    console.error(`✗ Topic "${slug}" not found in post-topics.json`);
    console.log('  Available unpublished slugs:');
    data.topics.filter(t=>!t.published).slice(0,10).forEach(t => console.log(`    - ${t.slug}`));
    return;
  }

  const merchant = MERCHANTS.find(m => m.id === topic.merchant);
  if (!merchant) { console.error(`✗ Merchant ${topic.merchant} not found`); return; }

  const prompt = `Generate a complete, high-quality affiliate blog post for GlobalCampaignHub.

Merchant: ${merchant.name} (${merchant.cat})
Affiliate URL: https://www.linkconnector.com/ta.php?lc=${merchant.lc}&atid=${merchant.id}
Topic: ${topic.title_en}
Keywords: ${topic.keywords_en}

Write a full 800-1200 word buyer guide in English. Include:
- Compelling introduction
- 2-3 H2 sections with substantial body text
- Feature comparison or bullet points
- Honest verdict
- 3 FAQ questions and answers
- Natural affiliate link placement

Return the content as a JSON object:
{
  "intro_en": "...",
  "callout_en": "...",
  "h2a_en": "...",
  "body1_en": "...",
  "bullets_en": ["...", "...", "...", "...", "...", "..."],
  "verdict_title_en": "...",
  "verdict_desc_en": "...",
  "h2b_en": "...",
  "body2_en": "...",
  "cta_en": "...",
  "cta2_en": "...",
  "faqs_en": [{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."}]
}`;

  const response = await callApi(prompt, 4000);
  const content = parseJson(response);

  // Merge into topic
  Object.assign(topic, content);
  fs.writeFileSync('post-topics.json', JSON.stringify(data, null, 2));
  console.log(`  ✓ Blog content generated for: ${slug}`);
  console.log(`  Run inject.js to publish this post to all 20 language blog files.`);
}

// ── CAMPAIGN command
async function cmdCampaign(kw) {
  if (!kw) { console.error('✗ Provide --kw="your keyword"'); return; }
  console.log(`\n🎯 Generating campaign content for: "${kw}"`);

  const merchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
  const prompt = `Generate campaign page content for the keyword "${kw}" for GlobalCampaignHub.

Merchant to feature: ${merchant.name} (${merchant.cat})
Affiliate: https://www.linkconnector.com/ta.php?lc=${merchant.lc}&atid=${merchant.id}

Return JSON:
{
  "title": "Page title targeting the keyword",
  "metaDesc": "155 char meta description",
  "heroSub": "2 sentence hero subheading",
  "proofPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "useCases": [
    {"tab": "Tab label", "h": "Heading", "p": "2 sentence description"},
    {"tab": "Tab label", "h": "Heading", "p": "2 sentence description"},
    {"tab": "Tab label", "h": "Heading", "p": "2 sentence description"}
  ],
  "faqs": [
    {"q": "Question?", "a": "Answer."},
    {"q": "Question?", "a": "Answer."},
    {"q": "Question?", "a": "Answer."}
  ],
  "ctaText": "Primary CTA button text",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5"]
}`;

  const response = await callApi(prompt, 2000);
  const content = parseJson(response);

  const outputFile = `generated-campaign-${kw.replace(/\s+/g,'-').toLowerCase()}.json`;
  fs.writeFileSync(outputFile, JSON.stringify({ keyword: kw, merchant: merchant.id, content }, null, 2));
  console.log(`  ✓ Campaign content saved to: ${outputFile}`);
}

// ── ALL command
async function cmdAll() {
  console.log('\n🚀 Running all generators...\n');
  await cmdTopics(20);
  await cmdKeywords(50);
  console.log('\n✅ All generators complete.');
}

// ── Parse args and run
async function main() {
  const args = process.argv.slice(2);
  const cmd  = args[0] || 'status';
  const opts = {};
  args.slice(1).forEach(arg => {
    const [k, v] = arg.replace('--','').split('=');
    opts[k] = v || true;
  });

  if (!API_KEY && cmd !== 'status') {
    console.error('✗ ANTHROPIC_API_KEY not set. Export it first:\n  export ANTHROPIC_API_KEY=your_key');
    process.exit(1);
  }

  console.log(`\n🌍 GLOBALCAMPAIGNHUB GENERATOR — ${cmd.toUpperCase()}`);
  console.log(`Account: LinkConnector 007949 | Date: ${TODAY}`);

  try {
    switch(cmd) {
      case 'status':   cmdStatus(); break;
      case 'topics':   await cmdTopics(parseInt(opts.n) || 20); break;
      case 'keywords': await cmdKeywords(parseInt(opts.n) || 50); break;
      case 'blog':     await cmdBlog(opts.slug); break;
      case 'campaign': await cmdCampaign(opts.kw); break;
      case 'all':      await cmdAll(); break;
      default:
        console.log(`\nUnknown command: ${cmd}`);
        console.log('Available commands: status, topics, keywords, blog, campaign, all');
        console.log('\nExamples:');
        console.log('  node generate.js status');
        console.log('  node generate.js topics --n=20');
        console.log('  node generate.js keywords --n=50');
        console.log('  node generate.js blog --slug=nordvpn-review-2026');
        console.log('  node generate.js campaign --kw="best vpn 2026"');
        console.log('  node generate.js all');
    }
  } catch(err) {
    console.error('\n✗ Error:', err.message);
    process.exit(1);
  }
}

main();
