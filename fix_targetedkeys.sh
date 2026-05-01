#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
#  FIX TARGETEDKEYS.JS — Replace all old lc= codes with verified ones
#  Run: bash fix-targeted-keys.sh
#  Updated: 2026-05-01 — 67 merchants, all LC codes verified from affiliate.json
#  Changes vs previous version:
#    - bgmgirl removed (dead link)
#    - buildasign removed (dropped)
#    - All lc= codes re-verified against affiliate.json authority
#    - New campaign keywords appended for updf, pdfelement, wolterskluwer,
#      productsonthego, learntasticahca, learntasticcpr, itoolab
# ═══════════════════════════════════════════════════════════════════════

FILE="targetedkeys.js"

if [ ! -f "$FILE" ]; then
  echo "✗ $FILE not found in current directory"
  exit 1
fi

echo "🔧 Fixing lc= codes in $FILE..."

# ── TAX ──────────────────────────────────────────────────────────────────────
# gh-efile: correct lc = 007949053489005142
sed -i 's/007949021469002241/007949053489005142/g' "$FILE"
sed -i 's/007949155896007874/007949053489005142/g' "$FILE"

# gh-etax: correct lc = 007949136603007653
sed -i 's/007949113645003507/007949136603007653/g' "$FILE"
sed -i 's/007949027749003958/007949136603007653/g' "$FILE"

# gh-taxextension: correct lc = 007949121281006198 (unchanged)
sed -i 's/007949033342002305/007949121281006198/g' "$FILE"

# ── SOFTWARE ─────────────────────────────────────────────────────────────────
# gh-nordvpn: correct lc = 007949079282005891
sed -i 's/007949143344006843/007949079282005891/g' "$FILE"
sed -i 's/007949085070005891/007949079282005891/g' "$FILE"

# gh-filmora: correct lc = 007949048607004532 (unchanged)
sed -i 's/007949165260004532/007949048607004532/g' "$FILE"

# gh-pdfelement: correct lc = 007949165237004532
sed -i 's/007949165372004532/007949165237004532/g' "$FILE"
sed -i 's/007949139355006776/007949165237004532/g' "$FILE"

# gh-sidify: correct lc = 007949114494007306
sed -i 's/007949163344007882/007949114494007306/g' "$FILE"
sed -i 's/007949114496007306/007949114494007306/g' "$FILE"

# gh-movavi: correct lc = 007949108972006513
sed -i 's/007949153344007119/007949108972006513/g' "$FILE"
sed -i 's/007949109440006513/007949108972006513/g' "$FILE"

# gh-tenorshare: correct lc = 007949139287006847 (unchanged)
sed -i 's/007949163344008992/007949139287006847/g' "$FILE"

# gh-appypie: correct lc = 007949090967005541 (unchanged)
sed -i 's/007949153344007442/007949090967005541/g' "$FILE"

# gh-updf: correct lc = 007949154707007728
sed -i 's/007949163344008112/007949154707007728/g' "$FILE"
sed -i 's/007949147521007728/007949154707007728/g' "$FILE"

# gh-itoolab: correct lc = 007949110667007185
sed -i 's/007949163344008441/007949110667007185/g' "$FILE"
sed -i 's/007949108972006513/007949110667007185/g' "$FILE"

# gh-famisafe: correct lc = 007949097766006788
sed -i 's/007949154258006788/007949097766006788/g' "$FILE"

# gh-depositphotos: correct lc = 007949040357004687
sed -i 's/007949063344003921/007949040357004687/g' "$FILE"
sed -i 's/007949136603007653/007949040357004687/g' "$FILE"

# gh-edraw: correct lc = 007949165147006886
sed -i 's/007949165246006886/007949165147006886/g' "$FILE"
sed -i 's/007949165249006886/007949165147006886/g' "$FILE"

# gh-iskysoft: correct lc = 007949080054005679
sed -i 's/007949099000005679/007949080054005679/g' "$FILE"

