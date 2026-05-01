#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB AUTO-TOPIC-GENERATOR v2.2
//  NO API KEY REQUIRED — generates from built-in templates
//  Run: node auto-topic-generator.js
//
//  Reads post-topics.json, refills queue when below MIN_PENDING
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
//  v2.2: all lc= codes corrected, bgmgirl + buildasign removed,
//        MIN_PENDING raised to 50
// ═══════════════════════════════════════════════════════════════════════

const fs = require('fs');

const TOPICS_FILE = 'post-topics.json';
const LOG_FILE    = 'topic-generator-log.json';
const MIN_PENDING = 50;
const BATCH_SIZE  = 30;
const TODAY       = new Date().toISOString().slice(0, 10);
const YEAR        = new Date().getFullYear();

const MERCHANTS = [
  // TAX (3)
  { id:'gh-efile',lc:'007949053489005142',name:'E-file.com',cat:'Tax',slug:'efile-vs-turbotax-2026',topics:['E-file.com Review {year}: Cheaper Than TurboTax?','How to File Federal Taxes Online in {year} for Under $25','E-file.com vs TurboTax: Which Is Best in {year}?','IRS-Authorized Tax Filing: What You Need to Know in {year}','Best Cheap Tax Filing Options {year}: Honest Comparison'] },
  { id:'gh-etax',lc:'007949136603007653',name:'E TAX LLC',cat:'Tax',slug:'etax-llc-tax-filing-2026',topics:['Best Online Tax Prep for Self-Employed in {year}','E TAX LLC Review: Is It Worth It in {year}?','Small Business Tax Filing Online: Top Options {year}','File 1040 Online Free in {year}: Step-by-Step Guide'] },
  { id:'gh-taxextension',lc:'007949121281006198',name:'TaxExtension.com',cat:'Tax',slug:'tax-extension-deadline-guide-2026',topics:['How to File a Tax Extension in 5 Minutes ({year})','Tax Extension Deadline {year}: Complete Guide','Form 4868 Online: File Your IRS Extension Today','What Happens If You Miss the Tax Deadline in {year}?','Tax Extension vs Filing Late: Which Is Better?'] },
  // SOFTWARE (19)
  { id:'gh-nordvpn',lc:'007949079282005891',name:'NordVPN',cat:'Software',slug:'nordvpn-review-2026',topics:['NordVPN Review {year}: Still the Best VPN?','Does NordVPN Work With Netflix in {year}?','NordVPN vs ExpressVPN vs Surfshark: Best VPN in {year}?','Best VPN for Streaming in {year}: Tested and Ranked','Is NordVPN Worth the Price in {year}?','Best VPN for Gaming {year}: Low Latency Tested'] },
  { id:'gh-filmora',lc:'007949048607004532',name:'Wondershare Filmora',cat:'Software',slug:'filmora-ai-features-2026',topics:['Filmora Review {year}: Best Video Editor for YouTube?','Filmora vs Premiere Pro: Which Is Better in {year}?','How to Add Auto-Subtitles With Filmora AI in {year}','Best AI Video Editors in {year}: Full Comparison','Filmora vs DaVinci Resolve {year}: Which Should You Use?'] },
  { id:'gh-pdfelement',lc:'007949165237004532',name:'Wondershare PDFelement',cat:'Software',slug:'pdfelement-vs-acrobat-2026',topics:['PDFelement Review {year}: Best Acrobat Alternative?','Best One-Time Purchase PDF Editors in {year}','How to Edit PDFs Without Adobe (Save $200/Year)','PDFelement vs Adobe vs UPDF: Which Wins in {year}?'] },
  { id:'gh-sidify',lc:'007949114494007306',name:'Sidify Inc.',cat:'Software',slug:'sidify-spotify-converter-2026',topics:['Sidify Review {year}: Convert Spotify to MP3 — Legit?','How to Convert Spotify Songs to MP3 in {year}','Best Spotify Music Converters in {year}: Compared','Listen to Spotify Offline Without Premium in {year}'] },
  { id:'gh-movavi',lc:'007949108972006513',name:'Movavi Software',cat:'Software',slug:'movavi-video-editor-2026',topics:['Movavi Review {year}: Best No-Subscription Video Editor?','Best Video Editors With No Subscription in {year}','Movavi vs Filmora: Which Should You Buy in {year}?','Edit 4K Video on Windows Without Subscription {year}'] },
  { id:'gh-tenorshare',lc:'007949139287006847',name:'Tenorshare',cat:'Software',slug:'tenorshare-iphone-tools-2026',topics:['How to Recover Deleted iPhone Photos in {year}','Tenorshare ReiBoot Review: Fix iOS Without iTunes','Best iPhone Data Recovery Software {year}: Ranked','How to Unlock a Disabled iPhone in {year}'] },
  { id:'gh-appypie',lc:'007949090967005541',name:'Appy Pie',cat:'Software',slug:'appy-pie-no-code-tools-2026',topics:['Appy Pie Review {year}: Build Apps Without Coding?','Best No-Code App Builders in {year}: Compared','How to Build a Mobile App Without Coding in {year}','Best AI Chatbot Builders {year}: No Code Required'] },
  { id:'gh-updf',lc:'007949154707007728',name:'UPDF (Superace)',cat:'Software',slug:'updf-pdf-editor-review-2026',topics:['UPDF Review {year}: The AI PDF Editor That Beats Acrobat?','Best AI PDF Editors in {year}: UPDF vs PDFelement vs Acrobat','How to Summarize PDFs With AI in {year}','UPDF vs PDFelement {year}: Which Is Worth Buying?'] },
  { id:'gh-itoolab',lc:'007949110667007185',name:'iToolab (LuckyDog)',cat:'Software',slug:'itoolab-iphone-manager-2026',topics:['iToolab Review {year}: Best iPhone Unlock Software?','How to Unlock a Disabled iPhone in {year} Without Data Loss','Transfer WhatsApp from iPhone to Android {year}','iToolab AnyUnlock Review {year}: Does It Really Work?'] },
  { id:'gh-famisafe',lc:'007949097766006788',name:'FamiSafe (Wondershare)',cat:'Software',slug:'famisafe-parental-control-2026',topics:['FamiSafe Review {year}: Best Parental Control App?','FamiSafe vs Qustodio {year}: Which Parental Control Wins?','Best Parental Control Apps for iPhone {year}: Ranked','Limit Screen Time for Kids: Best Apps {year}'] },
  { id:'gh-depositphotos',lc:'007949040357004687',name:'Depositphotos',cat:'Software',slug:'depositphotos-review-2026',topics:['Depositphotos Review {year}: Best Shutterstock Alternative?','Cheapest Stock Photo Sites in {year}: Full Comparison','How to Get Royalty-Free Images for Commercial Use in {year}','Depositphotos vs Shutterstock {year}: Which Is Cheaper?'] },
  { id:'gh-edraw',lc:'007949165147006886',name:'Edraw (Mind/Max)',cat:'Software',slug:'edraw-mind-map-review-2026',topics:['Best Visio Alternative in {year}: EdrawMax Reviewed','Mind Mapping Software {year}: Which Is Worth Buying?','How to Create Professional Diagrams Without Visio','Edraw vs Lucidchart {year}: Best Diagramming Tool?'] },
  { id:'gh-iskysoft',lc:'007949080054005679',name:'iSkysoft Software',cat:'Software',slug:'iskysoft-review-2026',topics:['iSkysoft Video Converter Review {year}: Worth It?','Best Video Converter for Mac {year}: No Quality Loss','iSkysoft vs Handbrake {year}: Which Converts Better?','Convert MKV to MP4 on Mac in {year}: Best Tools'] },
  { id:'gh-jalbum',lc:'007949135821007664',name:'jAlbum AB',cat:'Software',slug:'jalbum-photo-gallery-2026',topics:['jAlbum Review {year}: Build Photo Websites Without Coding?','Best Photo Gallery Website Builders in {year}','How to Create a Self-Hosted Photo Gallery {year}','jAlbum vs Smugmug {year}: Which Is Worth Paying For?'] },
  { id:'gh-renoise',lc:'007949165071007995',name:'Renoise',cat:'Software',slug:'renoise-music-production-2026',topics:['Renoise Review {year}: Best Tracker DAW for Electronic Music?','Best DAWs With One-Time Purchase in {year}','Renoise vs Ableton {year}: Which DAW Is Right for You?'] },
  { id:'gh-picador',lc:'007949164712007982',name:'Picador Multimedia',cat:'Software',slug:'picador-multimedia-review-2026',topics:['Picador Multimedia Review {year}: Best Affordable Screen Recorder?','Best Cheap Screen Recording Software {year}: Compared','Video Annotation Software {year}: Best Options Reviewed'] },
  { id:'gh-youware',lc:'007949164733007981',name:'YouWare',cat:'Software',slug:'youware-review-2026',topics:['YouWare Review {year}: Best AI Creative Suite?','Best Content Creator Tools {year}: What Actually Works','YouWare vs Canva {year}: Which Creative Platform Wins?'] },
  { id:'gh-individualsoftware',lc:'007949046073005238',name:'Individual Software',cat:'Software',slug:'individual-software-review-2026',topics:['Best Typing Software for Adults {year}: Full Review','Mavis Beacon Alternative {year}: What Replaced It?','How to Improve Typing Speed in {year}: Best Programs'] },
  // EDUCATION (10)
  { id:'gh-boardvitals',lc:'007949124366007614',name:'BoardVitals',cat:'Education',slug:'boardvitals-medical-exam-prep-2026',topics:['BoardVitals Review {year}: Best USMLE and NCLEX Question Bank?','USMLE Step 2 Study Guide {year}: Pass on the First Try','Best NCLEX Question Banks {year}: BoardVitals vs UWorld','BoardVitals vs UWorld {year}: Which Qbank Is Worth It?'] },
  { id:'gh-surgent',lc:'007949138896006249',name:'Surgent CPA',cat:'Education',slug:'surgent-cpa-exam-prep-2026',topics:['Surgent CPA Review {year}: Pass the CPA Exam 40% Faster?','CPA Exam Prep {year}: Surgent vs Becker vs Wiley','How to Pass the CPA Exam Faster With AI Study Plans','Cheapest CPA Review Course {year}: Which Is Worth It?'] },
  { id:'gh-pmtraining',lc:'007949081796006139',name:'SSI Logic (PMTraining)',cat:'Education',slug:'pm-training-pmp-2026',topics:['PMP Certification {year}: Complete Guide to Getting Certified','PM Training Review: Is the 98% Pass Rate Real?','How to Get PMP Certified in {year}: Step by Step','PMP vs Prince2 {year}: Which Certification Is Worth More?'] },
  { id:'gh-learntasticcpr',lc:'007949103653006955',name:'LearnTastic CPR',cat:'Education',slug:'learntastic-cpr-certification-2026',topics:['Online CPR Certification in {year}: What Employers Accept','How to Get CPR Certified Online in 90 Minutes','Best Online CPR Courses in {year}: Compared','Is Online CPR Certification Valid in {year}?'] },
  { id:'gh-securitiesinstitute',lc:'007949108329007101',name:'The Securities Institute',cat:'Education',slug:'securities-institute-exam-prep-2026',topics:['How to Pass the Series 7 Exam in {year}: Full Study Guide','Securities Institute Review: Best FINRA Exam Prep?','Series 7 vs Series 63: Which License Do You Need?','FINRA SIE Exam Prep {year}: Best Study Materials'] },
  { id:'gh-illumeo',lc:'007949104078006849',name:'Illumeo, Inc.',cat:'Education',slug:'illumeo-professional-development-2026',topics:['Illumeo Review {year}: Cheapest NASBA-Approved CPE?','How to Get CPE Credits Online for Your CPA License in {year}','Self-Study CPE Courses {year}: Best Options for CPAs'] },
  { id:'gh-hrcp',lc:'007949120619007379',name:'HRCP',cat:'Education',slug:'hrcp-hr-certification-2026',topics:['HRCP Review {year}: Best PHR Certification Prep?','How to Pass the PHR Exam in {year}: Complete Guide','PHR vs SPHR: Which HR Certification Should You Get?','Is PHR Certification Worth It in {year}?'] },
  { id:'gh-oakstone',lc:'007949049546004978',name:'Oakstone Medical',cat:'Education',slug:'oakstone-cme-review-2026',topics:['Oakstone Medical Review {year}: Best Audio CME for Physicians?','How to Get CME Credits During Your Commute in {year}','ABFM Board Review {year}: Best Study Resources'] },
  { id:'gh-wolterskluwer',lc:'007949165370003224',name:'Wolters Kluwer (LWW)',cat:'Education',slug:'wolters-kluwer-medical-books-2026',topics:['Where to Buy Lippincott Nursing Textbooks at the Lowest Price','Best Medical Textbooks for Nursing Students in {year}','Nursing Drug Handbook {year}: Best Reference for Nurses'] },
  { id:'gh-learntasticahca',lc:'007949047416004897',name:'LearnTastic AHCA',cat:'Education',slug:'learntastic-ahca-review-2026',topics:['HIPAA Certification Online in {year}: Fast and Employer-Accepted','OSHA Healthcare Training Online: What You Need in {year}','Healthcare Compliance Training {year}: What Employers Require'] },
  // PET CARE (5)
  { id:'gh-canadapetcare',lc:'007949139296006219',name:'CanadaPetCare.com',cat:'Pet Care',slug:'canada-pet-care-vs-vet-2026',topics:['Buy NexGard Online Canada: Save 20-40% vs Your Vet','CanadaPetCare Review {year}: Safe and Legit?','Best Canadian Online Pet Pharmacies in {year}','Heartgard Plus Canada: Buy Online for Less in {year}'] },
  { id:'gh-budgetpetcare',lc:'007949144117006217',name:'BudgetPetCare.com',cat:'Pet Care',slug:'budget-pet-care-guide-2026',topics:['How to Save 30-50% on Pet Medications in {year}','BudgetPetCare Review {year}: Legit or Not?','Cheapest Flea and Tick Prevention Options in {year}','Cheapest Heartworm Prevention for Dogs {year}'] },
  { id:'gh-bestvetcare',lc:'007949154901006218',name:'BestVetCare.com',cat:'Pet Care',slug:'bestvetcare-review-2026',topics:['BestVetCare Review {year}: Cheap Pet Meds — Is It Safe?','Frontline Plus Online: Where to Buy Cheap in {year}','Best Online Pet Pharmacy {year}: Full Comparison'] },
  { id:'gh-discountpetcare',lc:'007949161266007847',name:'DiscountPetCare',cat:'Pet Care',slug:'discountpetcare-review-2026',topics:['DiscountPetCare Review {year}: Genuine Discount or Not?','Best Discount Pet Medication Sites in {year}: Compared','Is DiscountPetCare Legit in {year}? We Investigated'] },
  { id:'gh-budgetpetworld',lc:'007949145753006206',name:'BudgetPetWorld.com',cat:'Pet Care',slug:'budgetpetworld-review-2026',topics:['BudgetPetWorld Review {year}: International Pet Pharmacy?','Cheapest Pet Supplies Online That Ship Internationally','Pet Medications Without a Vet Prescription {year}: What Is Legal?'] },
  // HEALTH (5)
  { id:'gh-personalabs',lc:'007949146929007736',name:'Personalabs',cat:'Health',slug:'personalabs-lab-tests-2026',topics:['How to Order a Blood Test Without a Doctor in {year}','Personalabs Review {year}: Direct Lab Testing — Accurate?','Best Direct-to-Consumer Lab Testing Services in {year}','STD Test Without a Doctor {year}: Best Online Options'] },
  { id:'gh-ayurvedaexperience',lc:'007949126292007580',name:'The Ayurveda Experience',cat:'Health',slug:'ayurveda-experience-review-2026',topics:['Ashwagandha in {year}: What the Research Actually Shows','The Ayurveda Experience Review {year}: Worth It?','Best Ashwagandha Supplements in {year}: Ranked','Is Ashwagandha Safe to Take Daily in {year}?'] },
  { id:'gh-nursejamie',lc:'007949155036007841',name:'Nurse Jamie',cat:'Health',slug:'nurse-jamie-review-2026',topics:['Nurse Jamie Review {year}: Are the Skincare Tools Worth It?','Best At-Home Beauty Devices for {year}: Expert Picks','Nurse Jamie Uplift Massager Review {year}: Does It Work?'] },
  { id:'gh-infinitealoe',lc:'007949155212007855',name:'InfiniteAloe',cat:'Health',slug:'infinitealoe-skincare-review-2026',topics:['InfiniteAloe Review {year}: Best Aloe Vera Skincare?','Best Aloe Vera Moisturizer {year}: What to Buy','All-Natural Skincare Without Parabens {year}: Best Brands'] },
  { id:'gh-fieldtex',lc:'007949044236004764',name:'Fieldtex Products',cat:'Health',slug:'fieldtex-first-aid-2026',topics:['Custom First Aid Kits for Workplaces in {year}: Complete Guide','Fieldtex Products Review {year}: Worth It?','OSHA-Compliant First Aid Kits {year}: What You Need'] },
  // AUTO (3)
  { id:'gh-maxpeedingrodsus',lc:'007949105959006539',name:'Maxpeedingrods (US)',cat:'Auto',slug:'maxpeedingrods-review-2026',topics:['Maxpeedingrods Coilovers Review {year}: Budget Worth It?','Best Budget Coilovers Under $500 in {year}: Tested','How to Lower Your Car on a Budget in {year}','Are Maxpeedingrods Coilovers Any Good? {year} Truth'] },
  { id:'gh-maxpeedingrodsau',lc:'007949101800006908',name:'Maxpeedingrods (AU)',cat:'Auto',slug:'maxpeedingrods-au-review-2026',topics:['Best Budget Coilovers Australia in {year}: Full Review','Maxpeedingrods Australia Review {year}: Worth It?','Cheap Suspension Upgrade Australia {year}: Best Options'] },
  { id:'gh-lafuente',lc:'007949034143001545',name:'La Fuente Imports',cat:'Auto',slug:'la-fuente-imports-review-2026',topics:['Best Mexican Folk Art Online in {year}: Where to Buy','La Fuente Imports Review {year}: Authentic or Not?','Talavera Pottery Online {year}: Best US Sources'] },
  // PRINT (5)
  { id:'gh-easycanvasprints',lc:'007949043935004760',name:'Easy Canvas Prints',cat:'Print',slug:'easy-canvas-prints-guide-2026',topics:['Easy Canvas Prints Review {year}: Best Color Accuracy?','Best Canvas Print Sites in {year}: Compared','Canvas Prints as Gifts in {year}: Complete Buyer Guide','Easy Canvas Prints vs Shutterfly {year}: Which Is Better?'] },
  { id:'gh-etchingexpressions',lc:'007949027749003958',name:'Etching Expressions',cat:'Print',slug:'etching-expressions-gifts-2026',topics:['Custom Engraved Gifts {year}: Complete Buyer Guide','Best Laser Engraving Gift Sites in {year}: Compared','Corporate Engraved Gifts Bulk in {year}: What to Know','Laser Engraved Glassware Bulk {year}: Corporate Gift Guide'] },
  { id:'gh-bannersonthecheap',lc:'007949076672005837',name:'BannersOnTheCheap',cat:'Print',slug:'banners-on-the-cheap-guide-2026',topics:['BannersOnTheCheap Review {year}: Actually the Cheapest?','How to Order Cheap Vinyl Banners Online in {year}','Outdoor Vinyl Banner {year}: Best Weather-Resistant Options'] },
  { id:'gh-canvasonthecheap',lc:'007949084965006216',name:'CanvasOnTheCheap',cat:'Print',slug:'canvas-on-the-cheap-guide-2026',topics:['CanvasOnTheCheap Review {year}: Cheapest Canvas Prints?','How to Get Canvas Prints on Sale in {year}','Canvas on the Cheap vs Easy Canvas Prints {year}: Which Wins?'] },
  { id:'gh-ryonet',lc:'007949155911007876',name:'Ryonet',cat:'Print',slug:'ryonet-screen-printing-2026',topics:['Ryonet Review {year}: Best Screen Printing Supplies?','How to Start Screen Printing in {year}: Beginner Guide','Screen Printing vs Heat Transfer {year}: Which Is Better?'] },
  // HARDWARE (4)
  { id:'gh-trademarkhardware',lc:'007949113406007272',name:'Trademark Hardware',cat:'Hardware',slug:'trademark-hardware-guide-2026',topics:['Best Online Hardware Stores in {year}: Trademark Hardware Reviewed','Where to Buy Home Improvement Parts Online in {year}','Trademark Hardware vs Grainger {year}: Which Is Cheaper?'] },
  { id:'gh-trademarksoundproofing',lc:'007949107911007070',name:'Trademark Soundproofing',cat:'Hardware',slug:'soundproofing-guide-2026',topics:['How to Soundproof a Room on a Budget in {year}','Best Soundproofing Materials in {year}: What Actually Works?','Home Studio Soundproofing Guide {year}','Mass Loaded Vinyl Soundproofing {year}: Is It Worth It?'] },
  { id:'gh-warehouse115',lc:'007949102471006776',name:'Warehouse 115',cat:'Hardware',slug:'warehouse115-review-2026',topics:['Warehouse 115 Review {year}: Best Wholesale Products Online?','Buying Wholesale Products Online in {year}: Full Guide','Industrial Supplies Online Cheap {year}: Where to Buy'] },
  { id:'gh-productsonthego',lc:'007949137847007124',name:'Products On The Go',cat:'Hardware',slug:'products-on-the-go-2026',topics:['Best Travel Products for Professionals in {year}','Products On The Go Review {year}','Portable Tech Accessories {year}: Best Picks for Remote Workers'] },
  // LIFESTYLE (17)
  { id:'gh-halloweencostumes',lc:'007949047396004909',name:'HalloweenCostumes.com',cat:'Lifestyle',slug:'halloween-costumes-guide-2026',topics:['Best Halloween Costumes of {year}: Top Trends','Halloween Couples Costumes {year}: 50 Creative Ideas','When to Order Halloween Costumes Online in {year}','Last-Minute Halloween Costumes {year}: Ships in 2-3 Days','Kids Halloween Costumes {year}: Best Picks by Age','Plus Size Halloween Costumes {year}: Best Options'] },
  { id:'gh-surveyjunkie',lc:'007949153848007834',name:'Survey Junkie',cat:'Lifestyle',slug:'surveyjunkie-earn-online-2026',topics:['Survey Junkie Review {year}: How Much Can You Really Earn?','Is Survey Junkie Legit in {year}? We Cashed Out $200','Best Paid Survey Sites in {year}: Full Honest Comparison','Survey Junkie vs Swagbucks {year}: Which Pays More?'] },
  { id:'gh-graeters',lc:'007949155896007874',name:"Graeter's Ice Cream",cat:'Lifestyle',slug:'graeter-ice-cream-delivery-2026',topics:["Graeter's Ice Cream Review: Is It Worth Shipping?",'Best Ice Cream You Can Ship Nationwide in {year}',"Why Graeter's Black Raspberry Chip Is a Cult Favorite"] },
  { id:'gh-carmellimo',lc:'007949021363003587',name:'Carmel Car & Limo',cat:'Lifestyle',slug:'carmel-limo-service-2026',topics:['Carmel Car Service Review {year}: Best NYC Airport Transfer?','Uber Black vs Car Service NYC in {year}: Which Is Better?','Best Car Service JFK Airport {year}: Compared'] },
  { id:'gh-tastyribbon',lc:'007949155938007865',name:'Tasty Ribbon',cat:'Lifestyle',slug:'tasty-ribbon-food-gifts-2026',topics:['Best Gourmet Food Gift Baskets in {year}: Compared','Tasty Ribbon Review {year}: Corporate Food Gifts Worth It?','Best Corporate Food Gifts in {year}: What to Order'] },
  { id:'gh-combatflipflops',lc:'007949108439006486',name:'Combat Flip Flops',cat:'Lifestyle',slug:'combat-flip-flops-mission-2026',topics:['Combat Flip Flops Review {year}: Mission-Driven or Marketing?','Best Ethical Footwear Brands in {year}: Ranked','Veteran-Owned Shoe Brands {year}: Who to Support'] },
  { id:'gh-camanoislandcoffee',lc:'007949063057005492',name:'Camano Island Coffee',cat:'Lifestyle',slug:'camano-island-coffee-review-2026',topics:['Best Fair Trade Coffee Subscriptions in {year}: Compared','Camano Island Coffee Review {year}: Freshest by Mail?','Best Organic Coffee Subscription {year}: What to Order'] },
  { id:'gh-gunsinternational',lc:'007949050767005020',name:'GunsInternational',cat:'Lifestyle',slug:'gunsinternational-marketplace-2026',topics:['GunsInternational Review {year}: Best Firearms Marketplace?','How to Buy Guns Online Legally in {year}: Complete Guide','GunsInternational vs GunBroker {year}: Which Is Better?'] },
  { id:'gh-thechessstore',lc:'007949071778005057',name:'The Chess Store',cat:'Lifestyle',slug:'chess-store-buying-guide-2026',topics:['Best Chess Sets Online in {year}: Complete Buyer Guide','The Chess Store Review {year}: Legit?','Best Beginner Chess Set {year}: What to Buy First','Staunton Chess Pieces {year}: Best Sets by Budget'] },
  { id:'gh-museumreplicas',lc:'007949069873005391',name:'MuseumReplicas.com',cat:'Lifestyle',slug:'museum-replicas-collectibles-2026',topics:['Best Historical Sword Sites in {year}: MuseumReplicas Reviewed','LARP Weapons in {year}: Where to Buy Quality Gear','Medieval Replica Weapons {year}: Complete Buyer Guide'] },
  { id:'gh-atlantacutlery',lc:'007949069833005389',name:'Atlanta Cutlery Corp.',cat:'Lifestyle',slug:'atlanta-cutlery-review-2026',topics:['Atlanta Cutlery Review {year}: Best Collectible Knife Site?','Where to Buy Historical Swords Online in {year}','Bowie Knife Collector {year}: Best Grades Explained'] },
  { id:'gh-vipertec',lc:'007949091308006550',name:'Viper Tec Inc.',cat:'Lifestyle',slug:'vipertec-tactical-knives-2026',topics:['Viper Tec Review {year}: Best Tactical Knives Online?','Best EDC Knives Under $100 in {year}: Compared','Best OTF Knife {year}: What to Know Before You Buy'] },
  { id:'gh-bugatchi',lc:'007949094561006921',name:'Bugatchi',cat:'Lifestyle',slug:'bugatchi-mens-fashion-2026',topics:['Bugatchi Shirts Review {year}: Worth the Premium Price?','Best Bold Pattern Mens Shirts in {year}: Ranked','Bugatchi vs Tommy Bahama {year}: Which Is Worth Buying?'] },
  { id:'gh-readygolf',lc:'007949135537007633',name:'ReadyGolf',cat:'Lifestyle',slug:'readygolf-guide-2026',topics:['Best Golf Accessories Online in {year}: ReadyGolf Reviewed','Custom Golf Gifts in {year}: Where to Buy','Best Golf Gifts for Dad {year}: What to Order'] },
  { id:'gh-incentrev',lc:'007949151790007794',name:'Incentrev',cat:'Lifestyle',slug:'incentrev-rewards-2026',topics:['Incentrev Review {year}: Best Business Loyalty Platform?','Employee Incentive Programs in {year}: What Actually Works','B2B Partner Incentive Programs {year}: What to Look For'] },
];

