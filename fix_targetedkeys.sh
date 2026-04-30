#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
#  FIX TARGETEDKEYS.JS — Replace all old lc= codes with verified ones
#  Run: bash fix_targetedkeys.sh
#  Updated: 2026-04-30 — 70 merchants, all LC codes verified
# ═══════════════════════════════════════════════════════════════════════

FILE="targetedkeys.js"

if [ ! -f "$FILE" ]; then
  echo "✗ $FILE not found in current directory"
  exit 1
fi

echo "🔧 Fixing lc= codes in $FILE..."

# ── TAX ──────────────────────────────────────────────────────────────────────
# E-file.com
sed -i 's/007949021469002241/007949155896007874/g' "$FILE"
# E TAX LLC
sed -i 's/007949113645003507/007949027749003958/g' "$FILE"
# TaxExtension.com
sed -i 's/007949033342002305/007949121281006198/g' "$FILE"
# ezTaxReturn — OUT OF BUSINESS. Remove any lc= references.
# Old fabricated code → replace with E TAX LLC lc (redirect target)
sed -i 's/007949053344004952/007949027749003958/g' "$FILE"

# ── SOFTWARE ─────────────────────────────────────────────────────────────────
# NordVPN
sed -i 's/007949143344006843/007949085070005891/g' "$FILE"
# Wondershare Filmora
sed -i 's/007949165260004532/007949048607004532/g' "$FILE"
# Wondershare PDFelement
sed -i 's/007949165372004532/007949139355006776/g' "$FILE"
# Sidify
sed -i 's/007949163344007882/007949114496007306/g' "$FILE"
# Movavi
sed -i 's/007949153344007119/007949109440006513/g' "$FILE"
# Tenorshare
sed -i 's/007949163344008992/007949139287006847/g' "$FILE"
# Appy Pie
sed -i 's/007949153344007442/007949090967005541/g' "$FILE"
# UPDF
sed -i 's/007949163344008112/007949147521007728/g' "$FILE"
# iToolab
sed -i 's/007949163344008441/007949108972006513/g' "$FILE"
# FamiSafe — NEW merchant (was missing)
# No old fabricated code to replace; add correct lc if keyword entries exist
sed -i 's/gh-famisafe.*lc:[" ]*[0-9]\{18\}/gh-famisafe", lc: "007949154258006788/g' "$FILE"
# Depositphotos
sed -i 's/007949063344003921/007949136603007653/g' "$FILE"
# Edraw — note: old fabricated 007949165246006886 vs real 007949165249006886 (last 4 digits differ)
sed -i 's/007949165246006886/007949165249006886/g' "$FILE"
# iSkysoft — NEW merchant (was missing); add correct lc if entries exist
sed -i 's/gh-iskysoft.*lc:[" ]*[0-9]\{18\}/gh-iskysoft", lc: "007949099000005679/g' "$FILE"
# jAlbum
sed -i 's/007949143344006442/007949069873005391/g' "$FILE"
# Renoise
sed -i 's/007949143344006551/007949165071007995/g' "$FILE"
# Picador
sed -i 's/007949133344006228/007949164712007982/g' "$FILE"
# YouWare
sed -i 's/007949163344008118/007949164742007981/g' "$FILE"
# Individual Software
sed -i 's/007949133344005882/007949110667007185/g' "$FILE"

# ── EDUCATION ────────────────────────────────────────────────────────────────
# BoardVitals
sed -i 's/007949114675005824/007949154901006218/g' "$FILE"
# Surgent CPA
sed -i 's/007949123344006122/007949163206006249/g' "$FILE"
# PM Training
sed -i 's/007949143344006992/007949081796006139/g' "$FILE"
# LearnTastic CPR
sed -i 's/007949143344006112/007949155036007841/g' "$FILE"
# Securities Institute
sed -i 's/007949113344005987/007949108329007101/g' "$FILE"
# Illumeo
sed -i 's/007949143344006221/007949034133001545/g' "$FILE"
# HRCP
sed -i 's/007949093344005114/007949135821007664/g' "$FILE"
# Oakstone Medical
sed -i 's/007949103344005432/007949049546004978/g' "$FILE"
# Wolters Kluwer — real code unchanged (007949019993003224 stays)
sed -i 's/007949165370003224/007949019993003224/g' "$FILE"
# LearnTastic AHCA
sed -i 's/007949143344006113/007949146929007736/g' "$FILE"

# ── PET CARE ─────────────────────────────────────────────────────────────────
# CanadaPetCare
sed -i 's/007949083344004721/007949063057005492/g' "$FILE"
# BudgetPetCare
sed -i 's/007949103344005118/007949124366007614/g' "$FILE"
# BestVetCare
sed -i 's/007949093344004992/007949076672005837/g' "$FILE"
# DiscountPetCare
sed -i 's/007949123344005441/007949053489005142/g' "$FILE"
# BudgetPetWorld
sed -i 's/007949113344005224/007949144117006217/g' "$FILE"

# ── HEALTH ───────────────────────────────────────────────────────────────────
# Personalabs
sed -i 's/007949133344005442/007949152445007736/g' "$FILE"
# The Ayurveda Experience
sed -i 's/007949163344008221/007949126292007580/g' "$FILE"
# Nurse Jamie
sed -i 's/007949153344007112/007949155104007841/g' "$FILE"
# InfiniteAloe — NEW merchant (was missing)
sed -i 's/gh-infinitealoe.*lc:[" ]*[0-9]\{18\}/gh-infinitealoe", lc: "007949105959006539/g' "$FILE"
# Fieldtex — careful: old 007949123344005118 also matches BudgetPetCare above.
# Fieldtex real code is 007949120619007379. Replace only remaining instances
# (BudgetPetCare already handled above so this catches Fieldtex entries).
sed -i 's/007949123344005118/007949120619007379/g' "$FILE"