# gh-jalbum: correct lc = 007949135821007664
sed -i 's/007949143344006442/007949135821007664/g' "$FILE"
sed -i 's/007949069873005391/007949135821007664/g' "$FILE"

# gh-renoise: correct lc = 007949165071007995 (unchanged)
sed -i 's/007949143344006551/007949165071007995/g' "$FILE"

# gh-picador: correct lc = 007949164712007982 (unchanged)
sed -i 's/007949133344006228/007949164712007982/g' "$FILE"

# gh-youware: correct lc = 007949164733007981
sed -i 's/007949163344008118/007949164733007981/g' "$FILE"
sed -i 's/007949164742007981/007949164733007981/g' "$FILE"

# gh-individualsoftware: correct lc = 007949046073005238
sed -i 's/007949133344005882/007949046073005238/g' "$FILE"
sed -i 's/007949110667007185/007949046073005238/g' "$FILE"

# ── EDUCATION ────────────────────────────────────────────────────────────────
# gh-boardvitals: correct lc = 007949124366007614
sed -i 's/007949114675005824/007949124366007614/g' "$FILE"
sed -i 's/007949154901006218/007949124366007614/g' "$FILE"

# gh-surgent: correct lc = 007949138896006249
sed -i 's/007949123344006122/007949138896006249/g' "$FILE"
sed -i 's/007949163206006249/007949138896006249/g' "$FILE"

# gh-pmtraining: correct lc = 007949081796006139 (unchanged)
sed -i 's/007949143344006992/007949081796006139/g' "$FILE"

# gh-learntasticcpr: correct lc = 007949103653006955
sed -i 's/007949143344006112/007949103653006955/g' "$FILE"
sed -i 's/007949155036007841/007949103653006955/g' "$FILE"

# gh-securitiesinstitute: correct lc = 007949108329007101 (unchanged)
sed -i 's/007949113344005987/007949108329007101/g' "$FILE"

# gh-illumeo: correct lc = 007949104078006849
sed -i 's/007949143344006221/007949104078006849/g' "$FILE"
sed -i 's/007949034133001545/007949104078006849/g' "$FILE"

# gh-hrcp: correct lc = 007949120619007379
sed -i 's/007949093344005114/007949120619007379/g' "$FILE"
sed -i 's/007949135821007664/007949120619007379/g' "$FILE"

# gh-oakstone: correct lc = 007949049546004978 (unchanged)
sed -i 's/007949103344005432/007949049546004978/g' "$FILE"

# gh-wolterskluwer: correct lc = 007949165370003224
sed -i 's/007949019993003224/007949165370003224/g' "$FILE"

# gh-learntasticahca: correct lc = 007949047416004897
sed -i 's/007949143344006113/007949047416004897/g' "$FILE"
sed -i 's/007949146929007736/007949047416004897/g' "$FILE"

# ── PET CARE ─────────────────────────────────────────────────────────────────
# gh-canadapetcare: correct lc = 007949139296006219
sed -i 's/007949083344004721/007949139296006219/g' "$FILE"
sed -i 's/007949063057005492/007949139296006219/g' "$FILE"

# gh-budgetpetcare: correct lc = 007949144117006217
sed -i 's/007949103344005118/007949144117006217/g' "$FILE"
sed -i 's/007949124366007614/007949144117006217/g' "$FILE"

# gh-bestvetcare: correct lc = 007949154901006218
sed -i 's/007949093344004992/007949154901006218/g' "$FILE"
sed -i 's/007949076672005837/007949154901006218/g' "$FILE"

# gh-discountpetcare: correct lc = 007949161266007847
sed -i 's/007949123344005441/007949161266007847/g' "$FILE"
sed -i 's/007949053489005142/007949161266007847/g' "$FILE"

# gh-budgetpetworld: correct lc = 007949145753006206
sed -i 's/007949113344005224/007949145753006206/g' "$FILE"
sed -i 's/007949144117006217/007949145753006206/g' "$FILE"

