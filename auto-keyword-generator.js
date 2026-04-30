#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB AUTO-KEYWORD-GENERATOR v2.0
//  NO API KEY REQUIRED — generates from built-in data
//  Run: node auto-keyword-generator.js
//
//  Generates 50 new keyword variations per run across 20 languages
//  by combining templates, merchants, and modifiers.
//  Appends to targetedkeys.js sorted high → low volume.
//
//  50 keywords × 144 runs/day = 7,200/day → 2.6M/year
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
// ═══════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const KEYWORDS_FILE = 'targetedkeys.js';
const LOG_FILE      = 'keyword-generator-log.json';
const BATCH_SIZE    = 50;
const TODAY         = new Date().toISOString().slice(0, 10);
const YEAR          = new Date().getFullYear();
const BASE          = 'https://brightlane.github.io/GlobalCampaignHub';

// ── All 68 merchants
const MERCHANTS = [
  { id:'gh-efile',               name:'E-file.com',              cat:'Tax',       lc:'007949021469002241', slug:'efile-vs-turbotax-2026',                 keys:['tax filing','efile','federal tax','irs filing','online taxes'] },
  { id:'gh-etax',                name:'E TAX LLC',               cat:'Tax',       lc:'007949113645003507', slug:'etax-llc-tax-filing-2026',               keys:['tax preparation','self employed tax','small business tax','tax help'] },
  { id:'gh-taxextension',        name:'TaxExtension.com',        cat:'Tax',       lc:'007949033342002305', slug:'tax-extension-deadline-guide-2026',       keys:['tax extension','form 4868','irs extension','tax deadline'] },
  { id:'gh-eztaxreturn',         name:'ezTaxReturn.com',         cat:'Tax',       lc:'007949053344004952', slug:'eztaxreturn-review-2026',                 keys:['free tax return','free irs filing','tax return online','w2 filing'] },
  { id:'gh-nordvpn',             name:'NordVPN',                 cat:'Software',  lc:'007949143344006843', slug:'nordvpn-review-2026',                     keys:['vpn','nordvpn','virtual private network','vpn service','online privacy'] },
  { id:'gh-depositphotos',       name:'Depositphotos',           cat:'Software',  lc:'007949063344003921', slug:'depositphotos-review-2026',               keys:['stock photos','stock images','royalty free photos','depositphotos'] },
  { id:'gh-filmora',             name:'Wondershare Filmora',     cat:'Software',  lc:'007949165260004532', slug:'filmora-ai-features-2026',                keys:['video editor','filmora','ai video editing','video editing software'] },
  { id:'gh-pdfelement',          name:'Wondershare PDFelement',  cat:'Software',  lc:'007949165372004532', slug:'pdfelement-vs-acrobat-2026',              keys:['pdf editor','pdfelement','acrobat alternative','edit pdf'] },
  { id:'gh-edraw',               name:'Edraw Mind/Max',          cat:'Software',  lc:'007949165246006886', slug:'edraw-mind-map-review-2026',              keys:['visio alternative','mind map','diagram software','flowchart'] },
  { id:'gh-sidify',              name:'Sidify',                  cat:'Software',  lc:'007949163344007882', slug:'sidify-spotify-converter-2026',           keys:['spotify converter','spotify to mp3','music converter','drm removal'] },
  { id:'gh-movavi',              name:'Movavi Software',         cat:'Software',  lc:'007949153344007119', slug:'movavi-video-editor-2026',                keys:['movavi','video editor one time','no subscription video editor'] },
  { id:'gh-jalbum',              name:'jAlbum',                  cat:'Software',  lc:'007949143344006442', slug:'jalbum-photo-gallery-2026',               keys:['photo gallery','jalbum','photo website','gallery builder'] },
  { id:'gh-updf',                name:'UPDF',                    cat:'Software',  lc:'007949163344008112', slug:'updf-pdf-editor-review-2026',             keys:['ai pdf','updf','pdf ai editor','pdf summarizer'] },
  { id:'gh-itoolab',             name:'iToolab',                 cat:'Software',  lc:'007949163344008441', slug:'itoolab-iphone-manager-2026',             keys:['iphone unlock','itoolab','iphone tools','ios unlock'] },
  { id:'gh-tenorshare',          name:'Tenorshare',              cat:'Software',  lc:'007949163344008992', slug:'tenorshare-iphone-tools-2026',            keys:['iphone recovery','tenorshare','reiboot','iphone data recovery'] },
  { id:'gh-appypie',             name:'Appy Pie',                cat:'Software',  lc:'007949153344007442', slug:'appy-pie-no-code-tools-2026',             keys:['no code app','app builder','no code website','chatbot builder'] },
  { id:'gh-individualsoftware',  name:'Individual Software',     cat:'Software',  lc:'007949133344005882', slug:'individual-software-review-2026',         keys:['typing software','educational software','learn to type'] },
  { id:'gh-youware',             name:'YouWare',                 cat:'Software',  lc:'007949163344008118', slug:'youware-review-2026',                     keys:['youware','productivity software','content creation tool'] },
  { id:'gh-renoise',             name:'Renoise',                 cat:'Software',  lc:'007949143344006551', slug:'renoise-music-production-2026',           keys:['renoise','tracker daw','electronic music daw','music production'] },
  { id:'gh-picador',             name:'Picador Multimedia',      cat:'Software',  lc:'007949133344006228', slug:'picador-multimedia-review-2026',          keys:['multimedia software','picador','video audio software'] },
  { id:'gh-boardvitals',         name:'BoardVitals',             cat:'Education', lc:'007949114675005824', slug:'boardvitals-medical-exam-prep-2026',      keys:['usmle','nclex','medical board exam','board exam prep','question bank'] },
  { id:'gh-surgent',             name:'Surgent CPA',             cat:'Education', lc:'007949123344006122', slug:'surgent-cpa-exam-prep-2026',              keys:['cpa exam','cpa review','surgent','cpa prep','accounting exam'] },
  { id:'gh-hrcp',                name:'HRCP',                    cat:'Education', lc:'007949093344005114', slug:'hrcp-hr-certification-2026',              keys:['phr certification','sphr exam','hr certification','hrcp','hrci exam'] },
  { id:'gh-oakstone',            name:'Oakstone Medical',        cat:'Education', lc:'007949103344005432', slug:'oakstone-cme-review-2026',                keys:['cme credits','physician cme','medical education','oakstone','accme'] },
  { id:'gh-securitiesinstitute', name:'Securities Institute',    cat:'Education', lc:'007949113344005987', slug:'securities-institute-exam-prep-2026',    keys:['series 7','finra exam','securities license','series 63','series 66'] },
  { id:'gh-illumeo',             name:'Illumeo',                 cat:'Education', lc:'007949143344006221', slug:'illumeo-professional-development-2026',   keys:['cpe credits','cpa cpe','nasba cpe','accounting cpe','illumeo'] },
  { id:'gh-wolterskluwer',       name:'Wolters Kluwer LWW',      cat:'Education', lc:'007949165370003224', slug:'wolters-kluwer-medical-books-2026',       keys:['lippincott','nursing textbook','medical textbook','lww books'] },
  { id:'gh-learntasticcpr',      name:'LearnTastic CPR',         cat:'Education', lc:'007949143344006112', slug:'learnstastic-cpr-certification-2026',     keys:['cpr certification','online cpr','cpr aed','cpr course'] },
  { id:'gh-learntasticahca',     name:'LearnTastic AHCA',        cat:'Education', lc:'007949143344006113', slug:'learntastic-ahca-review-2026',            keys:['osha training','hipaa certification','ahca compliance','healthcare training'] },
  { id:'gh-pmtraining',          name:'PM Training',             cat:'Education', lc:'007949143344006992', slug:'pm-training-pmp-2026',                    keys:['pmp certification','pmp exam','project management','pmp course'] },
  { id:'gh-canadapetcare',       name:'CanadaPetCare',           cat:'Pet Care',  lc:'007949083344004721', slug:'canada-pet-care-vs-vet-2026',             keys:['nexgard canada','heartgard canada','canadian pet pharmacy','pet meds canada'] },
  { id:'gh-bestvetcare',         name:'BestVetCare',             cat:'Pet Care',  lc:'007949093344004992', slug:'bestvetcare-review-2026',                 keys:['online pet pharmacy','pet medications online','frontline online','bravecto online'] },
  { id:'gh-budgetpetcare',       name:'BudgetPetCare',           cat:'Pet Care',  lc:'007949103344005118', slug:'budget-pet-care-guide-2026',              keys:['cheap pet meds','affordable pet medications','discount flea treatment'] },
  { id:'gh-budgetpetworld',      name:'BudgetPetWorld',          cat:'Pet Care',  lc:'007949113344005224', slug:'budgetpetworld-review-2026',              keys:['budget pet world','cheap pet supplies','pet meds international'] },
  { id:'gh-discountpetcare',     name:'DiscountPetCare',         cat:'Pet Care',  lc:'007949123344005441', slug:'discountpetcare-review-2026',             keys:['discount pet medications','pet meds discount','save pet medications'] },
  { id:'gh-nursejamie',          name:'Nurse Jamie',             cat:'Health',    lc:'007949153344007112', slug:'nurse-jamie-review-2026',                 keys:['nurse jamie','skincare tools','beauty devices','esthetician skincare'] },
  { id:'gh-personalabs',         name:'Personalabs',             cat:'Health',    lc:'007949133344005442', slug:'personalabs-lab-tests-2026',              keys:['blood test online','lab test no doctor','personalabs','direct lab test'] },
  { id:'gh-ayurvedaexperience',  name:'Ayurveda Experience',     cat:'Health',    lc:'007949163344008221', slug:'ayurveda-experience-review-2026',         keys:['ashwagandha','ayurvedic','turmeric supplement','neem skincare'] },
  { id:'gh-maxpeedingrodsus',    name:'Maxpeedingrods US',       cat:'Auto',      lc:'007949133344006421', slug:'maxpeedingrods-review-2026',              keys:['coilovers','budget coilovers','performance parts','suspension upgrade'] },
  { id:'gh-maxpeedingrodsau',    name:'Maxpeedingrods AU',       cat:'Auto',      lc:'007949143344006554', slug:'maxpeedingrods-au-review-2026',           keys:['coilovers australia','performance parts australia','suspension australia'] },
  { id:'gh-lafuente',            name:'La Fuente Imports',       cat:'Auto',      lc:'007949083344003992', slug:'la-fuente-imports-review-2026',           keys:['mexican folk art','talavera pottery','mexican imports','day of dead'] },
  { id:'gh-buildasign',          name:'BuildASign',              cat:'Print',     lc:'007949043344001995', slug:'buildasign-custom-prints-2026',           keys:['custom banners','yard signs','retractable banner','custom signs'] },
  { id:'gh-bannersonthecheap',   name:'BannersOnTheCheap',       cat:'Print',     lc:'007949073344003661', slug:'banners-on-the-cheap-guide-2026',         keys:['cheap banners','vinyl banners','cheap vinyl banner','event banners'] },
  { id:'gh-canvasonthecheap',    name:'CanvasOnTheCheap',        cat:'Print',     lc:'007949073344003662', slug:'canvas-on-the-cheap-guide-2026',          keys:['cheap canvas prints','canvas sale','discount canvas','canvas prints'] },
  { id:'gh-easycanvasprints',    name:'Easy Canvas Prints',      cat:'Print',     lc:'007949063344003112', slug:'easy-canvas-prints-guide-2026',           keys:['photo canvas','canvas print','photo to canvas','canvas gift'] },
  { id:'gh-etchingexpressions',  name:'Etching Expressions',     cat:'Print',     lc:'007949083344004332', slug:'etching-expressions-gifts-2026',          keys:['engraved gifts','laser engraving','personalized gifts','custom engraving'] },
  { id:'gh-ryonet',              name:'Ryonet',                  cat:'Print',     lc:'007949084633004512', slug:'ryonet-screen-printing-2026',             keys:['screen printing','screen printing supplies','screen printing equipment'] },
  { id:'gh-trademarkhardware',   name:'Trademark Hardware',      cat:'Hardware',  lc:'007949123344005912', slug:'trademark-hardware-guide-2026',           keys:['hardware store','online hardware','home improvement parts','plumbing hardware'] },
  { id:'gh-trademarksoundproofing',name:'Trademark Soundproofing',cat:'Hardware', lc:'007949133344006118', slug:'soundproofing-guide-2026',                keys:['soundproofing','acoustic panels','noise reduction','sound dampening'] },
  { id:'gh-warehouse115',        name:'Warehouse 115',           cat:'Hardware',  lc:'007949163344007442', slug:'warehouse115-review-2026',                keys:['wholesale products','industrial supplies','bulk products','warehouse pricing'] },
  { id:'gh-fieldtex',            name:'Fieldtex Products',       cat:'Hardware',  lc:'007949123344005118', slug:'fieldtex-first-aid-2026',                 keys:['first aid kit','custom first aid','medical bags','emergency kit'] },
  { id:'gh-productsonthego',     name:'Products On The Go',      cat:'Hardware',  lc:'007949113344004882', slug:'products-on-the-go-2026',                 keys:['travel products','portable products','travel accessories'] },
  { id:'gh-halloweencostumes',   name:'HalloweenCostumes.com',   cat:'Lifestyle', lc:'007949053344002874', slug:'halloween-costumes-guide-2026',           keys:['halloween costumes','adult costumes','kids halloween','group costumes','couples costumes'] },
  { id:'gh-graeters',            name:"Graeter's Ice Cream",     cat:'Lifestyle', lc:'007949073344004112', slug:'graeter-ice-cream-delivery-2026',         keys:['ice cream delivery','shipped ice cream','graeters','black raspberry chip'] },
  { id:'gh-thechessstore',       name:'The Chess Store',         cat:'Lifestyle', lc:'007949103344005112', slug:'chess-store-buying-guide-2026',           keys:['chess set','chess board','tournament chess','staunton chess','chess clock'] },
  { id:'gh-museumreplicas',      name:'MuseumReplicas.com',      cat:'Lifestyle', lc:'007949113344005442', slug:'museum-replicas-collectibles-2026',       keys:['historical swords','replica swords','larp weapons','medieval replica'] },
  { id:'gh-atlantacutlery',      name:'Atlanta Cutlery',         cat:'Lifestyle', lc:'007949123344005771', slug:'atlanta-cutlery-review-2026',             keys:['collectible knives','edged weapons','historical swords','knife collector'] },
  { id:'gh-vipertec',            name:'Viper Tec',               cat:'Lifestyle', lc:'007949133344006224', slug:'vipertec-tactical-knives-2026',           keys:['tactical knives','edc knife','folding knife','everyday carry knife'] },
  { id:'gh-combatflipflops',     name:'Combat Flip Flops',       cat:'Lifestyle', lc:'007949143344006881', slug:'combat-flip-flops-mission-2026',          keys:['combat flip flops','mission driven brand','ethical footwear','veteran brand'] },
  { id:'gh-camanoislandcoffee',  name:'Camano Island Coffee',    cat:'Lifestyle', lc:'007949053344002441', slug:'camano-island-coffee-review-2026',        keys:['organic coffee','fair trade coffee','coffee subscription','fresh roasted coffee'] },
  { id:'gh-readygolf',           name:'ReadyGolf',               cat:'Lifestyle', lc:'007949103344004551', slug:'readygolf-guide-2026',                    keys:['golf accessories','golf equipment','custom golf','golf gifts'] },
  { id:'gh-gunsinternational',   name:'GunsInternational',       cat:'Lifestyle', lc:'007949093344004221', slug:'gunsinternational-marketplace-2026',      keys:['guns online','firearms marketplace','buy guns online','used guns for sale'] },
  { id:'gh-carmellimo',          name:'Carmel Car & Limo',       cat:'Lifestyle', lc:'007949053344002881', slug:'carmel-limo-service-2026',                keys:['limo service','luxury car service','airport car service','nyc limo'] },
  { id:'gh-bugatchi',            name:'Bugatchi',                cat:'Lifestyle', lc:'007949153344007662', slug:'bugatchi-mens-fashion-2026',              keys:['mens shirts','bugatchi','premium mens clothing','bold pattern shirts'] },
  { id:'gh-surveyjunkie',        name:'Survey Junkie',           cat:'Lifestyle', lc:'007949033344001882', slug:'surveyjunkie-earn-online-2026',           keys:['paid surveys','survey junkie','make money surveys','online surveys'] },
  { id:'gh-tastyribbon',         name:'Tasty Ribbon',            cat:'Lifestyle', lc:'007949153344007881', slug:'tasty-ribbon-food-gifts-2026',            keys:['food gifts','gift baskets','corporate food gifts','gourmet gifts'] },
  { id:'gh-bgmgirl',             name:'BGM Girl',                cat:'Lifestyle', lc:'007949153344007992', slug:'bgmgirl-creator-music-2026',              keys:['royalty free music','youtube music','background music','twitch music'] },
  { id:'gh-incentrev',           name:'Incentrev',               cat:'Lifestyle', lc:'007949123344005991', slug:'incentrev-rewards-2026',                  keys:['loyalty rewards','employee incentives','rewards platform','customer loyalty'] },
];

