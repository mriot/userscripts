// ==UserScript==
// @name         [WP] Keep page-update buttons in viewport
// @version      0.1
// @author       mkremer
// @match        http*://*/wp-admin/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

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
