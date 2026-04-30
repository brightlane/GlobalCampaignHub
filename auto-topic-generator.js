#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB AUTO-TOPIC-GENERATOR v1.0
//  Run: node auto-topic-generator.js
//
//  Reads post-topics.json, checks pending count.
//  If below MIN_QUEUE, calls Claude API to generate 20 new topics.
//  Account: LinkConnector 007949 — gh- prefix on all merchant IDs
// ═══════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const https = require('https');

const TOPICS_FILE = 'post-topics.json';
const MIN_QUEUE   = 20;
const BATCH_SIZE  = 20;
const MODEL       = 'claude-sonnet-4-20250514';
const API_KEY     = process.env.ANTHROPIC_API_KEY;

// All 68 merchants with gh- prefix — Account 007949
const MERCHANTS = [
  { id: 'gh-efile',               name: 'E-file.com',                  category: 'Tax' },
  { id: 'gh-etax',                name: 'E TAX LLC',                   category: 'Tax' },
  { id: 'gh-taxextension',        name: 'TaxExtension.com',            category: 'Tax' },
  { id: 'gh-eztaxreturn',         name: 'ezTaxReturn.com',             category: 'Tax' },
  { id: 'gh-boardvitals',         name: 'BoardVitals',                 category: 'Education' },
  { id: 'gh-ryonet',              name: 'Ryonet',                      category: 'Print & Signs' },
  { id: 'gh-surgent',             name: 'Surgent.com',                 category: 'Education' },
  { id: 'gh-hrcp',                name: 'HRCP',                        category: 'Education' },
  { id: 'gh-oakstone',            name: 'Oakstone Medical',            category: 'Education' },
  { id: 'gh-securitiesinstitute', name: 'The Securities Institute',    category: 'Education' },
  { id: 'gh-nordvpn',             name: 'NordVPN',                     category: 'Software' },
  { id: 'gh-depositphotos',       name: 'Depositphotos',               category: 'Software' },
  { id: 'gh-halloweencostumes',   name: 'HalloweenCostumes.com',       category: 'Lifestyle' },
  { id: 'gh-filmora',             name: 'Wondershare Filmora',         category: 'Software' },
  { id: 'gh-pdfelement',          name: 'Wondershare PDFelement',      category: 'Software' },
  { id: 'gh-edraw',               name: 'Edraw (Mind/Max)',            category: 'Software' },
  { id: 'gh-canadapetcare',       name: 'CanadaPetCare.com',           category: 'Pet Care' },
  { id: 'gh-bestvetcare',         name: 'BestVetCare.com',             category: 'Pet Care' },
  { id: 'gh-budgetpetcare',       name: 'BudgetPetCare.com',           category: 'Pet Care' },
  { id: 'gh-budgetpetworld',      name: 'BudgetPetWorld.com',          category: 'Pet Care' },
  { id: 'gh-discountpetcare',     name: 'DiscountPetCare',             category: 'Pet Care' },
  { id: 'gh-nursejamie',          name: 'Nurse Jamie',                 category: 'Health' },
  { id: 'gh-maxpeedingrodsus',    name: 'Maxpeedingrods (US)',         category: 'Auto' },
  { id: 'gh-maxpeedingrodsau',    name: 'Maxpeedingrods (AU)',         category: 'Auto' },
  { id: 'gh-trademarkhardware',   name: 'Trademark Hardware',          category: 'Hardware' },
  { id: 'gh-trademarksoundproofing', name: 'Trademark Soundproofing',  category: 'Hardware' },
  { id: 'gh-warehouse115',        name: 'Warehouse 115',               category: 'Hardware' },
  { id: 'gh-graeters',            name: "Graeter's Ice Cream",         category: 'Lifestyle' },
  { id: 'gh-etchingexpressions',  name: 'Etching Expressions',         category: 'Lifestyle' },
  { id: 'gh-thechessstore',       name: 'The Chess Store',             category: 'Lifestyle' },
  { id: 'gh-museumreplicas',      name: 'MuseumReplicas.com',          category: 'Lifestyle' },
  { id: 'gh-atlantacutlery',      name: 'Atlanta Cutlery Corp.',       category: 'Lifestyle' },
  { id: 'gh-vipertec',            name: 'Viper Tec Inc.',              category: 'Lifestyle' },
  { id: 'gh-combatflipflops',     name: 'Combat Flip Flops',           category: 'Lifestyle' },
  { id: 'gh-camanoislandcoffee',  name: 'Camano Island Coffee',        category: 'Lifestyle' },
  { id: 'gh-sidify',              name: 'Sidify Inc.',                 category: 'Software' },
  { id: 'gh-movavi',              name: 'Movavi Software',             category: 'Software' },
  { id: 'gh-jalbum',              name: 'jAlbum AB',                   category: 'Software' },
  { id: 'gh-updf',                name: 'UPDF (Superace)',             category: 'Software' },
  { id: 'gh-itoolab',             name: 'iToolab (LuckyDog)',          category: 'Software' },
  { id: 'gh-tenorshare',          name: 'Tenorshare',                  category: 'Software' },
  { id: 'gh-appypie',             name: 'Appy Pie (Snappy)',           category: 'Software' },
  { id: 'gh-illumeo',             name: 'Illumeo Inc.',                category: 'Education' },
  { id: 'gh-wolterskluwer',       name: 'Wolters Kluwer (LWW)',        category: 'Education' },
  { id: 'gh-individualsoftware',  name: 'Individual Software',         category: 'Software' },
  { id: 'gh-learntasticcpr',      name: 'LearnTastic (CPR)',           category: 'Education' },
  { id: 'gh-learntasticahca',     name: 'LearnTastic (AHCA)',          category: 'Education' },
  { id: 'gh-personalabs',         name: 'Personalabs',                 category: 'Health' },
  { id: 'gh-fieldtex',            name: 'Fieldtex Products',           category: 'Hardware' },
  { id: 'gh-productsonthego',     name: 'Products On The Go',          category: 'Hardware' },
  { id: 'gh-readygolf',           name: 'ReadyGolf',                   category: 'Lifestyle' },
  { id: 'gh-gunsinternational',   name: 'GunsInternational',           category: 'Lifestyle' },
  { id: 'gh-lafuente',            name: 'La Fuente Imports',           category: 'Lifestyle' },
  { id: 'gh-bannersonthecheap',   name: 'BannersOnTheCheap',          category: 'Print & Signs' },
  { id: 'gh-canvasonthecheap',    name: 'CanvasOnTheCheap',           category: 'Print & Signs' },
  { id: 'gh-easycanvasprints',    name: 'Easy Canvas Prints',          category: 'Print & Signs' },
  { id: 'gh-carmellimo',          name: 'Carmel Car & Limo',           category: 'Lifestyle' },
  { id: 'gh-youware',             name: 'YouWare (Arco Al HK)',        category: 'Software' },
  { id: 'gh-bugatchi',            name: 'Bugatchi',                    category: 'Lifestyle' },
  { id: 'gh-pmtraining',          name: 'SSI Logic (PMTraining)',      category: 'Education' },
  { id: 'gh-surveyjunkie',        name: 'Survey Junkie',               category: 'Lifestyle' },
  { id: 'gh-tastyribbon',         name: 'Tasty Ribbon',                category: 'Lifestyle' },
  { id: 'gh-ayurvedaexperience',  name: 'The Ayurveda Experience',     category: 'Health' },
  { id: 'gh-bgmgirl',             name: 'BGM Girl (RSE)',              category: 'Services' },
  { id: 'gh-renoise',             name: 'Renoise',                     category: 'Software' },
  { id: 'gh-picador',             name: 'Picador Multimedia',          category: 'Software' },
  { id: 'gh-incentrev',           name: 'Incentrev',                   category: 'Services' },
  { id: 'gh-buildasign',          name: 'BuildASign',                  category: 'Print & Signs' },
];

