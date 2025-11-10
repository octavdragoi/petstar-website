/**
 * FOUC (Flash of Unstyled Content) Prevention
 *
 * This script prevents the browser from displaying content before stylesheets are fully loaded.
 * It should be included in the <head> section of all pages.
 *
 * Usage:
 * 1. Add style="visibility: hidden;" to the <body> tag
 * 2. Include this script in <head> after all CSS links:
 *    <script src="assets/js/fouc-prevention.js"></script>
 */

(function() {
    'use strict';

    // Function to check if all stylesheets are loaded
    function checkStylesheets() {
        var sheets = document.styleSheets;
        var allLoaded = true;

        for (var i = 0; i < sheets.length; i++) {
            try {
                // Try to access cssRules to verify stylesheet is loaded
                if (!sheets[i].cssRules) {
                    allLoaded = false;
                    break;
                }
            } catch(e) {
                // External stylesheet may throw error, but it's likely loaded
                continue;
            }
        }

        if (allLoaded) {
            document.body.style.visibility = 'visible';
        } else {
            // If not all loaded, check again in 10ms
            setTimeout(checkStylesheets, 10);
        }
    }

    // Start checking when DOM is ready
    document.addEventListener('DOMContentLoaded', checkStylesheets);

    // Fallback: ensure body is visible after 100ms even if check fails
    setTimeout(function() {
        document.body.style.visibility = 'visible';
    }, 100);
})();
