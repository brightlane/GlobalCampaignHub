// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB LANGUAGE REDIRECT v1.0
//  Detects browser language and redirects to the correct blog file
//  Covers all 20 supported languages
//  Add <script src="language-redirect.js"></script> to index.html
// ═══════════════════════════════════════════════════════════════════════

(function() {
  const BASE = 'https://brightlane.github.io/GlobalCampaignHub';

  // ── Language → blog file map (all 20 languages)
  const LANG_MAP = {
    // Chinese
    'zh':    'blog-zh.html',
    'zh-cn': 'blog-zh.html',
    'zh-sg': 'blog-zh.html',
    'zh-tw': 'blog-zh-tw.html',
    'zh-hk': 'blog-zh-tw.html',
    'zh-mo': 'blog-zh-tw.html',
    // Spanish
    'es':    'blog-es.html',
    'es-mx': 'blog-es.html',
    'es-ar': 'blog-es.html',
    'es-co': 'blog-es.html',
    'es-cl': 'blog-es.html',
    'es-pe': 'blog-es.html',
    'es-ve': 'blog-es.html',
    'es-ec': 'blog-es.html',
    // French
    'fr':    'blog-fr.html',
    'fr-be': 'blog-fr.html',
    'fr-ca': 'blog-fr.html',
    'fr-ch': 'blog-fr.html',
    // German
    'de':    'blog-de.html',
    'de-at': 'blog-de.html',
    'de-ch': 'blog-de.html',
    // Portuguese
    'pt-br': 'blog-pt-br.html',
    'pt':    'blog-pt.html',
    'pt-pt': 'blog-pt.html',
    // Japanese
    'ja':    'blog-ja.html',
    // Korean
    'ko':    'blog-ko.html',
    'ko-kr': 'blog-ko.html',
    // Italian
    'it':    'blog-it.html',
    'it-ch': 'blog-it.html',
    // Dutch
    'nl':    'blog-nl.html',
    'nl-be': 'blog-nl.html',
    // Polish
    'pl':    'blog-pl.html',
    // Hindi
    'hi':    'blog-hi.html',
    // Arabic
    'ar':    'blog-ar.html',
    'ar-sa': 'blog-ar.html',
    'ar-ae': 'blog-ar.html',
    'ar-eg': 'blog-ar.html',
    'ar-dz': 'blog-ar.html',
    'ar-ma': 'blog-ar.html',
    'ar-iq': 'blog-ar.html',
    'ar-sy': 'blog-ar.html',
    // Russian
    'ru':    'blog-ru.html',
    'ru-ru': 'blog-ru.html',
    // Turkish
    'tr':    'blog-tr.html',
    'tr-tr': 'blog-tr.html',
    // Indonesian
    'id':    'blog-id.html',
    'id-id': 'blog-id.html',
    // Vietnamese
    'vi':    'blog-vi.html',
    'vi-vn': 'blog-vi.html',
    // Thai
    'th':    'blog-th.html',
    'th-th': 'blog-th.html',
    // English (default — no redirect needed)
    'en':    null,
    'en-us': null,
    'en-gb': null,
    'en-au': null,
    'en-ca': null,
    'en-nz': null,
    'en-in': null,
  };

  // ── Only redirect on the homepage and blog.html
  const currentPath = window.location.pathname;
  const isHomepage  = currentPath.endsWith('/') ||
                      currentPath.endsWith('/index.html') ||
                      currentPath.endsWith('/GlobalCampaignHub/');
  const isEnglishBlog = currentPath.endsWith('/blog.html');

  if (!isHomepage && !isEnglishBlog) return;

  // ── Check if user already chose a language (respect their choice)
  const PREF_KEY = 'gh_lang_pref';
  const savedPref = localStorage.getItem(PREF_KEY);
  if (savedPref === 'dismissed') return;
  if (savedPref && LANG_MAP[savedPref] !== undefined) {
    const target = LANG_MAP[savedPref];
    if (target && !currentPath.endsWith(target)) {
      window.location.href = BASE + '/' + target;
    }
    return;
  }

  // ── Detect browser language
  const langs = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];

  let targetFile = null;
  let detectedLang = 'en';

  for (const lang of langs) {
    const lower = lang.toLowerCase();

    // Try exact match first
    if (LANG_MAP.hasOwnProperty(lower)) {
      detectedLang = lower;
      targetFile = LANG_MAP[lower];
      break;
    }

    // Try prefix match (e.g. 'zh-hans' → 'zh')
    const prefix = lower.split('-')[0];
    if (LANG_MAP.hasOwnProperty(prefix)) {
      detectedLang = prefix;
      targetFile = LANG_MAP[prefix];
      break;
    }
  }

  // ── No redirect needed for English or unrecognized languages
  if (!targetFile) return;

  // ── Already on the correct page
  if (currentPath.endsWith(targetFile)) return;

  // ── Show a non-intrusive language suggestion banner
  // rather than hard redirecting (better UX, Google-friendly)
  showLanguageBanner(targetFile, detectedLang);

  function showLanguageBanner(file, lang) {
    // Language names in native script
    const NATIVE_NAMES = {
      'zh': '中文', 'zh-tw': '繁體中文', 'es': 'Español',
      'fr': 'Français', 'de': 'Deutsch', 'pt': 'Português',
      'pt-br': 'Português (BR)', 'ja': '日本語', 'ko': '한국어',
      'it': 'Italiano', 'nl': 'Nederlands', 'pl': 'Polski',
      'hi': 'हिन्दी', 'ar': 'العربية', 'ru': 'Русский',
      'tr': 'Türkçe', 'id': 'Bahasa Indonesia',
      'vi': 'Tiếng Việt', 'th': 'ภาษาไทย',
    };

    const nativeName = NATIVE_NAMES[lang] || lang.toUpperCase();
    const targetUrl  = BASE + '/' + file;
    const isRtl      = lang === 'ar';

    // Create banner
    const banner = document.createElement('div');
    banner.id = 'gh-lang-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'polite');
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      ${isRtl ? 'left' : 'right'}: 20px;
      z-index: 9999;
      background: #111318;
      border: 1px solid rgba(232,255,71,0.4);
      border-radius: 12px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      color: #e8e9ed;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-width: 320px;
      direction: ${isRtl ? 'rtl' : 'ltr'};
      animation: gh-slide-in 0.3s ease;
    `;

    banner.innerHTML = `
      <style>
        @keyframes gh-slide-in {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        #gh-lang-banner .gh-switch-btn {
          background: #e8ff47;
          color: #0a0b0d;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        #gh-lang-banner .gh-dismiss-btn {
          background: transparent;
          border: none;
          color: #555866;
          cursor: pointer;
          font-size: 16px;
          padding: 0 4px;
          line-height: 1;
        }
        #gh-lang-banner .gh-dismiss-btn:hover { color: #e8e9ed; }
      </style>
      <span style="font-size:18px">🌐</span>
      <span style="flex:1;color:#8a8d99">
        Read in <strong style="color:#e8e9ed">${nativeName}</strong>?
      </span>
      <button class="gh-switch-btn" id="gh-switch">Switch</button>
      <button class="gh-dismiss-btn" id="gh-dismiss" aria-label="Dismiss">✕</button>
    `;

    document.body.appendChild(banner);

    // Switch button — redirect and save preference
    document.getElementById('gh-switch').addEventListener('click', function() {
      localStorage.setItem(PREF_KEY, lang);
      window.location.href = targetUrl;
    });

    // Dismiss button — save preference not to redirect
    document.getElementById('gh-dismiss').addEventListener('click', function() {
      localStorage.setItem(PREF_KEY, 'dismissed');
      banner.style.animation = 'none';
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(10px)';
      banner.style.transition = 'opacity 0.2s, transform 0.2s';
      setTimeout(() => banner.remove(), 200);
    });

    // Auto-dismiss after 8 seconds
    setTimeout(function() {
      if (document.getElementById('gh-lang-banner')) {
        document.getElementById('gh-dismiss')?.click();
      }
    }, 8000);
  }

  // ── Expose method to manually set language preference
  window.GH_setLanguage = function(langCode) {
    const file = LANG_MAP[langCode.toLowerCase()];
    if (file !== undefined) {
      localStorage.setItem(PREF_KEY, langCode.toLowerCase());
      if (file) window.location.href = BASE + '/' + file;
    }
  };

  // ── Expose method to reset language preference
  window.GH_resetLanguage = function() {
    localStorage.removeItem(PREF_KEY);
    window.location.reload();
  };

})();
