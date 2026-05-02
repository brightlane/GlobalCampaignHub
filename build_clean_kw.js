#!/usr/bin/env node
/**
 * Builds clean keywords-1000.json:
 * - Removes gh-buildasign and gh-bgmgirl
 * - Fixes all LC codes to match index.html (source of truth)
 */

// Source of truth LC codes — from index.html linkconnector hrefs
const CORRECT_LC = {
  "gh-graeters":             "007949155896007874",
  "gh-tastyribbon":          "007949155938007865",
  "gh-camanoislandcoffee":   "007949063057005492",
  "gh-individualsoftware":   "007949046073005238",
  "gh-jalbum":               "007949135821007664",
  "gh-sidify":               "007949114494007306",
  "gh-appypie":              "007949090967005541",
  "gh-youware":              "007949164733007981",
  "gh-movavi":               "007949108972006513",
  "gh-filmora":              "007949048607004532",
  "gh-iskysoft":             "007949080054005679",
  "gh-edraw":                "007949165147006886",
  "gh-trademarksoundproofing":"007949107911007070",
  "gh-readygolf":            "007949135537007633",
  "gh-renoise":              "007949165071007995",
  "gh-taxextension":         "007949121281006198",
  "gh-etax":                 "007949136603007653",
  "gh-efile":                "007949053489005142",
  "gh-surveyjunkie":         "007949153848007834",
  "gh-infinitealoe":         "007949155212007855",
  "gh-nursejamie":           "007949155036007841",
  "gh-ayurvedaexperience":   "007949126292007580",
  "gh-tenorshare":           "007949139287006847",
  "gh-famisafe":             "007949097766006788",
  "gh-canvasonthecheap":     "007949084965006216",
  "gh-easycanvasprints":     "007949043935004760",
  "gh-etchingexpressions":   "007949027749003958",
  "gh-depositphotos":        "007949040357004687",
  "gh-personalabs":          "007949146929007736",
  "gh-halloweencostumes":    "007949047396004909",
  "gh-ryonet":               "007949155911007876",
  "gh-carmellimo":           "007949021363003587",
  "gh-combatflipflops":      "007949108439006486",
  "gh-maxpeedingrodsau":     "007949101800006908",
  "gh-maxpeedingrodsus":     "007949105959006539",
  "gh-productsonthego":      "007949108750007124",
  "gh-nordvpn":              "007949079282005891",
  "gh-pmtraining":           "007949081796006139",
  "gh-surgent":              "007949138896006249",
  "gh-securitiesinstitute":  "007949108329007101",
  "gh-oakstone":             "007949049546004978",
  "gh-picador":              "007949164712007982",
  "gh-hrcp":                 "007949120619007379",
  "gh-illumeo":              "007949104078006849",
  "gh-lafuente":             "007949034143001545",
  "gh-trademarkhardware":    "007949113406007272",
  "gh-warehouse115":         "007949102471006776",
  "gh-fieldtex":             "007949044236004764",
  "gh-museumreplicas":       "007949069873005391",
  "gh-thechessstore":        "007949071778005057",
  "gh-gunsinternational":    "007949050767005020",
  "gh-vipertec":             "007949091308006550",
  "gh-atlantacutlery":       "007949069833005389",
  "gh-bestvetcare":          "007949154901006218",
  "gh-boardvitals":          "007949124366007614",
  "gh-budgetpetcare":        "007949144117006217",
  "gh-budgetpetworld":       "007949145753006206",
  "gh-canadapetcare":        "007949139296006219",
  "gh-discountpetcare":      "007949161266007847",
  "gh-bannersonthecheap":    "007949076672005837",
  "gh-bugatchi":             "007949094561006921",
  "gh-incentrev":            "007949151790007794",
  "gh-updf":                 "007949147521007728",
  "gh-pdfelement":           "007949139355006776",
  "gh-wolterskluwer":        "007949019993003224",
  "gh-learntasticahca":      "007949146929007736",
  "gh-learntasticcpr":       "007949155036007841",
};

const DROP = new Set(["gh-buildasign", "gh-bgmgirl"]);

const fs = require('fs');
const inputPath = process.argv[2] || 'keywords-1000.json';
const outputPath = process.argv[3] || 'keywords-1000-clean.json';

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

let dropped = 0, fixed = 0, kept = 0, unknown = 0;
const clean = [];

for (const kw of raw) {
  // Drop dead merchants
  if (DROP.has(kw.merchant)) { dropped++; continue; }

  const correctLC = CORRECT_LC[kw.merchant];
  if (!correctLC) {
    console.warn(`WARN: no LC mapping for merchant "${kw.merchant}" — keeping original LC`);
    clean.push(kw);
    unknown++;
    continue;
  }

  const entry = { ...kw, lc: correctLC };
  if (kw.lc !== correctLC) fixed++;
  else kept++;
  clean.push(entry);
}

fs.writeFileSync(outputPath, JSON.stringify(clean, null, 2));

console.log(`\n✅ keywords-1000-clean.json built`);
console.log(`   Input:   ${raw.length} keywords`);
console.log(`   Dropped: ${dropped} (buildasign + bgmgirl)`);
console.log(`   LC fixed: ${fixed}`);
console.log(`   Correct:  ${kept}`);
console.log(`   Unknown merchants: ${unknown}`);
console.log(`   Output:  ${clean.length} keywords → ${outputPath}`);

// Show merchant summary
const merchants = {};
clean.forEach(k => { merchants[k.merchant] = (merchants[k.merchant]||0)+1; });
console.log(`\n   Merchants: ${Object.keys(merchants).length}`);
Object.entries(merchants).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([m,c])=>
  console.log(`     ${m}: ${c} keywords`)
);