// ── Language templates — native language keyword patterns
const LANG_TEMPLATES = [
  // English variations
  { lang: 'en', vol_mult: 1.0,   templates: [
    '{key} {year}', 'best {key} {year}', '{key} review', '{key} review {year}',
    'top {key}', 'cheap {key}', 'best {key}', '{key} discount', '{key} deal',
    '{key} vs', 'is {key} worth it', '{key} alternative', 'buy {key} online',
    '{key} coupon', '{key} promo', 'cheapest {key}', '{key} free trial',
  ]},
  // Spanish
  { lang: 'es', vol_mult: 0.35,  templates: [
    'mejor {key} {year}', '{key} en español', '{key} precio', 'mejor {key}',
    '{key} reseña', '{key} opiniones', '{key} barato', 'oferta {key}',
    'comparar {key}', '{key} descuento', '{key} alternativa',
  ]},
  // French
  { lang: 'fr', vol_mult: 0.28,  templates: [
    'meilleur {key} {year}', '{key} avis', '{key} prix', 'meilleur {key}',
    '{key} comparatif', '{key} pas cher', 'offre {key}', '{key} promotion',
    'alternative {key}', 'acheter {key}', '{key} reduction',
  ]},
  // German
  { lang: 'de', vol_mult: 0.32,  templates: [
    'bestes {key} {year}', '{key} test', '{key} erfahrungen', '{key} preis',
    '{key} kaufen', '{key} günstig', 'bestes {key}', '{key} angebot',
    '{key} vergleich', '{key} alternative', '{key} empfehlung',
  ]},
  // Chinese Simplified
  { lang: 'zh', vol_mult: 0.42,  templates: [
    '最好的{key}', '{key}评测', '{key}价格', '{key}优惠',
    '{key}哪个好', '{key}推荐', '便宜的{key}', '{key}折扣',
    '{key}替代品', '买{key}', '{key}怎么样',
  ]},
  // Chinese Traditional
  { lang: 'zh-tw', vol_mult: 0.18, templates: [
    '最好的{key}', '{key}評測', '{key}價格', '{key}優惠',
    '{key}推薦', '便宜的{key}', '{key}折扣', '買{key}',
  ]},
  // Japanese
  { lang: 'ja', vol_mult: 0.38,  templates: [
    '最高の{key}', '{key}レビュー', '{key}価格', '{key}おすすめ',
    '安い{key}', '{key}比較', '{key}割引', '{key}代替',
    '{key}の使い方', '{key}評価',
  ]},
  // Korean
  { lang: 'ko', vol_mult: 0.28,  templates: [
    '최고의 {key}', '{key} 리뷰', '{key} 가격', '{key} 추천',
    '저렴한 {key}', '{key} 비교', '{key} 할인', '{key} 대안',
  ]},
  // Portuguese BR
  { lang: 'pt-br', vol_mult: 0.31, templates: [
    'melhor {key} {year}', '{key} review', '{key} preço', 'melhor {key}',
    '{key} barato', 'desconto {key}', '{key} alternativa', 'comprar {key}',
  ]},
  // Portuguese EU
  { lang: 'pt', vol_mult: 0.14,  templates: [
    'melhor {key}', '{key} análise', '{key} preço', 'comprar {key}',
    '{key} barato', '{key} desconto',
  ]},
  // Hindi
  { lang: 'hi', vol_mult: 0.25,  templates: [
    'सबसे अच्छा {key}', '{key} समीक्षा', '{key} कीमत', '{key} डिस्काउंट',
    'सस्ता {key}', '{key} खरीदें',
  ]},
  // Italian
  { lang: 'it', vol_mult: 0.22,  templates: [
    'migliore {key} {year}', '{key} recensione', '{key} prezzo',
    '{key} economico', 'offerta {key}', 'alternativa {key}',
  ]},
  // Dutch
  { lang: 'nl', vol_mult: 0.18,  templates: [
    'beste {key} {year}', '{key} review', '{key} prijs',
    'goedkoop {key}', 'korting {key}', '{key} alternatief',
  ]},
  // Polish
  { lang: 'pl', vol_mult: 0.18,  templates: [
    'najlepszy {key} {year}', '{key} recenzja', '{key} cena',
    'tani {key}', '{key} rabat', '{key} alternatywa',
  ]},
  // Arabic
  { lang: 'ar', vol_mult: 0.22,  templates: [
    'أفضل {key}', '{key} مراجعة', '{key} سعر', '{key} رخيص',
    'خصم {key}', 'بديل {key}',
  ]},
  // Russian
  { lang: 'ru', vol_mult: 0.26,  templates: [
    'лучший {key} {year}', '{key} обзор', '{key} цена',
    'дешёвый {key}', 'скидка {key}', '{key} альтернатива',
  ]},
  // Turkish
  { lang: 'tr', vol_mult: 0.18,  templates: [
    'en iyi {key} {year}', '{key} inceleme', '{key} fiyat',
    'ucuz {key}', '{key} indirim', '{key} alternatif',
  ]},
  // Indonesian
  { lang: 'id', vol_mult: 0.20,  templates: [
    'terbaik {key} {year}', '{key} ulasan', '{key} harga',
    'murah {key}', 'diskon {key}', '{key} alternatif',
  ]},
  // Vietnamese
  { lang: 'vi', vol_mult: 0.16,  templates: [
    '{key} tốt nhất', '{key} đánh giá', '{key} giá',
    '{key} rẻ', '{key} khuyến mãi',
  ]},
  // Thai
  { lang: 'th', vol_mult: 0.14,  templates: [
    '{key}ที่ดีที่สุด', '{key}รีวิว', '{key}ราคา',
    '{key}ถูก', '{key}ส่วนลด',
  ]},
];

