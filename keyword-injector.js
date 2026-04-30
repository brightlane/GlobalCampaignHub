#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB KEYWORD INJECTOR v1.0
//  Run: node keyword-injector.js
//
//  Reads targetedkeys.js, takes top keywords by volume,
//  injects them into blog meta tags, sitemap, and llms.txt
//  to keep the engine fed with fresh SEO signals.
//
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
// ═══════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const BASE     = 'https://brightlane.github.io/GlobalCampaignHub';
const TODAY    = new Date().toISOString().slice(0, 10);
const LOG_FILE = 'keyword-injector-log.json';

// ── How many top keywords to inject per run
const TOP_N = 10;

// ── Blog files to inject into
const BLOG_FILES = [
  { file: 'blog.html',       lang: 'en'    },
  { file: 'blog-zh.html',    lang: 'zh'    },
  { file: 'blog-zh-tw.html', lang: 'zh-tw' },
  { file: 'blog-es.html',    lang: 'es'    },
  { file: 'blog-fr.html',    lang: 'fr'    },
  { file: 'blog-de.html',    lang: 'de'    },
  { file: 'blog-pt.html',    lang: 'pt'    },
  { file: 'blog-pt-br.html', lang: 'pt-br' },
  { file: 'blog-ja.html',    lang: 'ja'    },
  { file: 'blog-ko.html',    lang: 'ko'    },
  { file: 'blog-it.html',    lang: 'it'    },
  { file: 'blog-nl.html',    lang: 'nl'    },
  { file: 'blog-pl.html',    lang: 'pl'    },
  { file: 'blog-hi.html',    lang: 'hi'    },
  { file: 'blog-ar.html',    lang: 'ar'    },
  { file: 'blog-ru.html',    lang: 'ru'    },
  { file: 'blog-tr.html',    lang: 'tr'    },
  { file: 'blog-id.html',    lang: 'id'    },
  { file: 'blog-vi.html',    lang: 'vi'    },
  { file: 'blog-th.html',    lang: 'th'    },
];