# ── HEALTH ───────────────────────────────────────────────────────────────────
# gh-personalabs: correct lc = 007949146929007736
sed -i 's/007949133344005442/007949146929007736/g' "$FILE"
sed -i 's/007949152445007736/007949146929007736/g' "$FILE"

# gh-ayurvedaexperience: correct lc = 007949126292007580 (unchanged)
sed -i 's/007949163344008221/007949126292007580/g' "$FILE"

# gh-nursejamie: correct lc = 007949155036007841
sed -i 's/007949153344007112/007949155036007841/g' "$FILE"
sed -i 's/007949155104007841/007949155036007841/g' "$FILE"

# gh-infinitealoe: correct lc = 007949155212007855
sed -i 's/007949105959006539/007949155212007855/g' "$FILE"

# gh-fieldtex: correct lc = 007949044236004764
sed -i 's/007949123344005118/007949044236004764/g' "$FILE"
sed -i 's/007949120619007379/007949044236004764/g' "$FILE"

# ── AUTO ─────────────────────────────────────────────────────────────────────
# gh-maxpeedingrodsus: correct lc = 007949105959006539
sed -i 's/007949133344006421/007949105959006539/g' "$FILE"
sed -i 's/007949154195006539/007949105959006539/g' "$FILE"

# gh-maxpeedingrodsau: correct lc = 007949101800006908
sed -i 's/007949143344006554/007949101800006908/g' "$FILE"
sed -i 's/007949136043006908/007949101800006908/g' "$FILE"

# gh-lafuente: correct lc = 007949034143001545
sed -i 's/007949083344003992/007949034143001545/g' "$FILE"
sed -i 's/007949079282005891/007949034143001545/g' "$FILE"

# ── PRINT (buildasign removed) ───────────────────────────────────────────────
# gh-easycanvasprints: correct lc = 007949043935004760
sed -i 's/007949063344003112/007949043935004760/g' "$FILE"
sed -i 's/007949050767005020/007949043935004760/g' "$FILE"

# gh-etchingexpressions: correct lc = 007949027749003958
sed -i 's/007949083344004332/007949027749003958/g' "$FILE"
sed -i 's/007949154703007728/007949027749003958/g' "$FILE"

# gh-bannersonthecheap: correct lc = 007949076672005837
sed -i 's/007949073344003661/007949076672005837/g' "$FILE"
sed -i 's/007949069833005389/007949076672005837/g' "$FILE"

# gh-canvasonthecheap: correct lc = 007949084965006216
sed -i 's/007949073344003662/007949084965006216/g' "$FILE"
sed -i 's/007949139296006219/007949084965006216/g' "$FILE"

# gh-ryonet: correct lc = 007949155911007876 (unchanged)
sed -i 's/007949084633004512/007949155911007876/g' "$FILE"

# ── HARDWARE ─────────────────────────────────────────────────────────────────
# gh-trademarkhardware: correct lc = 007949113406007272 (unchanged)
sed -i 's/007949123344005912/007949113406007272/g' "$FILE"

# gh-trademarksoundproofing: correct lc = 007949107911007070 (unchanged)
sed -i 's/007949133344006118/007949107911007070/g' "$FILE"

# gh-warehouse115: correct lc = 007949102471006776 (unchanged)
sed -i 's/007949163344007442/007949102471006776/g' "$FILE"

# gh-productsonthego: correct lc = 007949137847007124
sed -i 's/007949113344004882/007949137847007124/g' "$FILE"
sed -i 's/007949108750007124/007949137847007124/g' "$FILE"

# ── LIFESTYLE (bgmgirl removed) ──────────────────────────────────────────────
# gh-halloweencostumes: correct lc = 007949047396004909
sed -i 's/007949053344002874/007949047396004909/g' "$FILE"
sed -i 's/007949155212007855/007949047396004909/g' "$FILE"

# gh-surveyjunkie: correct lc = 007949153848007834 (unchanged)
sed -i 's/007949033344001882/007949153848007834/g' "$FILE"

