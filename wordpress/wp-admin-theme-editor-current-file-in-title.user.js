// ==UserScript==
// @name         [WP] Current filename in window title
// @version      0.1
// @description  Show name of current file openend in theme-editor in window title
// @author       mkremer
// @match        http*://*/wp-admin/theme-editor.php*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const filename = new URLSearchParams(window.location.search).get("file");
  if (!filename) return;

  document.title = filename + " - " + document.title;
})();