function buildTopic(merchant, titleTemplate, seed) {
  const title = titleTemplate.replace(/{year}/g, YEAR);
  const slug  = title.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,70) + '-' + (seed % 10000);
  return {
    slug, merchant: merchant.id, lc: merchant.lc, published: false, publishedDate: null,
    title_en: title, category_en: merchant.cat,
    metaDesc_en: `${title} — verified deals and honest reviews at GlobalCampaignHub.`,
    keywords_en: `${merchant.name.toLowerCase()}, ${merchant.cat.toLowerCase()}, review ${YEAR}, globalcampaignhub`,
    intro_en: `Looking for the best deal on ${merchant.name}? This guide covers everything you need to know in ${YEAR}.`,
    callout_en: `Verified merchant through LinkConnector Account 007949 (${merchant.id}). No extra cost to you.`,
    h2a_en: `What Is ${merchant.name}?`,
    body1_en: `${merchant.name} is a verified ${merchant.cat} merchant through LinkConnector (Account 007949, atid: ${merchant.id}). This guide helps you compare options and make the right call.`,
    bullets_en: [
      `Verified through LinkConnector 007949`,
      `Tracked with ${merchant.id} (LC: ${merchant.lc})`,
      `Available in 20 languages on GlobalCampaignHub`,
      `Affiliate disclosure: commission earned at no extra cost to you`,
      `Updated for ${YEAR}`,
      `Honest pros and cons included`,
    ],
    verdict_title_en: `${merchant.name} — Our ${YEAR} Verdict`,
    verdict_desc_en: `${merchant.name} delivers solid value in the ${merchant.cat} category. Compare with alternatives before deciding.`,
    h2b_en: `How to Get the Best Price on ${merchant.name}`,
    body2_en: `Click our verified affiliate link to access the current best offer. Tracked with ${merchant.id} through LinkConnector Account 007949. LC code: ${merchant.lc}.`,
    cta_en: `Visit ${merchant.name} →`, cta2_en: `Read Full Buyer Guide`,
    faqs_en: [
      { q: `Is ${merchant.name} a verified merchant?`, a: `Yes — verified through LinkConnector Account 007949 with tracking ID ${merchant.id} (LC: ${merchant.lc}).` },
      { q: `Is GlobalCampaignHub free to use?`, a: `Yes, completely free. We earn a commission on purchases through our links at no additional cost to you.` },
      { q: `What languages are buyer guides available in?`, a: `20 languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, and more.` },
    ],
  };
}

