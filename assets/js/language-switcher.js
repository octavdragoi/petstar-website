/**
 * Language Switcher
 * Handles switching between /en/ and /ro/ versions
 */

(function() {
  'use strict';

  // Detect current language from URL
  function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.startsWith('/en/')) return 'en';
    if (path.startsWith('/ro/')) return 'ro';
    return 'en'; // default
  }

  // Get the current page path without language prefix
  function getPagePath() {
    const path = window.location.pathname;
    // Remove /en/ or /ro/ prefix
    return path.replace(/^\/(en|ro)\//, '/');
  }

  // Switch to specified language
  function switchLanguage(newLang) {
    const currentLang = getCurrentLanguage();
    if (currentLang === newLang) return; // Already on correct language

    const pagePath = getPagePath();
    const newUrl = `/${newLang}${pagePath}${window.location.search}${window.location.hash}`;

    window.location.href = newUrl;
  }

  // Initialize language switcher
  function initLanguageSwitcher() {
    const currentLang = getCurrentLanguage();

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', currentLang);

    // Set selected option in native select (before nice-select transforms it)
    // Only target language switcher selects with data-language-switcher attribute
    const selects = document.querySelectorAll('select[data-language-switcher]');
    selects.forEach(function(select) {
      select.value = currentLang;
    });

    // Handle nice-select plugin (if loaded)
    // The nice-select plugin creates a custom dropdown, we need to hook into its change event
    if (typeof jQuery !== 'undefined' && jQuery.fn.niceSelect) {
      // Use setTimeout to ensure nice-select is fully initialized
      setTimeout(function() {
        // Only attach handler to language switcher selects with data attribute
        jQuery('select[data-language-switcher]').each(function() {
          const $select = jQuery(this);

          $select.off('change.languageSwitcher').on('change.languageSwitcher', function() {
            const selectedLang = jQuery(this).val();
            const currentLang = getCurrentLanguage();
            if (selectedLang !== currentLang) {
              switchLanguage(selectedLang);
            }
          });

          // Update nice-select to show correct value
          $select.val(currentLang).niceSelect('update');
        });
      }, 200);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  } else {
    initLanguageSwitcher();
  }

  // Also try to initialize after nice-select plugin loads
  if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(function() {
      // Wait a bit for nice-select to initialize
      setTimeout(initLanguageSwitcher, 100);
    });
  }

})();