// ── Inline keyword data — top keywords by volume
//    Pulled from targetedkeys.js, sorted high → low
const KEYWORDS = [
  { keyword: 'halloween costumes 2026',            volume: 8800000, merchant: 'gh-halloweencostumes',   lc: '007949053344002874', cat: 'Lifestyle',  slug: 'halloween-costumes-guide-2026' },
  { keyword: 'adult halloween costumes',            volume: 3200000, merchant: 'gh-halloweencostumes',   lc: '007949053344002874', cat: 'Lifestyle',  slug: 'halloween-costumes-guide-2026' },
  { keyword: 'make money online surveys',           volume: 2400000, merchant: 'gh-surveyjunkie',        lc: '007949033344001882', cat: 'Lifestyle',  slug: 'surveyjunkie-earn-online-2026' },
  { keyword: 'file taxes online',                   volume: 2400000, merchant: 'gh-efile',               lc: '007949021469002241', cat: 'Tax',        slug: 'efile-vs-turbotax-2026' },
  { keyword: 'best vpn 2026',                       volume: 2100000, merchant: 'gh-nordvpn',             lc: '007949143344006843', cat: 'Software',   slug: 'nordvpn-review-2026' },
  { keyword: 'kids halloween costumes',             volume: 2100000, merchant: 'gh-halloweencostumes',   lc: '007949053344002874', cat: 'Lifestyle',  slug: 'halloween-kids-costume-guide-2026' },
  { keyword: 'online tax filing',                   volume: 1900000, merchant: 'gh-efile',               lc: '007949021469002241', cat: 'Tax',        slug: 'efile-vs-turbotax-2026' },
  { keyword: 'best video editor 2026',              volume: 1900000, merchant: 'gh-filmora',             lc: '007949165260004532', cat: 'Software',   slug: 'filmora-ai-features-2026' },
  { keyword: 'tax extension 2026',                  volume: 1800000, merchant: 'gh-taxextension',        lc: '007949033342002305', cat: 'Tax',        slug: 'tax-extension-deadline-guide-2026' },
  { keyword: 'nordvpn review',                      volume: 1800000, merchant: 'gh-nordvpn',             lc: '007949143344006843', cat: 'Software',   slug: 'nordvpn-review-2026' },
  { keyword: 'survey junkie review',                volume: 1800000, merchant: 'gh-surveyjunkie',        lc: '007949033344001882', cat: 'Lifestyle',  slug: 'surveyjunkie-earn-online-2026' },
  { keyword: 'royalty free music youtube',          volume: 1800000, merchant: 'gh-bgmgirl',             lc: '007949153344007992', cat: 'Lifestyle',  slug: 'bgmgirl-creator-music-2026' },
  { keyword: 'group halloween costumes',            volume: 1800000, merchant: 'gh-halloweencostumes',   lc: '007949053344002874', cat: 'Lifestyle',  slug: 'halloween-group-costumes-2026' },
  { keyword: 'free tax filing online',              volume: 1600000, merchant: 'gh-efile',               lc: '007949021469002241', cat: 'Tax',        slug: 'efile-vs-turbotax-2026' },
  { keyword: 'recover deleted photos iphone',       volume: 1600000, merchant: 'gh-tenorshare',          lc: '007949163344008992', cat: 'Software',   slug: 'tenorshare-iphone-tools-2026' },
  { keyword: 'no code app builder',                 volume: 1400000, merchant: 'gh-appypie',             lc: '007949153344007442', cat: 'Software',   slug: 'appy-pie-no-code-tools-2026' },
  { keyword: 'online cpr certification',            volume: 1400000, merchant: 'gh-learntasticcpr',      lc: '007949143344006112', cat: 'Education',  slug: 'learnstastic-cpr-certification-2026' },
  { keyword: 'custom banners online',               volume: 1400000, merchant: 'gh-buildasign',          lc: '007949043344001995', cat: 'Print',      slug: 'buildasign-custom-prints-2026' },
  { keyword: 'couples halloween costumes',          volume: 1400000, merchant: 'gh-halloweencostumes',   lc: '007949053344002874', cat: 'Lifestyle',  slug: 'halloween-couples-costumes-2026' },
  { keyword: 'copyright free music for videos',    volume: 1400000, merchant: 'gh-bgmgirl',             lc: '007949153344007992', cat: 'Lifestyle',  slug: 'bgmgirl-creator-music-2026' },
  { keyword: 'adobe acrobat alternative',           volume: 1300000, merchant: 'gh-pdfelement',          lc: '007949165372004532', cat: 'Software',   slug: 'pdfelement-vs-acrobat-2026' },
  { keyword: 'photo to canvas print',               volume: 1200000, merchant: 'gh-easycanvasprints',    lc: '007949063344003112', cat: 'Print',      slug: 'easy-canvas-prints-guide-2026' },
  { keyword: 'spotify to mp3 converter',            volume: 1200000, merchant: 'gh-sidify',              lc: '007949163344007882', cat: 'Software',   slug: 'sidify-spotify-converter-2026' },
  { keyword: 'iphone data recovery',                volume: 1200000, merchant: 'gh-tenorshare',          lc: '007949163344008992', cat: 'Software',   slug: 'tenorshare-iphone-tools-2026' },
  { keyword: 'vpn for streaming',                   volume: 1200000, merchant: 'gh-nordvpn',             lc: '007949143344006843', cat: 'Software',   slug: 'nordvpn-streaming-guide-2026' },
  { keyword: 'order blood test without doctor',     volume: 1200000, merchant: 'gh-personalabs',         lc: '007949133344005442', cat: 'Health',     slug: 'personalabs-lab-tests-2026' },
  { keyword: 'buy guns online marketplace',         volume: 1200000, merchant: 'gh-gunsinternational',   lc: '007949093344004221', cat: 'Lifestyle',  slug: 'gunsinternational-marketplace-2026' },
  { keyword: 'gourmet food gift baskets',           volume: 1200000, merchant: 'gh-tastyribbon',         lc: '007949153344007881', cat: 'Lifestyle',  slug: 'tasty-ribbon-food-gifts-2026' },
  { keyword: 'paid surveys legit',                  volume: 1200000, merchant: 'gh-surveyjunkie',        lc: '007949033344001882', cat: 'Lifestyle',  slug: 'surveyjunkie-earn-online-2026' },
  { keyword: 'free federal tax return online',      volume: 1200000, merchant: 'gh-eztaxreturn',         lc: '007949053344004952', cat: 'Tax',        slug: 'eztaxreturn-review-2026' },
  { keyword: 'custom engraved gifts',               volume: 1100000, merchant: 'gh-etchingexpressions',  lc: '007949083344004332', cat: 'Print',      slug: 'etching-expressions-gifts-2026' },
  { keyword: 'stock photos cheap',                  volume: 1100000, merchant: 'gh-depositphotos',       lc: '007949063344003921', cat: 'Software',   slug: 'depositphotos-review-2026' },
  { keyword: 'cheap pet medications online',        volume: 980000,  merchant: 'gh-budgetpetcare',       lc: '007949103344005118', cat: 'Pet Care',   slug: 'budget-pet-care-guide-2026' },
  { keyword: 'cpr certification online fast',       volume: 980000,  merchant: 'gh-learntasticcpr',      lc: '007949143344006112', cat: 'Education',  slug: 'learnstastic-cpr-certification-2026' },
  { keyword: 'pmp certification 2026',              volume: 980000,  merchant: 'gh-pmtraining',          lc: '007949143344006992', cat: 'Education',  slug: 'pm-training-pmp-2026' },
  { keyword: 'ashwagandha supplement review',       volume: 980000,  merchant: 'gh-ayurvedaexperience',  lc: '007949163344008221', cat: 'Health',     slug: 'ayurveda-experience-review-2026' },
  { keyword: 'halloween costumes cheap',            volume: 980000,  merchant: 'gh-halloweencostumes',   lc: '007949053344002874', cat: 'Lifestyle',  slug: 'halloween-costumes-guide-2026' },
  { keyword: 'luxury car service nyc',              volume: 980000,  merchant: 'gh-carmellimo',          lc: '007949053344002881', cat: 'Lifestyle',  slug: 'carmel-limo-service-2026' },
  { keyword: 'build app without coding',            volume: 980000,  merchant: 'gh-appypie',             lc: '007949153344007442', cat: 'Software',   slug: 'appy-pie-no-code-tools-2026' },
  { keyword: 'best pdf editor 2026',                volume: 980000,  merchant: 'gh-pdfelement',          lc: '007949165372004532', cat: 'Software',   slug: 'pdfelement-vs-acrobat-2026' },
  { keyword: 'visio alternative',                   volume: 980000,  merchant: 'gh-edraw',               lc: '007949165246006886', cat: 'Software',   slug: 'edraw-mind-map-review-2026' },
  { keyword: 'custom yard signs',                   volume: 980000,  merchant: 'gh-buildasign',          lc: '007949043344001995', cat: 'Print',      slug: 'buildasign-custom-prints-2026' },
  { keyword: 'cheapest vinyl banners online',       volume: 980000,  merchant: 'gh-bannersonthecheap',   lc: '007949073344003661', cat: 'Print',      slug: 'banners-on-the-cheap-guide-2026' },
  { keyword: 'cheapest canvas prints online',       volume: 980000,  merchant: 'gh-canvasonthecheap',    lc: '007949073344003662', cat: 'Print',      slug: 'canvas-on-the-cheap-guide-2026' },
  { keyword: 'file taxes free online',              volume: 980000,  merchant: 'gh-eztaxreturn',         lc: '007949053344004952', cat: 'Tax',        slug: 'eztaxreturn-review-2026' },
  { keyword: 'best cpa exam prep 2026',             volume: 880000,  merchant: 'gh-surgent',             lc: '007949123344006122', cat: 'Education',  slug: 'surgent-cpa-exam-prep-2026' },
  { keyword: 'best online pet pharmacy',            volume: 880000,  merchant: 'gh-bestvetcare',         lc: '007949093344004992', cat: 'Pet Care',   slug: 'bestvetcare-review-2026' },
  { keyword: 'discount pet medications',            volume: 880000,  merchant: 'gh-discountpetcare',     lc: '007949123344005441', cat: 'Pet Care',   slug: 'discountpetcare-review-2026' },
  { keyword: 'nexgard canada online',               volume: 880000,  merchant: 'gh-canadapetcare',       lc: '007949083344004721', cat: 'Pet Care',   slug: 'canada-pet-care-vs-vet-2026' },
  { keyword: 'direct to consumer lab testing',      volume: 880000,  merchant: 'gh-personalabs',         lc: '007949133344005442', cat: 'Health',     slug: 'personalabs-lab-tests-2026' },
  { keyword: 'budget coilovers review',             volume: 880000,  merchant: 'gh-maxpeedingrodsus',    lc: '007949133344006421', cat: 'Auto',       slug: 'maxpeedingrods-review-2026' },
  { keyword: 'soundproofing materials cheap',       volume: 880000,  merchant: 'gh-trademarksoundproofing', lc: '007949133344006118', cat: 'Hardware', slug: 'soundproofing-guide-2026' },
  { keyword: 'hardware store online',               volume: 880000,  merchant: 'gh-trademarkhardware',   lc: '007949123344005912', cat: 'Hardware',  slug: 'trademark-hardware-guide-2026' },
  { keyword: 'first aid kit custom',                volume: 880000,  merchant: 'gh-fieldtex',            lc: '007949123344005118', cat: 'Hardware',  slug: 'fieldtex-first-aid-2026' },
  { keyword: 'series 7 exam prep',                  volume: 880000,  merchant: 'gh-securitiesinstitute', lc: '007949113344005987', cat: 'Education',  slug: 'securities-institute-exam-prep-2026' },
  { keyword: 'twitch music dmca safe',              volume: 880000,  merchant: 'gh-bgmgirl',             lc: '007949153344007992', cat: 'Lifestyle',  slug: 'bgmgirl-creator-music-2026' },
  { keyword: 'best chess set online',               volume: 880000,  merchant: 'gh-thechessstore',       lc: '007949103344005112', cat: 'Lifestyle',  slug: 'chess-store-buying-guide-2026' },
  { keyword: 'corporate food gifts',                volume: 880000,  merchant: 'gh-tastyribbon',         lc: '007949153344007881', cat: 'Lifestyle',  slug: 'tasty-ribbon-food-gifts-2026' },
  { keyword: 'best ice cream shipped nationwide',   volume: 880000,  merchant: 'gh-graeters',            lc: '007949073344004112', cat: 'Lifestyle',  slug: 'graeter-ice-cream-delivery-2026' },
  { keyword: 'premium mens casual shirts',          volume: 880000,  merchant: 'gh-bugatchi',            lc: '007949153344007662', cat: 'Lifestyle',  slug: 'bugatchi-mens-fashion-2026' },
  { keyword: 'tactical knives online',              volume: 880000,  merchant: 'gh-vipertec',            lc: '007949133344006224', cat: 'Lifestyle',  slug: 'vipertec-tactical-knives-2026' },
  { keyword: 'airport limo service',                volume: 880000,  merchant: 'gh-carmellimo',          lc: '007949053344002881', cat: 'Lifestyle',  slug: 'carmel-limo-service-2026' },
  { keyword: 'survey junkie earnings',              volume: 880000,  merchant: 'gh-surveyjunkie',        lc: '007949033344001882', cat: 'Lifestyle',  slug: 'surveyjunkie-earn-online-2026' },
  { keyword: 'golf accessories online',             volume: 880000,  merchant: 'gh-readygolf',           lc: '007949103344004551', cat: 'Lifestyle',  slug: 'readygolf-guide-2026' },
  { keyword: 'best organic coffee subscription',    volume: 880000,  merchant: 'gh-camanoislandcoffee',  lc: '007949053344002441', cat: 'Lifestyle',  slug: 'camano-island-coffee-review-2026' },
  { keyword: 'historical swords online',            volume: 880000,  merchant: 'gh-museumreplicas',      lc: '007949113344005442', cat: 'Lifestyle',  slug: 'museum-replicas-collectibles-2026' },
  { keyword: 'online firearms listings',            volume: 880000,  merchant: 'gh-gunsinternational',   lc: '007949093344004221', cat: 'Lifestyle',  slug: 'gunsinternational-marketplace-2026' },
  { keyword: 'canvas print gift',                   volume: 880000,  merchant: 'gh-easycanvasprints',    lc: '007949063344003112', cat: 'Print',      slug: 'easy-canvas-prints-guide-2026' },
  { keyword: 'laser engraving gifts',               volume: 880000,  merchant: 'gh-etchingexpressions',  lc: '007949083344004332', cat: 'Print',      slug: 'etching-expressions-gifts-2026' },
  { keyword: 'screen printing equipment beginners', volume: 880000,  merchant: 'gh-ryonet',              lc: '007949084633004512', cat: 'Print',      slug: 'ryonet-screen-printing-2026' },
  { keyword: 'efile taxes',                         volume: 880000,  merchant: 'gh-efile',               lc: '007949021469002241', cat: 'Tax',        slug: 'efile-vs-turbotax-2026' },
  { keyword: 'online tax preparation service',      volume: 880000,  merchant: 'gh-etax',                lc: '007949113645003507', cat: 'Tax',        slug: 'etax-llc-tax-filing-2026' },
];

