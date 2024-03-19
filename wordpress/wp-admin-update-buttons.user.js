// ==UserScript==
// @name         Keep WordPress' page-update buttons in viewport
// @description  Keep page-update buttons in viewport on WordPress admin pages
// @version      1.1
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        http*://*/wp-admin/*
// ==/UserScript==

(function () {
    "use strict";

    (function ($) {
        $(`
      <style>
        body.wp-admin .fusion-builder-update-buttons {
          bottom: 0 !important;
        }
      </style>
    `).appendTo("head");
    })(window.jQuery);
})();
