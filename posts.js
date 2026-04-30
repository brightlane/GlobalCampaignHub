// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB POSTS.JS v1.0
//  Posts registry, lookup helpers, and blog rendering utilities
//
//  Used by: blog.html and all 19 language blog files
//  Auto-updated by: inject.js on each post publication
//
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
//  Site: https://brightlane.github.io/GlobalCampaignHub
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

  // ── Merchant registry — all 68 merchants with lc codes
  const MERCHANTS = {
    'gh-efile':               { name: 'E-file.com',              lc: '007949021469002241', cat: 'Tax' },
    'gh-etax':                { name: 'E TAX LLC',               lc: '007949113645003507', cat: 'Tax' },
    'gh-taxextension':        { name: 'TaxExtension.com',        lc: '007949033342002305', cat: 'Tax' },
    'gh-eztaxreturn':         { name: 'ezTaxReturn.com',         lc: '007949053344004952', cat: 'Tax' },
    'gh-nordvpn':             { name: 'NordVPN',                 lc: '007949143344006843', cat: 'Software' },
    'gh-depositphotos':       { name: 'Depositphotos',           lc: '007949063344003921', cat: 'Software' },
    'gh-filmora':             { name: 'Wondershare Filmora',     lc: '007949165260004532', cat: 'Software' },
    'gh-pdfelement':          { name: 'Wondershare PDFelement',  lc: '007949165372004532', cat: 'Software' },
    'gh-edraw':               { name: 'Edraw Mind/Max',          lc: '007949165246006886', cat: 'Software' },
    'gh-sidify':              { name: 'Sidify',                  lc: '007949163344007882', cat: 'Software' },
    'gh-movavi':              { name: 'Movavi Software',         lc: '007949153344007119', cat: 'Software' },
    'gh-jalbum':              { name: 'jAlbum',                  lc: '007949143344006442', cat: 'Software' },
    'gh-updf':                { name: 'UPDF',                    lc: '007949163344008112', cat: 'Software' },
    'gh-itoolab':             { name: 'iToolab',                 lc: '007949163344008441', cat: 'Software' },
    'gh-tenorshare':          { name: 'Tenorshare',              lc: '007949163344008992', cat: 'Software' },
    'gh-appypie':             { name: 'Appy Pie',                lc: '007949153344007442', cat: 'Software' },
    'gh-individualsoftware':  { name: 'Individual Software',     lc: '007949133344005882', cat: 'Software' },
    'gh-youware':             { name: 'YouWare',                 lc: '007949163344008118', cat: 'Software' },
    'gh-renoise':             { name: 'Renoise',                 lc: '007949143344006551', cat: 'Software' },
    'gh-picador':             { name: 'Picador Multimedia',      lc: '007949133344006228', cat: 'Software' },
    'gh-boardvitals':         { name: 'BoardVitals',             lc: '007949114675005824', cat: 'Education' },
    'gh-surgent':             { name: 'Surgent CPA',             lc: '007949123344006122', cat: 'Education' },
    'gh-hrcp':                { name: 'HRCP',                    lc: '007949093344005114', cat: 'Education' },
    'gh-oakstone':            { name: 'Oakstone Medical',        lc: '007949103344005432', cat: 'Education' },
    'gh-securitiesinstitute': { name: 'Securities Institute',    lc: '007949113344005987', cat: 'Education' },
    'gh-illumeo':             { name: 'Illumeo',                 lc: '007949143344006221', cat: 'Education' },
    'gh-wolterskluwer':       { name: 'Wolters Kluwer LWW',      lc: '007949165370003224', cat: 'Education' },
    'gh-learntasticcpr':      { name: 'LearnTastic CPR',         lc: '007949143344006112', cat: 'Education' },
    'gh-learntasticahca':     { name: 'LearnTastic AHCA',        lc: '007949143344006113', cat: 'Education' },
    'gh-pmtraining':          { name: 'PM Training',             lc: '007949143344006992', cat: 'Education' },
    'gh-canadapetcare':       { name: 'CanadaPetCare',           lc: '007949083344004721', cat: 'Pet Care' },
    'gh-bestvetcare':         { name: 'BestVetCare',             lc: '007949093344004992', cat: 'Pet Care' },
    'gh-budgetpetcare':       { name: 'BudgetPetCare',           lc: '007949103344005118', cat: 'Pet Care' },
    'gh-budgetpetworld':      { name: 'BudgetPetWorld',          lc: '007949113344005224', cat: 'Pet Care' },
    'gh-discountpetcare':     { name: 'DiscountPetCare',         lc: '007949123344005441', cat: 'Pet Care' },
    'gh-nursejamie':          { name: 'Nurse Jamie',             lc: '007949153344007112', cat: 'Health' },
    'gh-personalabs':         { name: 'Personalabs',             lc: '007949133344005442', cat: 'Health' },
    'gh-ayurvedaexperience':  { name: 'Ayurveda Experience',     lc: '007949163344008221', cat: 'Health' },
    'gh-maxpeedingrodsus':    { name: 'Maxpeedingrods US',       lc: '007949133344006421', cat: 'Auto' },
    'gh-maxpeedingrodsau':    { name: 'Maxpeedingrods AU',       lc: '007949143344006554', cat: 'Auto' },
    'gh-lafuente':            { name: 'La Fuente Imports',       lc: '007949083344003992', cat: 'Auto' },
    'gh-buildasign':          { name: 'BuildASign',              lc: '007949043344001995', cat: 'Print' },
    'gh-bannersonthecheap':   { name: 'BannersOnTheCheap',       lc: '007949073344003661', cat: 'Print' },
    'gh-canvasonthecheap':    { name: 'CanvasOnTheCheap',        lc: '007949073344003662', cat: 'Print' },
    'gh-easycanvasprints':    { name: 'Easy Canvas Prints',      lc: '007949063344003112', cat: 'Print' },
    'gh-etchingexpressions':  { name: 'Etching Expressions',     lc: '007949083344004332', cat: 'Print' },
    'gh-ryonet':              { name: 'Ryonet',                  lc: '007949084633004512', cat: 'Print' },
    'gh-trademarkhardware':   { name: 'Trademark Hardware',      lc: '007949123344005912', cat: 'Hardware' },
    'gh-trademarksoundproofing':{ name: 'Trademark Soundproofing',lc: '007949133344006118', cat: 'Hardware' },
    'gh-warehouse115':        { name: 'Warehouse 115',           lc: '007949163344007442', cat: 'Hardware' },
    'gh-fieldtex':            { name: 'Fieldtex Products',       lc: '007949123344005118', cat: 'Hardware' },
    'gh-productsonthego':     { name: 'Products On The Go',      lc: '007949113344004882', cat: 'Hardware' },
    'gh-halloweencostumes':   { name: 'HalloweenCostumes.com',   lc: '007949053344002874', cat: 'Lifestyle' },
    'gh-graeters':            { name: "Graeter's Ice Cream",     lc: '007949073344004112', cat: 'Lifestyle' },
    'gh-thechessstore':       { name: 'The Chess Store',         lc: '007949103344005112', cat: 'Lifestyle' },
    'gh-museumreplicas':      { name: 'MuseumReplicas.com',      lc: '007949113344005442', cat: 'Lifestyle' },
    'gh-atlantacutlery':      { name: 'Atlanta Cutlery',         lc: '007949123344005771', cat: 'Lifestyle' },
    'gh-vipertec':            { name: 'Viper Tec',               lc: '007949133344006224', cat: 'Lifestyle' },
    'gh-combatflipflops':     { name: 'Combat Flip Flops',       lc: '007949143344006881', cat: 'Lifestyle' },
    'gh-camanoislandcoffee':  { name: 'Camano Island Coffee',    lc: '007949053344002441', cat: 'Lifestyle' },
    'gh-readygolf':           { name: 'ReadyGolf',               lc: '007949103344004551', cat: 'Lifestyle' },
    'gh-gunsinternational':   { name: 'GunsInternational',       lc: '007949093344004221', cat: 'Lifestyle' },
    'gh-carmellimo':          { name: 'Carmel Car & Limo',       lc: '007949053344002881', cat: 'Lifestyle' },
    'gh-bugatchi':            { name: 'Bugatchi',                lc: '007949153344007662', cat: 'Lifestyle' },
    'gh-surveyjunkie':        { name: 'Survey Junkie',           lc: '007949033344001882', cat: 'Lifestyle' },
    'gh-tastyribbon':         { name: 'Tasty Ribbon',            lc: '007949153344007881', cat: 'Lifestyle' },
    'gh-bgmgirl':             { name: 'BGM Girl',                lc: '007949153344007992', cat: 'Lifestyle' },
    'gh-incentrev':           { name: 'Incentrev',               lc: '007949123344005991', cat: 'Lifestyle' },
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
      const setMeta = (id, attr, val) => {
        const el = document.getElementById(id);
        if (el) el[attr === 'content' ? 'setAttribute' : 'textContent']
          ? el.setAttribute(attr, val)
          : null;
        if (el && attr === 'content') el.setAttribute('content', val);
        if (el && attr === 'text')    el.textContent = val;
      };
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
    VERSION: '1.0.0',
    ACCOUNT: '007949',
    PREFIX:  'gh-',
  };

})();

// ── Make available globally
if (typeof window !== 'undefined') window.GH_POSTS = GH_POSTS;
if (typeof module !== 'undefined') module.exports = GH_POSTS;
