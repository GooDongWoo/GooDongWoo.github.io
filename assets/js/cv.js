/**
 * DongWoo Goo (구동우) - Interactive CV JavaScript
 * Handles:
 *  - Theme Toggle (Dark/Light)
 *  - Bilingual Support (Korean/English)
 *  - Direct PDF Export (html2pdf)
 *  - Print-to-PDF
 *  - Interactive Toast Notifications
 */

(function () {
  'use strict';

  // ==========================================
  // 1. Language Management (Korean / English)
  // ==========================================
  const LANG_STORAGE_KEY = 'gdw_cv_lang';
  const langKoBtn = document.getElementById('langKoBtn');
  const langEnBtn = document.getElementById('langEnBtn');

  function getPreferredLanguage() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if (langParam && (langParam === 'ko' || langParam === 'en')) return langParam;
    } catch (e) {}

    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && (stored === 'ko' || stored === 'en')) return stored;
    return 'en'; // Default to English
  }

  function applyLanguage(lang, notify = false) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);

    if (langKoBtn && langEnBtn) {
      if (lang === 'ko') {
        langKoBtn.classList.add('active');
        langEnBtn.classList.remove('active');
        langKoBtn.setAttribute('aria-pressed', 'true');
        langEnBtn.setAttribute('aria-pressed', 'false');
      } else {
        langKoBtn.classList.remove('active');
        langEnBtn.classList.add('active');
        langKoBtn.setAttribute('aria-pressed', 'false');
        langEnBtn.setAttribute('aria-pressed', 'true');
      }
    }

    if (notify) {
      showToast(lang === 'ko' ? '한국어 버전으로 전환되었습니다.' : 'Switched to English version.');
    }
  }

  // Initialize language
  const currentLang = getPreferredLanguage();
  applyLanguage(currentLang, false);

  if (langKoBtn) {
    langKoBtn.addEventListener('click', () => {
      applyLanguage('ko', true);
    });
  }

  if (langEnBtn) {
    langEnBtn.addEventListener('click', () => {
      applyLanguage('en', true);
    });
  }

  // ==========================================
  // 2. Theme Management (Dark / Light Mode)
  // ==========================================
  const THEME_STORAGE_KEY = 'gdw_cv_theme';
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');

  function getPreferredTheme() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const themeParam = urlParams.get('theme');
      if (themeParam && (themeParam === 'dark' || themeParam === 'light')) return themeParam;
    } catch (e) {}

    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, notify = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
      } else {
        themeIcon.className = 'fas fa-moon';
      }
    }

    if (notify) {
      const isKo = document.documentElement.getAttribute('data-lang') === 'ko';
      if (theme === 'dark') {
        showToast(isKo ? '다크 모드가 활성화되었습니다.' : 'Dark mode enabled.');
      } else {
        showToast(isKo ? '라이트 모드가 활성화되었습니다.' : 'Light mode enabled.');
      }
    }
  }

  // Initialize theme
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }

  // Listen to OS theme changes if user hasn't explicitly set one
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // ==========================================
  // 3. Toast Notification Helper
  // ==========================================
  function showToast(message, duration = 3000) {
    let toast = document.getElementById('cvToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cvToast';
      toast.className = 'cv-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // ==========================================
  // 4. Print / Native PDF Export
  // ==========================================
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // 5. One-Click Direct PDF Download (html2pdf)
  // ==========================================
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', async () => {
      const element = document.getElementById('cvContent');
      if (!element) {
        window.print();
        return;
      }

      const isKo = document.documentElement.getAttribute('data-lang') === 'ko';
      showToast(isKo ? 'PDF 파일을 생성하고 있습니다. 잠시만 기다려주세요... ⏳' : 'Generating PDF document, please wait... ⏳', 4000);

      // Save original theme & temporarily enforce light mode for crisp print rendering
      const currentActiveTheme = document.documentElement.getAttribute('data-theme') || 'light';
      document.documentElement.setAttribute('data-theme', 'light');

      const targetFilename = isKo ? 'GooDongWoo_CV_KO.pdf' : 'DongWoo_Goo_CV_EN.pdf';

      // html2pdf options
      const opt = {
        margin: [10, 10, 10, 10], // mm
        filename: targetFilename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          scrollY: 0
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy']
        }
      };

      try {
        if (typeof html2pdf !== 'undefined') {
          await html2pdf().set(opt).from(element).save();
          showToast(isKo ? `${targetFilename} 다운로드가 완료되었습니다.` : `${targetFilename} download complete.`, 3500);
        } else {
          // Fallback to browser print if CDN is unreachable
          window.print();
        }
      } catch (err) {
        console.error('PDF export error:', err);
        showToast(isKo ? '직접 다운로드 중 문제가 발생하여 인쇄 대화상자를 호출합니다.' : 'Export error, opening native print dialog...', 3000);
        window.print();
      } finally {
        // Restore user's previous theme
        document.documentElement.setAttribute('data-theme', currentActiveTheme);
      }
    });
  }

})();