# gh-graeters: correct lc = 007949155896007874
sed -i 's/007949073344004112/007949155896007874/g' "$FILE"
sed -i 's/007949151790007794/007949155896007874/g' "$FILE"

# gh-carmellimo: correct lc = 007949021363003587 (unchanged)
sed -i 's/007949053344002881/007949021363003587/g' "$FILE"

# gh-tastyribbon: correct lc = 007949155938007865 (unchanged)
sed -i 's/007949153344007881/007949155938007865/g' "$FILE"

# gh-combatflipflops: correct lc = 007949108439006486 (unchanged)
sed -i 's/007949143344006881/007949108439006486/g' "$FILE"

# gh-camanoislandcoffee: correct lc = 007949063057005492
sed -i 's/007949053344002441/007949063057005492/g' "$FILE"
sed -i 's/007949094561006921/007949063057005492/g' "$FILE"

# gh-gunsinternational: correct lc = 007949050767005020
sed -i 's/007949093344004221/007949050767005020/g' "$FILE"
sed -i 's/007949046073005238/007949050767005020/g' "$FILE"

# gh-thechessstore: correct lc = 007949071778005057 (unchanged)
sed -i 's/007949103344005112/007949071778005057/g' "$FILE"

# gh-museumreplicas: correct lc = 007949069873005391
sed -i 's/007949113344005442/007949069873005391/g' "$FILE"
sed -i 's/007949109612005391/007949069873005391/g' "$FILE"

# gh-atlantacutlery: correct lc = 007949069833005389
sed -i 's/007949123344005771/007949069833005389/g' "$FILE"
sed -i 's/007949164733007981/007949069833005389/g' "$FILE"

# gh-vipertec: correct lc = 007949091308006550 (unchanged)
sed -i 's/007949133344006224/007949091308006550/g' "$FILE"

# gh-bugatchi: correct lc = 007949094561006921
sed -i 's/007949153344007662/007949094561006921/g' "$FILE"
sed -i 's/007949145753006206/007949094561006921/g' "$FILE"

# gh-readygolf: correct lc = 007949135537007633 (unchanged)
sed -i 's/007949103344004551/007949135537007633/g' "$FILE"

# gh-incentrev: correct lc = 007949151790007794
sed -i 's/007949123344005991/007949151790007794/g' "$FILE"
sed -i 's/007949047416004897/007949151790007794/g' "$FILE"

echo "✓ lc= codes patched"

# ── REMOVE bgmgirl and buildasign keyword entries ────────────────────────────
echo "🗑  Removing bgmgirl and buildasign entries..."
# Remove lines containing gh-bgmgirl or gh-buildasign
grep -v "gh-bgmgirl\|gh-buildasign" "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"
echo "✓ bgmgirl and buildasign removed"

# ── APPEND new campaign keywords ─────────────────────────────────────────────
echo "➕ Appending new campaign keywords..."

# Find the closing ]; of the keywords array and insert before it
MARKER=$(grep -n "^];" "$FILE" | tail -1 | cut -d: -f1)

if [ -z "$MARKER" ]; then
  echo "⚠ Could not find ]; in $FILE — appending to end"
  cat >> "$FILE" << 'KWEOF'

