#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB AUTO-TOPIC-GENERATOR v2.0
//  NO API KEY REQUIRED — generates from built-in templates
//  Run: node auto-topic-generator.js
//
//  Reads post-topics.json, refills queue when below 20 pending topics
//  Generates full topic objects ready for inject.js to publish
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
// ═══════════════════════════════════════════════════════════════════════

const fs = require('fs');

const TOPICS_FILE  = 'post-topics.json';
const LOG_FILE     = 'topic-generator-log.json';
const MIN_PENDING  = 20;
const BATCH_SIZE   = 20;
const TODAY        = new Date().toISOString().slice(0, 10);
const YEAR         = new Date().getFullYear();

// ── 68 merchants with pre-written topic templates
const MERCHANTS = [
  { id:'gh-efile',               name:'E-file.com',              cat:'Tax',       lc:'007949021469002241', slug:'efile-vs-turbotax-2026',
    topics:['E-file.com Review {year}: Cheaper Than TurboTax?','How to File Federal Taxes Online in {year} for Under $25','E-file.com vs TurboTax: Which Is Best in {year}?','IRS-Authorized Tax Filing: What You Need to Know in {year}']},
  { id:'gh-etax',                name:'E TAX LLC',               cat:'Tax',       lc:'007949113645003507', slug:'etax-llc-tax-filing-2026',
    topics:['Best Online Tax Prep for Self-Employed in {year}','E TAX LLC Review: Is It Worth It in {year}?','Small Business Tax Filing Online: Top Options {year}']},
  { id:'gh-taxextension',        name:'TaxExtension.com',        cat:'Tax',       lc:'007949033342002305', slug:'tax-extension-deadline-guide-2026',
    topics:['How to File a Tax Extension in 5 Minutes ({year})','Tax Extension Deadline {year}: Complete Guide','Form 4868 Online: File Your IRS Extension Today','What Happens If You Miss the Tax Deadline in {year}?']},
  { id:'gh-eztaxreturn',         name:'ezTaxReturn.com',         cat:'Tax',       lc:'007949053344004952', slug:'eztaxreturn-review-2026',
    topics:['ezTaxReturn Review {year}: Actually Free or Hidden Fees?','How to File Taxes Free Online in {year}','Best Free Tax Filing Options {year}: Honest Comparison']},
  { id:'gh-nordvpn',             name:'NordVPN',                 cat:'Software',  lc:'007949143344006843', slug:'nordvpn-review-2026',
    topics:['NordVPN Review {year}: Still the Best VPN?','Does NordVPN Work With Netflix in {year}?','NordVPN vs ExpressVPN vs Surfshark: Best VPN in {year}?','Best VPN for Streaming in {year}: Tested and Ranked','Is NordVPN Worth the Price in {year}?']},
  { id:'gh-depositphotos',       name:'Depositphotos',           cat:'Software',  lc:'007949063344003921', slug:'depositphotos-review-2026',
    topics:['Depositphotos Review {year}: Best Shutterstock Alternative?','Cheapest Stock Photo Sites in {year}: Full Comparison','How to Get Royalty-Free Images for Commercial Use in {year}']},
  { id:'gh-filmora',             name:'Wondershare Filmora',     cat:'Software',  lc:'007949165260004532', slug:'filmora-ai-features-2026',
    topics:['Filmora Review {year}: Best Video Editor for YouTube?','Filmora vs Premiere Pro: Which Is Better in {year}?','How to Add Auto-Subtitles With Filmora AI in {year}','Best AI Video Editors in {year}: Full Comparison']},
  { id:'gh-pdfelement',          name:'Wondershare PDFelement',  cat:'Software',  lc:'007949165372004532', slug:'pdfelement-vs-acrobat-2026',
    topics:['PDFelement Review {year}: Best Acrobat Alternative?','Best One-Time Purchase PDF Editors in {year}','How to Edit PDFs Without Adobe (Save $200/Year)','PDFelement vs Adobe vs UPDF: Which Wins in {year}?']},
  { id:'gh-edraw',               name:'Edraw Mind/Max',          cat:'Software',  lc:'007949165246006886', slug:'edraw-mind-map-review-2026',
    topics:['Best Visio Alternative in {year}: EdrawMax Reviewed','Mind Mapping Software {year}: Which Is Worth Buying?','How to Create Professional Diagrams Without Visio']},
  { id:'gh-sidify',              name:'Sidify',                  cat:'Software',  lc:'007949163344007882', slug:'sidify-spotify-converter-2026',
    topics:['Sidify Review {year}: Convert Spotify to MP3 — Legit?','How to Convert Spotify Songs to MP3 in {year}','Best Spotify Music Converters in {year}: Compared']},
  { id:'gh-movavi',              name:'Movavi Software',         cat:'Software',  lc:'007949153344007119', slug:'movavi-video-editor-2026',
    topics:['Movavi Review {year}: Best No-Subscription Video Editor?','Best Video Editors With No Subscription in {year}','Movavi vs Filmora: Which Should You Buy in {year}?']},
  { id:'gh-jalbum',              name:'jAlbum',                  cat:'Software',  lc:'007949143344006442', slug:'jalbum-photo-gallery-2026',
    topics:['jAlbum Review {year}: Build Photo Websites Without Coding?','Best Photo Gallery Website Builders in {year}']},
  { id:'gh-updf',                name:'UPDF',                    cat:'Software',  lc:'007949163344008112', slug:'updf-pdf-editor-review-2026',
    topics:['UPDF Review {year}: The AI PDF Editor That Beats Acrobat?','Best AI PDF Editors in {year}: UPDF vs PDFelement vs Acrobat','How to Summarize PDFs With AI in {year}']},
  { id:'gh-itoolab',             name:'iToolab',                 cat:'Software',  lc:'007949163344008441', slug:'itoolab-iphone-manager-2026',
    topics:['iToolab Review {year}: Best iPhone Unlock Software?','How to Unlock a Disabled iPhone in {year} Without Data Loss']},
  { id:'gh-tenorshare',          name:'Tenorshare',              cat:'Software',  lc:'007949163344008992', slug:'tenorshare-iphone-tools-2026',
    topics:['How to Recover Deleted iPhone Photos in {year}','Tenorshare ReiBoot Review: Fix iOS Without iTunes','Best iPhone Data Recovery Software {year}: Ranked','How to Unlock a Disabled iPhone in {year}']},
  { id:'gh-appypie',             name:'Appy Pie',                cat:'Software',  lc:'007949153344007442', slug:'appy-pie-no-code-tools-2026',
    topics:['Appy Pie Review {year}: Build Apps Without Coding?','Best No-Code App Builders in {year}: Compared','How to Build a Mobile App Without Coding in {year}']},
  { id:'gh-renoise',             name:'Renoise',                 cat:'Software',  lc:'007949143344006551', slug:'renoise-music-production-2026',
    topics:['Renoise Review {year}: Best Tracker DAW for Electronic Music?','Best DAWs With One-Time Purchase in {year}']},
  { id:'gh-boardvitals',         name:'BoardVitals',             cat:'Education', lc:'007949114675005824', slug:'boardvitals-medical-exam-prep-2026',
    topics:['BoardVitals Review {year}: Best USMLE and NCLEX Question Bank?','USMLE Step 2 Study Guide {year}: Pass on the First Try','Best NCLEX Question Banks {year}: BoardVitals vs UWorld']},
  { id:'gh-surgent',             name:'Surgent CPA',             cat:'Education', lc:'007949123344006122', slug:'surgent-cpa-exam-prep-2026',
    topics:['Surgent CPA Review {year}: Pass the CPA Exam 40% Faster?','CPA Exam Prep {year}: Surgent vs Becker vs Wiley','How to Pass the CPA Exam Faster With AI Study Plans']},
  { id:'gh-hrcp',                name:'HRCP',                    cat:'Education', lc:'007949093344005114', slug:'hrcp-hr-certification-2026',
    topics:['HRCP Review {year}: Best PHR Certification Prep?','How to Pass the PHR Exam in {year}: Complete Guide','PHR vs SPHR: Which HR Certification Should You Get?']},
  { id:'gh-oakstone',            name:'Oakstone Medical',        cat:'Education', lc:'007949103344005432', slug:'oakstone-cme-review-2026',
    topics:['Oakstone Medical Review {year}: Best Audio CME for Physicians?','How to Get CME Credits During Your Commute in {year}']},
  { id:'gh-securitiesinstitute', name:'Securities Institute',    cat:'Education', lc:'007949113344005987', slug:'securities-institute-exam-prep-2026',
    topics:['How to Pass the Series 7 Exam in {year}: Full Study Guide','Securities Institute Review: Best FINRA Exam Prep?','Series 7 vs Series 63: Which License Do You Need?']},
  { id:'gh-illumeo',             name:'Illumeo',                 cat:'Education', lc:'007949143344006221', slug:'illumeo-professional-development-2026',
    topics:['Illumeo Review {year}: Cheapest NASBA-Approved CPE?','How to Get CPE Credits Online for Your CPA License in {year}']},
  { id:'gh-wolterskluwer',       name:'Wolters Kluwer LWW',      cat:'Education', lc:'007949165370003224', slug:'wolters-kluwer-medical-books-2026',
    topics:['Where to Buy Lippincott Nursing Textbooks at the Lowest Price','Best Medical Textbooks for Nursing Students in {year}']},
  { id:'gh-learntasticcpr',      name:'LearnTastic CPR',         cat:'Education', lc:'007949143344006112', slug:'learnstastic-cpr-certification-2026',
    topics:['Online CPR Certification in {year}: What Employers Accept','How to Get CPR Certified Online in 90 Minutes','Best Online CPR Courses in {year}: Compared']},
  { id:'gh-learntasticahca',     name:'LearnTastic AHCA',        cat:'Education', lc:'007949143344006113', slug:'learntastic-ahca-review-2026',
    topics:['HIPAA Certification Online in {year}: Fast and Employer-Accepted','OSHA Healthcare Training Online: What You Need in {year}']},
  { id:'gh-pmtraining',          name:'PM Training',             cat:'Education', lc:'007949143344006992', slug:'pm-training-pmp-2026',
    topics:['PMP Certification {year}: Complete Guide to Getting Certified','PM Training Review: Is the 98% Pass Rate Real?','How to Get PMP Certified in {year}: Step by Step']},
  { id:'gh-canadapetcare',       name:'CanadaPetCare',           cat:'Pet Care',  lc:'007949083344004721', slug:'canada-pet-care-vs-vet-2026',
    topics:['Buy NexGard Online Canada: Save 20-40% vs Your Vet','CanadaPetCare Review {year}: Safe and Legit?','Best Canadian Online Pet Pharmacies in {year}']},
  { id:'gh-bestvetcare',         name:'BestVetCare',             cat:'Pet Care',  lc:'007949093344004992', slug:'bestvetcare-review-2026',
    topics:['BestVetCare Review {year}: Cheap Pet Meds — Is It Safe?','Frontline Plus Online: Where to Buy Cheap in {year}']},
  { id:'gh-budgetpetcare',       name:'BudgetPetCare',           cat:'Pet Care',  lc:'007949103344005118', slug:'budget-pet-care-guide-2026',
    topics:['How to Save 30-50% on Pet Medications in {year}','BudgetPetCare Review {year}: Legit or Not?','Cheapest Flea and Tick Prevention Options in {year}']},
  { id:'gh-budgetpetworld',      name:'BudgetPetWorld',          cat:'Pet Care',  lc:'007949113344005224', slug:'budgetpetworld-review-2026',
    topics:['BudgetPetWorld Review {year}: International Pet Pharmacy?','Cheapest Pet Supplies Online That Ship Internationally']},
  { id:'gh-discountpetcare',     name:'DiscountPetCare',         cat:'Pet Care',  lc:'007949123344005441', slug:'discountpetcare-review-2026',
    topics:['DiscountPetCare Review {year}: Genuine Discount or Not?','Best Discount Pet Medication Sites in {year}: Compared']},
  { id:'gh-nursejamie',          name:'Nurse Jamie',             cat:'Health',    lc:'007949153344007112', slug:'nurse-jamie-review-2026',
    topics:['Nurse Jamie Review {year}: Are the Skincare Tools Worth It?','Best At-Home Beauty Devices for {year}: Expert Picks']},
  { id:'gh-personalabs',         name:'Personalabs',             cat:'Health',    lc:'007949133344005442', slug:'personalabs-lab-tests-2026',
    topics:['How to Order a Blood Test Without a Doctor in {year}','Personalabs Review {year}: Direct Lab Testing — Accurate?','Best Direct-to-Consumer Lab Testing Services in {year}']},
  { id:'gh-ayurvedaexperience',  name:'Ayurveda Experience',     cat:'Health',    lc:'007949163344008221', slug:'ayurveda-experience-review-2026',
    topics:['Ashwagandha in {year}: What the Research Actually Shows','The Ayurveda Experience Review {year}: Worth It?','Best Ashwagandha Supplements in {year}: Ranked']},
  { id:'gh-maxpeedingrodsus',    name:'Maxpeedingrods US',       cat:'Auto',      lc:'007949133344006421', slug:'maxpeedingrods-review-2026',
    topics:['Maxpeedingrods Coilovers Review {year}: Budget Worth It?','Best Budget Coilovers Under $500 in {year}: Tested','How to Lower Your Car on a Budget in {year}']},
  { id:'gh-maxpeedingrodsau',    name:'Maxpeedingrods AU',       cat:'Auto',      lc:'007949143344006554', slug:'maxpeedingrods-au-review-2026',
    topics:['Best Budget Coilovers Australia in {year}: Full Review','Maxpeedingrods Australia Review {year}: Worth It?']},
  { id:'gh-lafuente',            name:'La Fuente Imports',       cat:'Auto',      lc:'007949083344003992', slug:'la-fuente-imports-review-2026',
    topics:['Best Mexican Folk Art Online in {year}: Where to Buy','La Fuente Imports Review {year}: Authentic or Not?']},
  { id:'gh-buildasign',          name:'BuildASign',              cat:'Print',     lc:'007949043344001995', slug:'buildasign-custom-prints-2026',
    topics:['BuildASign Review {year}: Best Custom Banner Printing?','Cheapest Custom Banners Online in {year}: Full Comparison','How to Design a Business Banner in {year}: Step by Step']},
  { id:'gh-bannersonthecheap',   name:'BannersOnTheCheap',       cat:'Print',     lc:'007949073344003661', slug:'banners-on-the-cheap-guide-2026',
    topics:['BannersOnTheCheap Review {year}: Actually the Cheapest?','How to Order Cheap Vinyl Banners Online in {year}']},
  { id:'gh-canvasonthecheap',    name:'CanvasOnTheCheap',        cat:'Print',     lc:'007949073344003662', slug:'canvas-on-the-cheap-guide-2026',
    topics:['CanvasOnTheCheap Review {year}: Cheapest Canvas Prints?','How to Get Canvas Prints on Sale in {year}']},
  { id:'gh-easycanvasprints',    name:'Easy Canvas Prints',      cat:'Print',     lc:'007949063344003112', slug:'easy-canvas-prints-guide-2026',
    topics:['Easy Canvas Prints Review {year}: Best Color Accuracy?','Best Canvas Print Sites in {year}: Compared','Canvas Prints as Gifts in {year}: Complete Buyer Guide']},
  { id:'gh-etchingexpressions',  name:'Etching Expressions',     cat:'Print',     lc:'007949083344004332', slug:'etching-expressions-gifts-2026',
    topics:['Custom Engraved Gifts {year}: Complete Buyer Guide','Best Laser Engraving Gift Sites in {year}: Compared','Corporate Engraved Gifts Bulk in {year}: What to Know']},
  { id:'gh-ryonet',              name:'Ryonet',                  cat:'Print',     lc:'007949084633004512', slug:'ryonet-screen-printing-2026',
    topics:['Ryonet Review {year}: Best Screen Printing Supplies?','How to Start Screen Printing in {year}: Beginner Guide']},
  { id:'gh-trademarkhardware',   name:'Trademark Hardware',      cat:'Hardware',  lc:'007949123344005912', slug:'trademark-hardware-guide-2026',
    topics:['Best Online Hardware Stores in {year}: Trademark Hardware Reviewed','Where to Buy Home Improvement Parts Online in {year}']},
  { id:'gh-trademarksoundproofing',name:'Trademark Soundproofing',cat:'Hardware', lc:'007949133344006118', slug:'soundproofing-guide-2026',
    topics:['How to Soundproof a Room on a Budget in {year}','Best Soundproofing Materials in {year}: What Actually Works?','Home Studio Soundproofing Guide {year}']},
  { id:'gh-warehouse115',        name:'Warehouse 115',           cat:'Hardware',  lc:'007949163344007442', slug:'warehouse115-review-2026',
    topics:['Warehouse 115 Review {year}: Best Wholesale Products Online?','Buying Wholesale Products Online in {year}: Full Guide']},
  { id:'gh-fieldtex',            name:'Fieldtex Products',       cat:'Hardware',  lc:'007949123344005118', slug:'fieldtex-first-aid-2026',
    topics:['Custom First Aid Kits for Workplaces in {year}: Complete Guide','Fieldtex Products Review {year}: Worth It?']},
  { id:'gh-productsonthego',     name:'Products On The Go',      cat:'Hardware',  lc:'007949113344004882', slug:'products-on-the-go-2026',
    topics:['Best Travel Products for Professionals in {year}','Products On The Go Review {year}']},
  { id:'gh-halloweencostumes',   name:'HalloweenCostumes.com',   cat:'Lifestyle', lc:'007949053344002874', slug:'halloween-costumes-guide-2026',
    topics:['Best Halloween Costumes of {year}: Top Trends','Halloween Couples Costumes {year}: 50 Creative Ideas','Group Halloween Costumes {year}: Ideas for Every Size','When to Order Halloween Costumes Online in {year}','Last-Minute Halloween Costumes {year}: Ships in 2-3 Days','Kids Halloween Costumes {year}: Best Picks by Age']},
  { id:'gh-graeters',            name:"Graeter's Ice Cream",     cat:'Lifestyle', lc:'007949073344004112', slug:'graeter-ice-cream-delivery-2026',
    topics:["Graeter's Ice Cream Review: Is It Worth Shipping?",'Best Ice Cream You Can Ship Nationwide in {year}',"Why Graeter's Black Raspberry Chip Is a Cult Favorite"]},
  { id:'gh-thechessstore',       name:'The Chess Store',         cat:'Lifestyle', lc:'007949103344005112', slug:'chess-store-buying-guide-2026',
    topics:['Best Chess Sets Online in {year}: Complete Buyer Guide','Tournament Chess Sets in {year}: What to Buy','The Chess Store Review {year}: Legit?']},
  { id:'gh-museumreplicas',      name:'MuseumReplicas.com',      cat:'Lifestyle', lc:'007949113344005442', slug:'museum-replicas-collectibles-2026',
    topics:['Best Historical Sword Sites in {year}: MuseumReplicas Reviewed','LARP Weapons in {year}: Where to Buy Quality Gear','Medieval Replica Weapons {year}: Complete Buyer Guide']},
  { id:'gh-atlantacutlery',      name:'Atlanta Cutlery',         cat:'Lifestyle', lc:'007949123344005771', slug:'atlanta-cutlery-review-2026',
    topics:['Atlanta Cutlery Review {year}: Best Collectible Knife Site?','Where to Buy Historical Swords Online in {year}']},
  { id:'gh-vipertec',            name:'Viper Tec',               cat:'Lifestyle', lc:'007949133344006224', slug:'vipertec-tactical-knives-2026',
    topics:['Viper Tec Review {year}: Best Tactical Knives Online?','Best EDC Knives Under $100 in {year}: Compared']},
  { id:'gh-combatflipflops',     name:'Combat Flip Flops',       cat:'Lifestyle', lc:'007949143344006881', slug:'combat-flip-flops-mission-2026',
    topics:['Combat Flip Flops Review {year}: Mission-Driven or Marketing?','Best Ethical Footwear Brands in {year}: Ranked']},
  { id:'gh-camanoislandcoffee',  name:'Camano Island Coffee',    cat:'Lifestyle', lc:'007949053344002441', slug:'camano-island-coffee-review-2026',
    topics:['Best Fair Trade Coffee Subscriptions in {year}: Compared','Camano Island Coffee Review {year}: Freshest by Mail?','Why Fresh-Roasted Coffee Tastes Better in {year}']},
  { id:'gh-readygolf',           name:'ReadyGolf',               cat:'Lifestyle', lc:'007949103344004551', slug:'readygolf-guide-2026',
    topics:['Best Golf Accessories Online in {year}: ReadyGolf Reviewed','Custom Golf Gifts in {year}: Where to Buy']},
  { id:'gh-gunsinternational',   name:'GunsInternational',       cat:'Lifestyle', lc:'007949093344004221', slug:'gunsinternational-marketplace-2026',
    topics:['GunsInternational Review {year}: Best Firearms Marketplace?','How to Buy Guns Online Legally in {year}: Complete Guide']},
  { id:'gh-carmellimo',          name:'Carmel Car & Limo',       cat:'Lifestyle', lc:'007949053344002881', slug:'carmel-limo-service-2026',
    topics:['Carmel Car Service Review {year}: Best NYC Airport Transfer?','Uber Black vs Car Service NYC in {year}: Which Is Better?']},
  { id:'gh-bugatchi',            name:'Bugatchi',                cat:'Lifestyle', lc:'007949153344007662', slug:'bugatchi-mens-fashion-2026',
    topics:['Bugatchi Shirts Review {year}: Worth the Premium Price?','Best Bold Pattern Mens Shirts in {year}: Ranked']},
  { id:'gh-surveyjunkie',        name:'Survey Junkie',           cat:'Lifestyle', lc:'007949033344001882', slug:'surveyjunkie-earn-online-2026',
    topics:['Survey Junkie Review {year}: How Much Can You Really Earn?','Is Survey Junkie Legit in {year}? We Cashed Out $200','Best Paid Survey Sites in {year}: Full Honest Comparison']},
  { id:'gh-tastyribbon',         name:'Tasty Ribbon',            cat:'Lifestyle', lc:'007949153344007881', slug:'tasty-ribbon-food-gifts-2026',
    topics:['Best Gourmet Food Gift Baskets in {year}: Compared','Tasty Ribbon Review {year}: Corporate Food Gifts Worth It?','Best Corporate Food Gifts in {year}: What to Order']},
  { id:'gh-bgmgirl',             name:'BGM Girl',                cat:'Lifestyle', lc:'007949153344007992', slug:'bgmgirl-creator-music-2026',
    topics:['Best Royalty-Free Music Sites for YouTube in {year}','BGM Girl Review {year}: DMCA-Safe Music for Creators?','How to Avoid Copyright Claims on YouTube in {year}']},
  { id:'gh-incentrev',           name:'Incentrev',               cat:'Lifestyle', lc:'007949123344005991', slug:'incentrev-rewards-2026',
    topics:['Incentrev Review {year}: Best Business Loyalty Platform?','Employee Incentive Programs in {year}: What Actually Works']},
];