function callApi(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
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
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content && parsed.content[0]) {
            resolve(parsed.content[0].text);
          } else {
            reject(new Error('No content in response: ' + data));
          }
        } catch (e) {
          reject(new Error('Parse error: ' + e.message + ' | ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function generateTopics(existingSlugs, pendingCount) {
  // Pick merchants that need more coverage
  const topicsData = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  const merchantCounts = {};
  MERCHANTS.forEach(m => merchantCounts[m.id] = 0);
  topicsData.topics.forEach(t => {
    if (merchantCounts[t.merchant] !== undefined) merchantCounts[t.merchant]++;
  });

  // Sort by least covered, shuffle within groups
  const sorted = [...MERCHANTS].sort((a, b) => merchantCounts[a.id] - merchantCounts[b.id]);
  const targets = sorted.slice(0, BATCH_SIZE);

  const merchantList = targets.map(m =>
    `- merchant: "${m.id}" | name: "${m.name}" | category: "${m.category}"`
  ).join('\n');

  const existingList = existingSlugs.slice(-30).join(', ');

  const prompt = `You are generating blog post topics for GlobalCampaignHub, an affiliate marketing site with 68 verified merchants through LinkConnector (account 007949).

Generate exactly ${BATCH_SIZE} blog post topics. Each topic must be for ONE of these merchants:
${merchantList}

RULES:
- Each topic must be a genuine buyer guide, review, comparison, or how-to
- Topics must target real search intent with commercial value
- Slugs must be unique — do NOT use any of these existing slugs: ${existingList}
- Write compelling, SEO-optimized English content only
- Each post needs full content for ALL these fields

Return ONLY a valid JSON array. No markdown, no explanation, no code fences. Just the raw JSON array.

Format each topic exactly like this:
[
  {
    "slug": "unique-kebab-case-slug-2026",
    "merchant": "gh-merchantid",
    "published": false,
    "title_en": "Full SEO Title Here",
    "category_en": "Category Name",
    "metaDesc_en": "155 char meta description with keyword",
    "keywords_en": "keyword1,keyword2,keyword3,keyword4,keyword5",
    "intro_en": "2-3 sentence engaging introduction paragraph",
    "callout_en": "One powerful insight or tip that makes readers lean in",
    "h2a_en": "First H2 Section Heading",
    "body1_en": "2-3 sentence body paragraph for first section",
    "bullets_en": ["Feature or benefit 1", "Feature or benefit 2", "Feature or benefit 3", "Feature or benefit 4", "Feature or benefit 5", "Feature or benefit 6"],
    "verdict_title_en": "Merchant Name — Short Verdict",
    "verdict_desc_en": "2-3 sentence verdict description",
    "h2b_en": "Second H2 Section Heading",
    "body2_en": "2-3 sentence body paragraph for second section",
    "cta_en": "Call to Action Button Text",
    "cta2_en": "Secondary Call to Action Text",
    "faqs_en": [
      {"q": "Question one?", "a": "Answer one."},
      {"q": "Question two?", "a": "Answer two."},
      {"q": "Question three?", "a": "Answer three."}
    ]
  }
]

Generate all ${BATCH_SIZE} topics now:`;

  console.log(`\nCalling Claude API to generate ${BATCH_SIZE} topics...`);
  const response = await callApi(prompt);

  // Parse JSON response
  let topics;
  try {
    // Strip any accidental markdown fences
    const clean = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    topics = JSON.parse(clean);
  } catch (e) {
    // Try to extract JSON array
    const match = response.match(/\[[\s\S]*\]/);
    if (match) {
      topics = JSON.parse(match[0]);
    } else {
      throw new Error('Could not parse API response as JSON: ' + e.message);
    }
  }

  if (!Array.isArray(topics)) throw new Error('Response is not an array');

  // Validate and clean each topic
  return topics.filter(t => {
    if (!t.slug || !t.merchant || !t.title_en) {
      console.warn(`  ⚠ Skipping invalid topic: ${JSON.stringify(t).slice(0, 60)}`);
      return false;
    }
    if (existingSlugs.includes(t.slug)) {
      console.warn(`  ⚠ Skipping duplicate slug: ${t.slug}`);
      return false;
    }
    // Ensure published is false
    t.published = false;
    return true;
  });
}

async function main() {
  console.log('\n🌍 GLOBALCAMPAIGNHUB AUTO-TOPIC-GENERATOR v1.0');
  console.log('════════════════════════════════════════════════');
  console.log('Account: LinkConnector 007949 | Tracking: gh- prefix\n');

  if (!API_KEY) {
    console.log('⚠ ANTHROPIC_API_KEY not set — skipping topic generation');
    process.exit(0);
  }

  if (!fs.existsSync(TOPICS_FILE)) {
    console.error(`✗ ${TOPICS_FILE} not found`);
    process.exit(1);
  }

  const topicsData = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  const pending = topicsData.topics.filter(t => !t.published);

  console.log(`Topics in queue: ${pending.length} pending / ${topicsData.topics.length} total`);

  if (pending.length >= MIN_QUEUE) {
    console.log(`✓ Queue healthy (${pending.length} >= ${MIN_QUEUE}) — no generation needed`);
    process.exit(0);
  }

  console.log(`⚡ Queue low (${pending.length} < ${MIN_QUEUE}) — generating ${BATCH_SIZE} new topics`);

  const existingSlugs = topicsData.topics.map(t => t.slug);

  try {
    const newTopics = await generateTopics(existingSlugs, pending.length);
    console.log(`✓ Generated ${newTopics.length} valid topics`);

    topicsData.topics.push(...newTopics);
    topicsData.meta.total = topicsData.topics.length;
    topicsData.meta.last_updated = new Date().toISOString().slice(0, 10);

    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topicsData, null, 2), 'utf8');

    const newPending = topicsData.topics.filter(t => !t.published).length;
    console.log(`✅ post-topics.json updated — ${newPending} topics now in queue`);
    console.log('════════════════════════════════════════════════\n');
  } catch (err) {
    console.error('✗ Topic generation failed:', err.message);
    process.exit(1);
  }
}

main();
