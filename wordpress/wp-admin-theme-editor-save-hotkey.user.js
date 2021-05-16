// ==UserScript==
// @name         [WP] Keybind to save theme editor contents
// @version      0.1
// @description  CMD/CTRL + S will save theme editor contents
// @author       mkremer
// @match        http*://*/wp-admin/theme-editor.php*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const $ = window.jQuery;

  document.body.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.code === "KeyS") {
      event.preventDefault();
      $("form#template #submit").trigger("click");
    }
  });
})();