function buildTopic(merchant, titleTemplate, seed) {
  const title = titleTemplate.replace(/{year}/g, YEAR);
  const slug = `${title.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,70)}-${seed % 10000}`;

  return {
    slug,
    merchant: merchant.id,
    published: false,
    publishedDate: null,
    title_en: title,
    category_en: merchant.cat,
    metaDesc_en: `${title} — verified deals and honest reviews at GlobalCampaignHub.`,
    keywords_en: `${merchant.name.toLowerCase()},${merchant.cat.toLowerCase()},globalcampaignhub,${YEAR},review`,
    intro_en: `Looking for the best deal on ${merchant.name}? This guide cuts through the noise with everything you need to know in ${YEAR}.`,
    callout_en: `All links use affiliate tracking through LinkConnector Account 007949 (${merchant.id}). No extra cost to you.`,
    h2a_en: `What Is ${merchant.name}?`,
    body1_en: `${merchant.name} is a verified ${merchant.cat} merchant with affiliate tracking through LinkConnector. Whether you're a first-time buyer or comparing options, this guide has you covered.`,
    bullets_en: [`Verified merchant through LinkConnector 007949`,`Tracked with ${merchant.id}`,`Available in 20 languages`,`Affiliate disclosure: commission earned at no cost to you`,`Updated for ${YEAR}`,`Full buyer guide available`],
    verdict_title_en: `${merchant.name} — Our ${YEAR} Verdict`,
    verdict_desc_en: `${merchant.name} delivers solid value in the ${merchant.cat} category. We recommend comparing with alternatives before buying — use our buyer guides to decide.`,
    h2b_en: `How to Get the Best Price on ${merchant.name}`,
    body2_en: `Click our verified affiliate link to access the current best offer. Tracked with ${merchant.id} through LinkConnector Account 007949.`,
    cta_en: `Visit ${merchant.name} →`,
    cta2_en: `Read Full Buyer Guide`,
    faqs_en: [
      {q:`Is ${merchant.name} verified?`, a:`Yes — verified through LinkConnector Account 007949 with tracking ID ${merchant.id}.`},
      {q:`Is GlobalCampaignHub free?`, a:`Yes, completely free. We earn a commission on purchases at no cost to you.`},
      {q:`What languages are supported?`, a:`20 languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, and more.`},
    ],
  };
}