// ── Base search volumes per category
const BASE_VOLUMES = {
  Tax:       { min: 120000,  max: 980000  },
  Software:  { min: 80000,   max: 740000  },
  Education: { min: 60000,   max: 620000  },
  'Pet Care':{ min: 90000,   max: 580000  },
  Health:    { min: 70000,   max: 680000  },
  Auto:      { min: 50000,   max: 480000  },
  Print:     { min: 60000,   max: 540000  },
  Hardware:  { min: 40000,   max: 380000  },
  Lifestyle: { min: 80000,   max: 1200000 },
};

// ── Read existing keywords to avoid duplicates
function getExistingKeywords() {
  if (!fs.existsSync(KEYWORDS_FILE)) return new Set();
  const content = fs.readFileSync(KEYWORDS_FILE, 'utf8');
  const matches = content.match(/keyword: ['"]([^'"]+)['"]/g) || [];
  return new Set(matches.map(m => m.replace(/keyword: ['"]/, '').replace(/['"]$/, '').toLowerCase()));
}

// ── Estimate volume based on category, language multiplier, and template
function estimateVolume(cat, langMult, key) {
  const range = BASE_VOLUMES[cat] || { min: 50000, max: 300000 };
  // Seed with keyword for deterministic but varied results
  const seed = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = range.min + ((seed * 7919) % (range.max - range.min));
  return Math.round(base * langMult / 10000) * 10000; // round to nearest 10K
}

// ── Generate keyword text from template
function buildKeyword(template, key, year) {
  return template
    .replace('{key}', key)
    .replace('{year}', year)
    .trim()
    .toLowerCase();
}

// ── Pick a random element from array using seeded index
function pick(arr, seed) {
  return arr[Math.abs(seed) % arr.length];
}

// ── Main generation logic
function generateKeywords(existing, count) {
  const generated = [];
  const seen = new Set(existing);
  const runSeed = Date.now();

  let attempts = 0;
  while (generated.length < count && attempts < count * 20) {
    attempts++;

    // Pick merchant
    const m = MERCHANTS[(runSeed + attempts * 31) % MERCHANTS.length];

    // Pick language template set
    const langSet = LANG_TEMPLATES[(runSeed + attempts * 17) % LANG_TEMPLATES.length];

    // Pick a key term from merchant
    const keyTerm = m.keys[(runSeed + attempts * 13) % m.keys.length];

    // Pick a template
    const template = langSet.templates[(runSeed + attempts * 7) % langSet.templates.length];

    // Build keyword
    const kw = buildKeyword(template, keyTerm, YEAR);

    // Skip if duplicate or too short
    if (seen.has(kw) || kw.length < 6) continue;
    seen.add(kw);

    const vol = estimateVolume(m.cat, langSet.vol_mult, kw);

    generated.push({
      keyword:  kw,
      volume:   vol,
      merchant: m.id,
      lc:       m.lc,
      cat:      m.cat,
      blogSlug: m.slug,
      lang:     langSet.lang,
    });
  }

  // Sort high to low
  generated.sort((a, b) => b.volume - a.volume);
  return generated;
}

// ── Append to targetedkeys.js
function appendToFile(keywords) {
  if (!fs.existsSync(KEYWORDS_FILE)) {
    console.log(`  ⚠ ${KEYWORDS_FILE} not found — skipping append`);
    return 0;
  }

  let content = fs.readFileSync(KEYWORDS_FILE, 'utf8');

  const newEntries = keywords.map(k =>
    `  { keyword: ${JSON.stringify(k.keyword)}, volume: ${k.volume}, merchant: ${JSON.stringify(k.merchant)}, lc: ${JSON.stringify(k.lc)}, cat: ${JSON.stringify(k.cat)}, blogSlug: ${JSON.stringify(k.blogSlug)}, lang: ${JSON.stringify(k.lang)} },`
  ).join('\n');

  // Insert before last ]; in file
  const insertAt = content.lastIndexOf('];');
  if (insertAt === -1) {
    console.log('  ⚠ Could not find closing ]; in targetedkeys.js');
    return 0;
  }

  const updated =
    content.slice(0, insertAt) +
    `\n  // ── Auto-generated ${TODAY} ──\n` +
    newEntries + '\n' +
    content.slice(insertAt);

  fs.writeFileSync(KEYWORDS_FILE, updated, 'utf8');
  return keywords.length;
}

// ── Log the run
function logRun(generated, langBreakdown) {
  let log = [];
  if (fs.existsSync(LOG_FILE)) {
    try { log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch(e) {}
  }
  const total = (() => {
    if (!fs.existsSync(KEYWORDS_FILE)) return 0;
    const c = fs.readFileSync(KEYWORDS_FILE, 'utf8');
    return (c.match(/keyword:/g) || []).length;
  })();
  log.push({ date: TODAY, generated, total_after: total, lang_breakdown: langBreakdown });
  if (log.length > 60) log = log.slice(-60);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

// ── Main
function main() {
  console.log('\n🌍 GLOBALCAMPAIGNHUB AUTO-KEYWORD-GENERATOR v2.0');
  console.log('══════════════════════════════════════════════════');
  console.log(`Account: LinkConnector 007949 | Date: ${TODAY}`);
  console.log(`Mode: NO API KEY — pure template generation\n`);

  const existing = getExistingKeywords();
  console.log(`Existing keywords: ${existing.size}`);
  console.log(`Generating ${BATCH_SIZE} new keywords across 20 languages...`);

  const keywords = generateKeywords(existing, BATCH_SIZE);

  // Language breakdown
  const langBreakdown = {};
  keywords.forEach(k => { langBreakdown[k.lang] = (langBreakdown[k.lang] || 0) + 1; });

  console.log('\nLanguage breakdown:');
  Object.entries(langBreakdown)
    .sort((a, b) => b[1] - a[1])
    .forEach(([lang, n]) => console.log(`  ${lang}: ${n}`));

  const appended = appendToFile(keywords);
  logRun(keywords.length, langBreakdown);

  const newTotal = existing.size + appended;
  const nonEn = keywords.filter(k => k.lang !== 'en').length;

  console.log(`\n✅ Done!`);
  console.log(`  Added     : ${appended} keywords`);
  console.log(`  Total     : ~${newTotal.toLocaleString()} keywords`);
  console.log(`  Non-EN    : ${nonEn} / ${keywords.length} (${Math.round(nonEn/keywords.length*100)}%)`);
  console.log(`  Top kw    : "${keywords[0]?.keyword}" — ${(keywords[0]?.volume/1000).toFixed(0)}K/mo`);
  console.log(`  Daily est : ${BATCH_SIZE * 144} keywords/day`);
  console.log(`  Yearly est: ${(BATCH_SIZE * 144 * 365).toLocaleString()} keywords/year`);
  console.log('══════════════════════════════════════════════════\n');
}

main();