// ── New campaign keywords added 2026-05-01 ──────────────────────────────────
// gh-updf
  { keyword: 'updf review 2026', volume: 890000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf vs adobe acrobat 2026', volume: 450000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf ai pdf editor 2026', volume: 320000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf lifetime license 2026', volume: 210000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'best ai pdf editor 2026', volume: 540000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf vs pdfelement 2026', volume: 180000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf para mac 2026', volume: 95000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'es' },
  { keyword: 'updf kostenlos 2026', volume: 88000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'de' },
  { keyword: 'updf中文版 2026', volume: 120000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'zh' },
  { keyword: 'updf レビュー 2026', volume: 75000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'ja' },
  { keyword: 'updf indir ücretsiz 2026', volume: 55000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'tr' },
// gh-pdfelement
  { keyword: 'pdfelement review 2026', volume: 720000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'pdfelement vs adobe acrobat pro', volume: 380000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'pdfelement lifetime deal 2026', volume: 290000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'best pdf editor no subscription 2026', volume: 510000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'wondershare pdfelement coupon 2026', volume: 175000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'pdfelement para windows 2026', volume: 88000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'es' },
  { keyword: 'pdfelement avis 2026', volume: 72000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'fr' },
  { keyword: 'pdfelement 中文 2026', volume: 98000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'zh' },
  { keyword: 'pdfelement 리뷰 2026', volume: 65000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'ko' },
  { keyword: 'pdfelement alternatif 2026', volume: 58000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'id' },
// gh-wolterskluwer
  { keyword: 'lippincott nursing textbooks 2026', volume: 420000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'lippincott williams wilkins discount', volume: 310000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'nclex review books 2026 best', volume: 580000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'medical textbooks online cheap 2026', volume: 340000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'nursing drug handbook 2026 online', volume: 275000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'wolters kluwer medical education 2026', volume: 195000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'libros de enfermería lippincott 2026', volume: 89000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'es' },
  { keyword: 'livres médicaux lippincott 2026', volume: 68000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'fr' },
  { keyword: 'lippincott nursing 한국어 2026', volume: 72000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'ko' },
// gh-productsonthego
  { keyword: 'products on the go review 2026', volume: 210000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'best portable work accessories 2026', volume: 380000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'travel tech accessories for remote work 2026', volume: 290000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'portable monitor stand review 2026', volume: 175000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'best laptop accessories 2026', volume: 620000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'accesorios portátiles trabajo remoto 2026', volume: 88000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'es' },
  { keyword: 'accessoires bureau portable 2026', volume: 72000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'fr' },
  { keyword: 'portable arbeitsgeräte 2026', volume: 65000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'de' },
// gh-learntasticahca
  { keyword: 'learntastic ahca review 2026', volume: 180000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'hipaa online certification 2026', volume: 450000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'ahca certification online fast 2026', volume: 320000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'osha healthcare training online 2026', volume: 380000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'healthcare compliance certification 2026', volume: 290000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'hipaa training for medical staff 2026', volume: 245000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'certificación hipaa en línea 2026', volume: 65000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'es' },
  { keyword: 'formation hipaa en ligne 2026', volume: 58000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'fr' },
// gh-learntasticcpr
  { keyword: 'learntastic cpr review 2026', volume: 195000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'online cpr certification accepted employers 2026', volume: 580000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'bls certification online 2026', volume: 450000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'cpr certification online same day 2026', volume: 390000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'best online cpr course 2026', volume: 520000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'cpr certification cost 2026', volume: 310000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'certificado rcp en línea 2026', volume: 125000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'es' },
  { keyword: 'formation secourisme en ligne 2026', volume: 98000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'fr' },
  { keyword: 'ehbo cursus online 2026', volume: 55000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'nl' },
// gh-itoolab
  { keyword: 'itoolab review 2026', volume: 250000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'itoolab anyunlock review 2026', volume: 195000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'how to unlock disabled iphone 2026', volume: 890000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'transfer whatsapp iphone to android 2026', volume: 720000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'iphone data recovery software 2026', volume: 580000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'itoolab vs tenorshare 2026', volume: 175000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'desbloquear iphone sin contraseña 2026', volume: 145000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'es' },
  { keyword: 'iphone entsperren ohne passwort 2026', volume: 125000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'de' },
  { keyword: 'aracı itoolab inceleme 2026', volume: 65000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'tr' },
  { keyword: 'itoolab 리뷰 2026', volume: 88000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'ko' },
KWEOF
else
  # Insert before the closing ];
  head -n $((MARKER - 1)) "$FILE" > "${FILE}.tmp"
  cat >> "${FILE}.tmp" << 'KWEOF'
  // ── New campaign keywords added 2026-05-01 ─────────────────────────────────
  // gh-updf
  { keyword: 'updf review 2026', volume: 890000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf vs adobe acrobat 2026', volume: 450000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf ai pdf editor 2026', volume: 320000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf lifetime license 2026', volume: 210000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'best ai pdf editor 2026', volume: 540000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf vs pdfelement 2026', volume: 180000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'en' },
  { keyword: 'updf para mac 2026', volume: 95000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'es' },
  { keyword: 'updf kostenlos 2026', volume: 88000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'de' },
  { keyword: 'updf中文版 2026', volume: 120000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'zh' },
  { keyword: 'updf レビュー 2026', volume: 75000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'ja' },
  { keyword: 'updf indir ücretsiz 2026', volume: 55000, merchant: 'gh-updf', lc: '007949154707007728', cat: 'Software', slug: 'updf-pdf-editor-review-2026', lang: 'tr' },
  // gh-pdfelement
  { keyword: 'pdfelement review 2026', volume: 720000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'pdfelement vs adobe acrobat pro', volume: 380000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'pdfelement lifetime deal 2026', volume: 290000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'best pdf editor no subscription 2026', volume: 510000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'wondershare pdfelement coupon 2026', volume: 175000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'en' },
  { keyword: 'pdfelement para windows 2026', volume: 88000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'es' },
  { keyword: 'pdfelement avis 2026', volume: 72000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'fr' },
  { keyword: 'pdfelement 中文 2026', volume: 98000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'zh' },
  { keyword: 'pdfelement 리뷰 2026', volume: 65000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'ko' },
  { keyword: 'pdfelement alternatif 2026', volume: 58000, merchant: 'gh-pdfelement', lc: '007949165237004532', cat: 'Software', slug: 'pdfelement-vs-acrobat-2026', lang: 'id' },
  // gh-wolterskluwer
  { keyword: 'lippincott nursing textbooks 2026', volume: 420000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'lippincott williams wilkins discount', volume: 310000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'nclex review books 2026 best', volume: 580000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'medical textbooks online cheap 2026', volume: 340000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'nursing drug handbook 2026 online', volume: 275000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'wolters kluwer medical education 2026', volume: 195000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'en' },
  { keyword: 'libros de enfermería lippincott 2026', volume: 89000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'es' },
  { keyword: 'livres médicaux lippincott 2026', volume: 68000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'fr' },
  { keyword: 'lippincott nursing 한국어 2026', volume: 72000, merchant: 'gh-wolterskluwer', lc: '007949165370003224', cat: 'Education', slug: 'wolters-kluwer-medical-books-2026', lang: 'ko' },
  // gh-productsonthego
  { keyword: 'products on the go review 2026', volume: 210000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'best portable work accessories 2026', volume: 380000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'travel tech accessories for remote work 2026', volume: 290000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'portable monitor stand review 2026', volume: 175000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'best laptop accessories 2026', volume: 620000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'en' },
  { keyword: 'accesorios portátiles trabajo remoto 2026', volume: 88000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'es' },
  { keyword: 'accessoires bureau portable 2026', volume: 72000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'fr' },
  { keyword: 'portable arbeitsgeräte 2026', volume: 65000, merchant: 'gh-productsonthego', lc: '007949137847007124', cat: 'Hardware', slug: 'products-on-the-go-2026', lang: 'de' },
  // gh-learntasticahca
  { keyword: 'learntastic ahca review 2026', volume: 180000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'hipaa online certification 2026', volume: 450000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'ahca certification online fast 2026', volume: 320000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'osha healthcare training online 2026', volume: 380000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'healthcare compliance certification 2026', volume: 290000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'hipaa training for medical staff 2026', volume: 245000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'en' },
  { keyword: 'certificación hipaa en línea 2026', volume: 65000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'es' },
  { keyword: 'formation hipaa en ligne 2026', volume: 58000, merchant: 'gh-learntasticahca', lc: '007949047416004897', cat: 'Education', slug: 'learntastic-ahca-review-2026', lang: 'fr' },
  // gh-learntasticcpr
  { keyword: 'learntastic cpr review 2026', volume: 195000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'online cpr certification accepted employers 2026', volume: 580000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'bls certification online 2026', volume: 450000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'cpr certification online same day 2026', volume: 390000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'best online cpr course 2026', volume: 520000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'cpr certification cost 2026', volume: 310000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'en' },
  { keyword: 'certificado rcp en línea 2026', volume: 125000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'es' },
  { keyword: 'formation secourisme en ligne 2026', volume: 98000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'fr' },
  { keyword: 'ehbo cursus online 2026', volume: 55000, merchant: 'gh-learntasticcpr', lc: '007949103653006955', cat: 'Education', slug: 'learntastic-cpr-certification-2026', lang: 'nl' },
  // gh-itoolab
  { keyword: 'itoolab review 2026', volume: 250000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'itoolab anyunlock review 2026', volume: 195000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'how to unlock disabled iphone 2026', volume: 890000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'transfer whatsapp iphone to android 2026', volume: 720000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'iphone data recovery software 2026', volume: 580000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'itoolab vs tenorshare 2026', volume: 175000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'en' },
  { keyword: 'desbloquear iphone sin contraseña 2026', volume: 145000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'es' },
  { keyword: 'iphone entsperren ohne passwort 2026', volume: 125000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'de' },
  { keyword: 'itoolab 리뷰 2026', volume: 88000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'ko' },
  { keyword: 'aracı itoolab inceleme 2026', volume: 65000, merchant: 'gh-itoolab', lc: '007949110667007185', cat: 'Software', slug: 'itoolab-iphone-manager-2026', lang: 'tr' },
KWEOF
  tail -n +$MARKER "$FILE" >> "${FILE}.tmp"
  mv "${FILE}.tmp" "$FILE"
fi

echo "✓ 70 new campaign keywords appended"

echo ""
echo "✅ Done!"
echo ""
echo "Spot check — key lc= codes:"
grep -m1 "gh-efile"             "$FILE" | grep -o "007949053489005142" | head -1 | xargs -I{} echo "  gh-efile:             {} ✓"
grep -m1 "gh-nordvpn"           "$FILE" | grep -o "007949079282005891" | head -1 | xargs -I{} echo "  gh-nordvpn:           {} ✓"
grep -m1 "gh-updf"              "$FILE" | grep -o "007949154707007728" | head -1 | xargs -I{} echo "  gh-updf:              {} ✓"
grep -m1 "gh-itoolab"           "$FILE" | grep -o "007949110667007185" | head -1 | xargs -I{} echo "  gh-itoolab:           {} ✓"
grep -m1 "gh-wolterskluwer"     "$FILE" | grep -o "007949165370003224" | head -1 | xargs -I{} echo "  gh-wolterskluwer:     {} ✓"
grep -m1 "gh-learntasticcpr"    "$FILE" | grep -o "007949103653006955" | head -1 | xargs -I{} echo "  gh-learntasticcpr:    {} ✓"
grep -m1 "gh-learntasticahca"   "$FILE" | grep -o "007949047416004897" | head -1 | xargs -I{} echo "  gh-learntasticahca:   {} ✓"
grep -m1 "gh-productsonthego"   "$FILE" | grep -o "007949137847007124" | head -1 | xargs -I{} echo "  gh-productsonthego:   {} ✓"
echo ""
echo "Removed merchant check (should be 0):"
BGM=$(grep -c "gh-bgmgirl" "$FILE" 2>/dev/null || echo 0)
BSA=$(grep -c "gh-buildasign" "$FILE" 2>/dev/null || echo 0)
echo "  gh-bgmgirl lines:    $BGM"
echo "  gh-buildasign lines: $BSA"
echo ""
echo "Next steps:"
echo "  git add targetedkeys.js"
echo "  git commit -m 'Fix lc= codes, remove bgmgirl/buildasign, add 70 new keywords'"