function getExistingSlugs() {
  if (!fs.existsSync(TOPICS_FILE)) return new Set();
  try { return new Set(JSON.parse(fs.readFileSync(TOPICS_FILE,'utf8')).topics.map(t=>t.slug)); }
  catch(e) { return new Set(); }
}

function getPending() {
  if (!fs.existsSync(TOPICS_FILE)) return 0;
  try { return JSON.parse(fs.readFileSync(TOPICS_FILE,'utf8')).topics.filter(t=>!t.published).length; }
  catch(e) { return 0; }
}

function readTopics() {
  if (!fs.existsSync(TOPICS_FILE)) return {meta:{total:0,last_updated:TODAY},topics:[]};
  try { return JSON.parse(fs.readFileSync(TOPICS_FILE,'utf8')); }
  catch(e) { return {meta:{total:0,last_updated:TODAY},topics:[]}; }
}

function logRun(generated, pending) {
  let log = [];
  if (fs.existsSync(LOG_FILE)) { try { log = JSON.parse(fs.readFileSync(LOG_FILE,'utf8')); } catch(e){} }
  log.push({date:TODAY, generated, pending_after:pending});
  if (log.length > 60) log = log.slice(-60);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log,null,2));
}

function main() {
  console.log('\n📝 GLOBALCAMPAIGNHUB AUTO-TOPIC-GENERATOR v2.0');
  console.log('══════════════════════════════════════════════');
  console.log(`Account: 007949 | Date: ${TODAY} | Mode: NO API KEY\n`);

  const pending = getPending();
  console.log(`Pending: ${pending} (min: ${MIN_PENDING})`);

  if (pending >= MIN_PENDING) {
    console.log(`✓ Queue healthy — no refill needed`);
    logRun(0, pending);
    console.log('══════════════════════════════════════════════\n');
    return;
  }

  const needed = Math.max(BATCH_SIZE, MIN_PENDING - pending);
  console.log(`⚡ Generating ${needed} new topics...\n`);

  const data = readTopics();
  const existingSlugs = getExistingSlugs();
  const runSeed = Date.now();
  const generated = [];

  let attempts = 0;
  while (generated.length < needed && attempts < needed * 15) {
    attempts++;
    const m = MERCHANTS[(runSeed + attempts * 31) % MERCHANTS.length];
    const titleTemplate = m.topics[(runSeed + attempts * 17) % m.topics.length];
    const topic = buildTopic(m, titleTemplate, runSeed + attempts);

    if (existingSlugs.has(topic.slug)) continue;
    existingSlugs.add(topic.slug);
    generated.push(topic);
  }

  data.topics.push(...generated);
  data.meta.total = data.topics.length;
  data.meta.last_updated = TODAY;
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(data, null, 2));

  const newPending = data.topics.filter(t => !t.published).length;
  logRun(generated.length, newPending);

  console.log(`✅ Done!`);
  console.log(`  Added   : ${generated.length} topics`);
  console.log(`  Total   : ${data.topics.length}`);
  console.log(`  Pending : ${newPending}`);
  console.log(`  Sample  : "${generated[0]?.title_en}"`);
  console.log('══════════════════════════════════════════════\n');
}

main();
