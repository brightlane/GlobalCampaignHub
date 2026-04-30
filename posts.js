// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB POSTS.JS v1.1
//  Posts registry, lookup helpers, and blog rendering utilities
//
//  Used by: blog.html and all 19 language blog files
//  Auto-updated by: inject.js on each post publication
//
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
//  Site: https://brightlane.github.io/GlobalCampaignHub
//
//  LC CODES SYNCED FROM affiliate.json — 2026-04-30
// ═══════════════════════════════════════════════════════════════════════

const GH_POSTS = (function() {

  const BASE = 'https://brightlane.github.io/GlobalCampaignHub';

  // ── Affiliate link builder — always uses gh- prefix and UTM tracking
  function affLink(merchantId, lc, pos, slug, langCode) {
    const url = new URL('https://www.linkconnector.com/ta.php');
    url.searchParams.set('lc', lc);
    url.searchParams.set('atid', merchantId);
    url.searchParams.set('utm_source', `gh-blog-${langCode}`);
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', slug);
    url.searchParams.set('utm_content', `pos-${pos}`);
    return url.toString();
  }

  // ── Blog file map — lang code → file
  const BLOG_FILES = {
    'en':    'blog.html',
    'zh':    'blog-zh.html',
    'zh-tw': 'blog-zh-tw.html',
    'es':    'blog-es.html',
    'fr':    'blog-fr.html',
    'de':    'blog-de.html',
    'pt':    'blog-pt.html',
    'pt-br': 'blog-pt-br.html',
    'ja':    'blog-ja.html',
    'ko':    'blog-ko.html',
    'it':    'blog-it.html',
    'nl':    'blog-nl.html',
    'pl':    'blog-pl.html',
    'hi':    'blog-hi.html',
    'ar':    'blog-ar.html',
    'ru':    'blog-ru.html',
    'tr':    'blog-tr.html',
    'id':    'blog-id.html',
    'vi':    'blog-vi.html',
    'th':    'blog-th.html',
  };

  // ── Merchant registry — LC codes synced from affiliate.json
  const MERCHANTS = {
    // ── TAX ──
    'gh-efile':               { name: 'E-File.com',              lc: '007949155896007874', cat: 'Tax' },
    'gh-etax':                { name: 'E TAX LLC',               lc: '007949027749003958', cat: 'Tax' },
    'gh-taxextension':        { name: 'TaxExtension.com',        lc: '007949121281006198', cat: 'Tax' },
    'gh-eztaxreturn':         { name: 'ezTaxReturn.com',         lc: '007949027749003958', cat: 'Tax' },  // redirected to E TAX LLC

    // ── SOFTWARE ──
    'gh-nordvpn':             { name: 'NordVPN',                 lc: '007949085070005891', cat: 'Software' },
    'gh-depositphotos':       { name: 'Depositphotos',           lc: '007949136603007653', cat: 'Software' },
    'gh-filmora':             { name: 'Wondershare Filmora',     lc: '007949048607004532', cat: 'Software' },
    'gh-pdfelement':          { name: 'Wondershare PDFelement',  lc: '007949139355006776', cat: 'Software' },
    'gh-edraw':               { name: 'Edraw Mind/Max',          lc: '007949165249006886', cat: 'Software' },
    'gh-sidify':              { name: 'Sidify',                  lc: '007949114496007306', cat: 'Software' },
    'gh-movavi':              { name: 'Movavi Software',         lc: '007949109440006513', cat: 'Software' },
    'gh-jalbum':              { name: 'jAlbum',                  lc: '007949069873005391', cat: 'Software' },
    'gh-updf':                { name: 'UPDF',                    lc: '007949147521007728', cat: 'Software' },
    'gh-itoolab':             { name: 'iToolab',                 lc: '007949108972006513', cat: 'Software' },
    'gh-tenorshare':          { name: 'Tenorshare',              lc: '007949139287006847', cat: 'Software' },
    'gh-appypie':             { name: 'Appy Pie',                lc: '007949090967005541', cat: 'Software' },
    'gh-individualsoftware':  { name: 'Individual Software',     lc: '007949110667007185', cat: 'Software' },
    'gh-youware':             { name: 'YouWare',                 lc: '007949164742007981', cat: 'Software' },
    'gh-renoise':             { name: 'Renoise',                 lc: '007949165071007995', cat: 'Software' },
    'gh-picador':             { name: 'Picador Multimedia',      lc: '007949164712007982', cat: 'Software' },
    'gh-famisafe':            { name: 'Famisafe',                lc: '007949154258006788', cat: 'Software' },
    'gh-iskysoft':            { name: 'iSkysoft',                lc: '007949099000005679', cat: 'Software' },

    // ── EDUCATION ──
    'gh-boardvitals':         { name: 'BoardVitals',             lc: '007949154901006218', cat: 'Education' },
    'gh-surgent':             { name: 'Surgent CPA',             lc: '007949163206006249', cat: 'Education' },
    'gh-hrcp':                { name: 'HRCP',                    lc: '007949135821007664', cat: 'Education' },
    'gh-oakstone':            { name: 'Oakstone Medical',        lc: '007949049546004978', cat: 'Education' },
    'gh-securitiesinstitute': { name: 'Securities Institute',    lc: '007949108329007101', cat: 'Education' },
    'gh-illumeo':             { name: 'Illumeo',                 lc: '007949034133001545', cat: 'Education' },
    'gh-wolterskluwer':       { name: 'Wolters Kluwer LWW',      lc: '007949019993003224', cat: 'Education' },
    'gh-learntasticcpr':      { name: 'LearnTastic CPR',         lc: '007949155036007841', cat: 'Education' },
    'gh-learntasticahca':     { name: 'LearnTastic AHCA',        lc: '007949146929007736', cat: 'Education' },
    'gh-pmtraining':          { name: 'PM Training',             lc: '007949081796006139', cat: 'Education' },

    // ── PET CARE ──
    'gh-canadapetcare':       { name: 'CanadaPetCare',           lc: '007949063057005492', cat: 'Pet Care' },
    'gh-bestvetcare':         { name: 'BestVetCare',             lc: '007949076672005837', cat: 'Pet Care' },
    'gh-budgetpetcare':       { name: 'BudgetPetCare',           lc: '007949124366007614', cat: 'Pet Care' },
    'gh-budgetpetworld':      { name: 'BudgetPetWorld',          lc: '007949144117006217', cat: 'Pet Care' },
    'gh-discountpetcare':     { name: 'DiscountPetCare',         lc: '007949053489005142', cat: 'Pet Care' },

    // ── HEALTH ──
    'gh-nursejamie':          { name: 'Nurse Jamie',             lc: '007949155104007841', cat: 'Health' },
    'gh-personalabs':         { name: 'Personalabs',             lc: '007949152445007736', cat: 'Health' },
    'gh-ayurvedaexperience':  { name: 'Ayurveda Experience',     lc: '007949126292007580', cat: 'Health' },
    'gh-infinitealoe':        { name: 'InfiniteAloe',            lc: '007949105959006539', cat: 'Health' },
    'gh-fieldtex':            { name: 'Fieldtex Products',       lc: '007949120619007379', cat: 'Health' },

    // ── AUTO ──
    'gh-maxpeedingrodsus':    { name: 'Maxpeedingrods US',       lc: '007949154195006539', cat: 'Auto' },
    'gh-maxpeedingrodsau':    { name: 'Maxpeedingrods AU',       lc: '007949136043006908', cat: 'Auto' },
    'gh-lafuente':            { name: 'La Fuente Imports',       lc: '007949079282005891', cat: 'Auto' },

    // ── PRINT ──
    'gh-buildasign':          { name: 'BuildASign',              lc: '007949043344001995', cat: 'Print' },
    'gh-bannersonthecheap':   { name: 'BannersOnTheCheap',       lc: '007949069833005389', cat: 'Print' },
    'gh-canvasonthecheap':    { name: 'CanvasOnTheCheap',        lc: '007949139296006219', cat: 'Print' },
    'gh-easycanvasprints':    { name: 'Easy Canvas Prints',      lc: '007949050767005020', cat: 'Print' },
    'gh-etchingexpressions':  { name: 'Etching Expressions',     lc: '007949154703007728', cat: 'Print' },
    'gh-ryonet':              { name: 'Ryonet',                  lc: '007949155911007876', cat: 'Print' },

    // ── HARDWARE ──
    'gh-trademarkhardware':     { name: 'Trademark Hardware',      lc: '007949113406007272', cat: 'Hardware' },
    'gh-trademarksoundproofing':{ name: 'Trademark Soundproofing', lc: '007949107911007070', cat: 'Hardware' },
    'gh-warehouse115':          { name: 'Warehouse 115',           lc: '007949102471006776', cat: 'Hardware' },
    'gh-productsonthego':       { name: 'Products On The Go',      lc: '007949108750007124', cat: 'Hardware' },

    // ── LIFESTYLE ──
    'gh-halloweencostumes':   { name: 'HalloweenCostumes.com',   lc: '007949155212007855', cat: 'Lifestyle' },
    'gh-graeters':            { name: "Graeter's Ice Cream",     lc: '007949151790007794', cat: 'Lifestyle' },
    'gh-thechessstore':       { name: 'The Chess Store',         lc: '007949071778005057', cat: 'Lifestyle' },
    'gh-museumreplicas':      { name: 'MuseumReplicas.com',      lc: '007949109612005391', cat: 'Lifestyle' },
    'gh-atlantacutlery':      { name: 'Atlanta Cutlery',         lc: '007949164733007981', cat: 'Lifestyle' },
    'gh-vipertec':            { name: 'Viper Tec',               lc: '007949091308006550', cat: 'Lifestyle' },
    'gh-combatflipflops':     { name: 'Combat Flip Flops',       lc: '007949108439006486', cat: 'Lifestyle' },
    'gh-camanoislandcoffee':  { name: 'Camano Island Coffee',    lc: '007949094561006921', cat: 'Lifestyle' },
    'gh-readygolf':           { name: 'ReadyGolf',               lc: '007949135537007633', cat: 'Lifestyle' },
    'gh-gunsinternational':   { name: 'GunsInternational',       lc: '007949046073005238', cat: 'Lifestyle' },
    'gh-carmellimo':          { name: 'Carmel Car & Limo',       lc: '007949021363003587', cat: 'Lifestyle' },
    'gh-bugatchi':            { name: 'Bugatchi',                lc: '007949145753006206', cat: 'Lifestyle' },
    'gh-surveyjunkie':        { name: 'Survey Junkie',           lc: '007949153848007834', cat: 'Lifestyle' },
    'gh-tastyribbon':         { name: 'Tasty Ribbon',            lc: '007949155938007865', cat: 'Lifestyle' },
    'gh-bgmgirl':             { name: 'BGM Girl',                lc: '007949162099007840', cat: 'Lifestyle' },
    'gh-incentrev':           { name: 'Incentrev',               lc: '007949047416004897', cat: 'Lifestyle' },
  };

  // ── Public API

  return {

    // Get merchant info by ID
    getMerchant(id) {
      return MERCHANTS[id] || null;
    },

    // Build affiliate URL with full UTM tracking
    affLink(merchantId, pos, slug, langCode) {
      const m = MERCHANTS[merchantId];
      if (!m) return '#';
      return affLink(merchantId, m.lc, pos, slug, langCode || 'en');
    },

    // Get blog file for a language code
    blogFile(langCode) {
      return BLOG_FILES[langCode] || 'blog.html';
    },

    // Build full blog post URL
    postUrl(slug, langCode, date) {
      const file = BLOG_FILES[langCode] || 'blog.html';
      const key = date ? `${slug}__${date}` : slug;
      return `${BASE}/${file}?p=${key}`;
    },

    // Get all merchants in a category
    byCategory(cat) {
      return Object.entries(MERCHANTS)
        .filter(([, m]) => m.cat === cat)
        .map(([id, m]) => ({ id, ...m }));
    },

    // Get all supported language codes
    languages() {
      return Object.keys(BLOG_FILES);
    },

    // Build hreflang link set for a post slug
    hreflangSet(slug, date) {
      return Object.entries(BLOG_FILES).map(([lang, file]) => {
        const key = date ? `${slug}__${date}` : slug;
        return { lang, url: `${BASE}/${file}?p=${key}` };
      });
    },

    // Parse slug key from URL param (strips date suffix)
    parseSlug(param) {
      if (!param) return null;
      return param.split('__')[0];
    },

    // Parse date from URL param
    parseDate(param) {
      if (!param) return null;
      const parts = param.split('__');
      return parts[1] || null;
    },

    // Get posts from POSTS object filtered by category
    byMerchantCategory(posts, cat) {
      return Object.entries(posts)
        .filter(([, p]) => {
          const merchantId = p.merchantId;
          if (!merchantId) return false;
          const m = MERCHANTS[merchantId];
          return m && m.cat === cat;
        })
        .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
    },

    // Sort posts by date (newest first)
    sortByDate(posts) {
      return Object.entries(posts)
        .sort((a, b) => {
          const dateA = a[0].split('__')[1] || '';
          const dateB = b[0].split('__')[1] || '';
          return dateB.localeCompare(dateA);
        })
        .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
    },

    // Get related posts (same merchant category)
    getRelated(posts, currentSlug, limit = 3) {
      const currentKey = Object.keys(posts).find(k => k.startsWith(currentSlug));
      if (!currentKey) return {};

      const current = posts[currentKey];
      const currentCat = current.category;

      return Object.entries(posts)
        .filter(([k, p]) => k !== currentKey && p.category === currentCat)
        .slice(0, limit)
        .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
    },

    // Build share URLs for a post
    shareUrls(postUrl, title) {
      const encoded = encodeURIComponent(postUrl);
      const encodedTitle = encodeURIComponent(title);
      return {
        twitter:   `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
        linkedin:  `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
        facebook:  `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
        reddit:    `https://reddit.com/submit?url=${encoded}&title=${encodedTitle}`,
        email:     `mailto:?subject=${encodedTitle}&body=${encoded}`,
      };
    },

    // Format number for display
    formatVolume(n) {
      if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
      if (n >= 1000) return Math.round(n/1000) + 'K';
      return String(n);
    },

    // Format date for display
    formatDate(dateStr) {
      if (!dateStr) return '';
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      } catch(e) { return dateStr; }
    },

    // Check if a post slug is published (in POSTS object)
    isPublished(posts, slug) {
      return Object.keys(posts).some(k => k.startsWith(slug));
    },

    // Get the canonical URL for a post
    canonicalUrl(slug, date, langCode) {
      const file = BLOG_FILES[langCode] || 'blog.html';
      const key = date ? `${slug}__${date}` : slug;
      return `${BASE}/${file}?p=${key}`;
    },

    // Build JSON-LD Article schema for a post
    articleSchema(post, postUrl, langCode) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post.title,
        'description': post.metaDesc,
        'url': postUrl,
        'datePublished': post.date,
        'dateModified': post.date,
        'inLanguage': langCode || 'en',
        'author': {
          '@type': 'Organization',
          'name': 'GlobalCampaignHub'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'GlobalCampaignHub',
          'url': BASE + '/'
        }
      };
    },

    // Build JSON-LD FAQPage schema from post.faqs
    faqSchema(faqs) {
      if (!faqs || !faqs.length) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(f => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
      };
    },

    // Build JSON-LD BreadcrumbList schema
    breadcrumbSchema(items) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': item.name,
          'item': item.url
        }))
      };
    },

    // Inject all schemas into page head
    injectSchemas(schemas) {
      schemas.forEach((schema, i) => {
        if (!schema) return;
        const id = `gh-schema-${i}`;
        let el = document.getElementById(id);
        if (!el) {
          el = document.createElement('script');
          el.type = 'application/ld+json';
          el.id = id;
          document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(schema);
      });
    },

    // Update all page meta tags for a post
    updateMeta(post, postUrl, langCode) {
      document.title = `${post.title} | GlobalCampaignHub`;
      const setAttr = (id, attr, val) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, val);
      };

      setAttr('meta-title',     'content',  `${post.title} | GlobalCampaignHub`);
      setAttr('meta-desc',      'content',  post.metaDesc || '');
      setAttr('meta-keywords',  'content',  post.keywords || '');
      setAttr('meta-canonical', 'href',     postUrl);
      setAttr('og-title',       'content',  post.title);
      setAttr('og-desc',        'content',  post.metaDesc || '');
      setAttr('og-url',         'content',  postUrl);
      setAttr('tw-title',       'content',  post.title);
      setAttr('tw-desc',        'content',  post.metaDesc || '');
    },

    // Render post card HTML for index view
    renderPostCard(slug, post, langCode) {
      const file = BLOG_FILES[langCode] || 'blog.html';
      const postUrl = `${BASE}/${file}?p=${slug}`;
      return `
        <a href="${postUrl}" class="post-card" aria-label="${post.title}">
          <div class="post-card-cat">${post.category || ''}</div>
          <div class="post-card-title">${post.title}</div>
          <div class="post-card-desc">${post.metaDesc || ''}</div>
          <div class="post-card-meta">
            <span>${post.readTime || '4 min read'}</span>
            <span class="post-card-read">Read →</span>
          </div>
        </a>`;
    },

    // Get BASE URL
    get BASE() { return BASE; },

    // Version
    VERSION: '1.1.0',
    ACCOUNT: '007949',
    PREFIX:  'gh-',
  };

})();

// ── Make available globally
if (typeof window !== 'undefined') window.GH_POSTS = GH_POSTS;
if (typeof module !== 'undefined') module.exports = GH_POSTS;