# ── AUTO ─────────────────────────────────────────────────────────────────────
# Maxpeedingrods US
sed -i 's/007949133344006421/007949154195006539/g' "$FILE"
# Maxpeedingrods AU
sed -i 's/007949143344006554/007949136043006908/g' "$FILE"
# La Fuente Imports
sed -i 's/007949083344003992/007949079282005891/g' "$FILE"

# ── PRINT ────────────────────────────────────────────────────────────────────
# BuildASign — already correct (007949043344001995 is the real code)
# BannersOnTheCheap
sed -i 's/007949073344003661/007949069833005389/g' "$FILE"
# CanvasOnTheCheap
sed -i 's/007949073344003662/007949139296006219/g' "$FILE"
# Easy Canvas Prints
sed -i 's/007949063344003112/007949050767005020/g' "$FILE"
# Etching Expressions
sed -i 's/007949083344004332/007949154703007728/g' "$FILE"
# Ryonet
sed -i 's/007949084633004512/007949155911007876/g' "$FILE"

# ── HARDWARE ─────────────────────────────────────────────────────────────────
# Trademark Hardware
sed -i 's/007949123344005912/007949113406007272/g' "$FILE"
# Trademark Soundproofing
sed -i 's/007949133344006118/007949107911007070/g' "$FILE"
# Warehouse 115
sed -i 's/007949163344007442/007949102471006776/g' "$FILE"
# Products On The Go
sed -i 's/007949113344004882/007949108750007124/g' "$FILE"

# ── LIFESTYLE ────────────────────────────────────────────────────────────────
# HalloweenCostumes.com
sed -i 's/007949053344002874/007949155212007855/g' "$FILE"
# Survey Junkie
sed -i 's/007949033344001882/007949153848007834/g' "$FILE"
# BGM Girl — NEW merchant (was missing)
sed -i 's/gh-bgmgirl.*lc:[" ]*[0-9]\{18\}/gh-bgmgirl", lc: "007949162099007840/g' "$FILE"
# Graeter's Ice Cream
sed -i 's/007949073344004112/007949151790007794/g' "$FILE"
# Carmel Car & Limo
sed -i 's/007949053344002881/007949021363003587/g' "$FILE"
# Tasty Ribbon
sed -i 's/007949153344007881/007949155938007865/g' "$FILE"
# Combat Flip Flops
sed -i 's/007949143344006881/007949108439006486/g' "$FILE"
# Camano Island Coffee
sed -i 's/007949053344002441/007949094561006921/g' "$FILE"
# GunsInternational
sed -i 's/007949093344004221/007949046073005238/g' "$FILE"
# The Chess Store
sed -i 's/007949103344005112/007949071778005057/g' "$FILE"
# MuseumReplicas
sed -i 's/007949113344005442/007949109612005391/g' "$FILE"
# Atlanta Cutlery
sed -i 's/007949123344005771/007949164733007981/g' "$FILE"
# Viper Tec
sed -i 's/007949133344006224/007949091308006550/g' "$FILE"
# Bugatchi
sed -i 's/007949153344007662/007949145753006206/g' "$FILE"
# ReadyGolf
sed -i 's/007949103344004551/007949135537007633/g' "$FILE"
# Incentrev
sed -i 's/007949123344005991/007949047416004897/g' "$FILE"

# ── Update header comment ────────────────────────────────────────────────────
sed -i 's/[0-9]\+ keywords across [0-9]\+ merchants.*/1001+ keywords across 70 merchants — lc= codes verified 2026-04-30/' "$FILE"

echo ""
echo "✅ Done! All lc= codes updated in $FILE"
echo ""
echo "Verification — spot check key codes:"
grep -o "007949155896007874" "$FILE" | head -1 | xargs -I{} echo "  gh-efile:             {} ✓"
grep -o "007949085070005891" "$FILE" | head -1 | xargs -I{} echo "  gh-nordvpn:           {} ✓"
grep -o "007949155212007855" "$FILE" | head -1 | xargs -I{} echo "  gh-halloweencostumes: {} ✓"
grep -o "007949153848007834" "$FILE" | head -1 | xargs -I{} echo "  gh-surveyjunkie:      {} ✓"
grep -o "007949043344001995" "$FILE" | head -1 | xargs -I{} echo "  gh-buildasign:        {} ✓"
echo ""
echo "Old fabricated codes still present (should be 0):"
grep -cE "007949(021469|113645|033342|114675|123344006122|093344005114|103344005432|143344006843|063344003921|165260|165372|165246|163344007882|153344007119|143344006442|163344008112|163344008441|163344008992|153344007442|133344005882|163344008118|143344006551|133344006228|083344004721|093344004992|103344005118|113344005224|123344005441|153344007112|133344005442|163344008221|133344006421|143344006554|083344003992|073344003661|073344003662|063344003112|083344004332|084633004512|123344005912|133344006118|163344007442|113344004882|053344002874|033344001882|073344004112|053344002881|143344006881|053344002441|103344004551|093344004221|153344007662|153344007881|153344007992|123344005991)" "$FILE" || echo "  0 — all clear ✓"
echo ""
echo "Next steps:"
echo "  git add targetedkeys.js"
echo "  git commit -m 'Fix lc= codes — 70 merchants verified 2026-04-30'"