// Sort by volume descending
KEYWORDS.sort((a, b) => b.volume - a.volume);

function buildAffUrl(kw, pos) {
  return `https://www.linkconnector.com/ta.php?lc=${kw.lc}&atid=${kw.merchant}&utm_source=gh-keyword-injector&utm_medium=affiliate&utm_campaign=${kw.slug}&utm_content=kw-pos-${pos}`;
}

function buildBlogUrl(kw) {
  return `${BASE}/blog.html?p=${kw.slug}__${TODAY}`;
}

function injectIntoFile(filePath, topKeywords) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Update meta keywords tag
  const kwString = topKeywords.map(k => k.keyword).join(', ');
  html = html.replace(
    /<meta name="keywords"[^>]*content="[^"]*"[^>]*>/,
    `<meta name="keywords" id="meta-keywords" content="${kwString}"/>`
  );

  // 2. Inject keyword data object into the page script
  const kwDataStr = topKeywords.map((kw, i) => `
    { keyword: ${JSON.stringify(kw.keyword)}, volume: ${kw.volume}, merchant: ${JSON.stringify(kw.merchant)}, affUrl: ${JSON.stringify(buildAffUrl(kw, i+1))}, blogUrl: ${JSON.stringify(buildBlogUrl(kw))}, cat: ${JSON.stringify(kw.cat)} }`
  ).join(',');

  const injectionMarker = '// ── KEYWORD_INJECTOR_DATA ──';
  const injectionBlock = `${injectionMarker}\n  const GH_TOP_KEYWORDS = [${kwDataStr}\n  ];\n  const GH_KW_UPDATED = '${TODAY}';`;

  if (html.includes(injectionMarker)) {
    // Replace existing injection
    html = html.replace(
      /\/\/ ── KEYWORD_INJECTOR_DATA ──[\s\S]*?const GH_KW_UPDATED = '[^']*';/,
      injectionBlock
    );
  } else {
    // Insert before closing script tag or before </body>
    const insertBefore = html.lastIndexOf('</script>');
    if (insertBefore !== -1) {
      html = html.slice(0, insertBefore) + '\n  ' + injectionBlock + '\n' + html.slice(insertBefore);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function updateLlmsKeywords(topKeywords) {
  if (!fs.existsSync('llms.txt')) return;
  let content = fs.readFileSync('llms.txt', 'utf8');

  const kwSection = `## Top Keywords\n\n${topKeywords.map(k => `- ${k.keyword} (${(k.volume/1000000).toFixed(1)}M/mo) — ${k.cat}`).join('\n')}`;
  const marker = '## Top Keywords';

  if (content.includes(marker)) {
    content = content.replace(/## Top Keywords[\s\S]*?(?=\n## |\n# |$)/, kwSection + '\n');
  } else {
    content += '\n\n' + kwSection + '\n';
  }

  fs.writeFileSync('llms.txt', content, 'utf8');
  console.log('  ✓ llms.txt updated with top keywords');
}

function logRun(topKeywords, results) {
  let log = [];
  if (fs.existsSync(LOG_FILE)) {
    try { log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch(e) {}
  }
  log.push({
    date: TODAY,
    top_keywords: topKeywords.map(k => k.keyword),
    top_volume: topKeywords[0]?.volume,
    files_updated: results.filter(r => r.ok).length,
    files_skipped: results.filter(r => !r.ok).length
  });
  // Keep last 30 runs
  if (log.length > 30) log = log.slice(-30);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
}

function main() {
  console.log('\n🔑 GLOBALCAMPAIGNHUB KEYWORD INJECTOR v1.0');
  console.log('════════════════════════════════════════════');
  console.log(`Account: LinkConnector 007949 | Date: ${TODAY}\n`);

  // Get top N keywords by volume
  const topKeywords = KEYWORDS.slice(0, TOP_N);

  console.log(`Top ${TOP_N} keywords to inject:`);
  topKeywords.forEach((kw, i) => {
    console.log(`  ${i+1}. "${kw.keyword}" — ${(kw.volume/1000000).toFixed(1)}M/mo (${kw.merchant})`);
  });
  console.log('');

  const results = [];

  // Inject into all blog files
  console.log('Injecting into blog files...');
  for (const lang of BLOG_FILES) {
    const ok = injectIntoFile(lang.file, topKeywords);
    results.push({ file: lang.file, ok });
    if (ok) {
      console.log(`  ✓ ${lang.file}`);
    } else {
      console.log(`  ⚠ ${lang.file} not found — skipping`);
    }
  }

  // Inject into inventory and index
  ['inventory.html', 'index.html'].forEach(f => {
    const ok = injectIntoFile(f, topKeywords);
    results.push({ file: f, ok });
    if (ok) console.log(`  ✓ ${f}`);
  });

  // Update llms.txt
  console.log('\nUpdating llms.txt...');
  updateLlmsKeywords(topKeywords);

  // Log the run
  logRun(topKeywords, results);

  const updated = results.filter(r => r.ok).length;
  console.log(`\n✅ Done! ${updated} files updated with top ${TOP_N} keywords`);
  console.log(`Top keyword: "${topKeywords[0].keyword}" — ${topKeywords[0].volume.toLocaleString()} monthly searches`);
  console.log('════════════════════════════════════════════\n');
}

main();