function loadLog() {
  if (!fs.existsSync(LOG_FILE)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    if (Array.isArray(raw)) { const o = {}; raw.forEach(e => { if (e.date) o[e.date] = e; }); return o; }
    return raw;
  } catch(e) { return {}; }
}

function logRun(generated, pending) {
  const log = loadLog();
  log[TODAY] = { date: TODAY, generated, pending_after: pending, timestamp: new Date().toISOString(), merchants: MERCHANTS.length };
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

function getPending() {
  if (!fs.existsSync(TOPICS_FILE)) return 0;
  try { return JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8')).topics.filter(t => !t.published).length; } catch(e) { return 0; }
}

function readTopics() {
  if (!fs.existsSync(TOPICS_FILE)) return { meta: { total: 0, last_updated: TODAY }, topics: [] };
  try { return JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8')); } catch(e) { return { meta: { total: 0, last_updated: TODAY }, topics: [] }; }
}

function getExistingSlugs() {
  if (!fs.existsSync(TOPICS_FILE)) return new Set();
  try { return new Set(JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8')).topics.map(t => t.slug)); } catch(e) { return new Set(); }
}

function main() {
  console.log('\n📝 GLOBALCAMPAIGNHUB AUTO-TOPIC-GENERATOR v2.2');
  console.log('══════════════════════════════════════════════');
  console.log(`Account: 007949 | Date: ${TODAY} | Merchants: ${MERCHANTS.length} | No API key needed\n`);

  const pending = getPending();
  console.log(`Pending topics: ${pending} (min threshold: ${MIN_PENDING})`);

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
  data.meta = data.meta || {};
  data.meta.total = data.topics.length;
  data.meta.last_updated = TODAY;
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(data, null, 2));

  const newPending = data.topics.filter(t => !t.published).length;
  logRun(generated.length, newPending);

  console.log(`✅ Done!`);
  console.log(`  Added   : ${generated.length} topics`);
  console.log(`  Total   : ${data.topics.length}`);
  console.log(`  Pending : ${newPending}`);
  if (generated[0]) console.log(`  Sample  : "${generated[0].title_en}"`);
  console.log('══════════════════════════════════════════════\n');
}

main();
