// ==UserScript==
// @name         [WP] Current filename in window title
// @version      1.0
// @description  Show name of current file openend in theme-editor in window title
// @author       https://github.com/mriot
// @match        http*://*/wp-admin/theme-editor.php*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const filename = new URLSearchParams(window.location.search).get("file");
  if (!filename) return;

  document.title = filename + " - " + document.title;
})();
