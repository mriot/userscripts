// ==UserScript==
// @name         [WP] Keybind to save theme editor contents
// @version      1.0
// @description  CMD/CTRL + S will save theme editor contents
// @author       https://github.com/mriot
// @match        http*://*/wp-admin/theme-editor.php*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const $ = window.jQuery;

  document.body.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.code === "KeyS") {
      event.preventDefault();
      $("form#template #submit").trigger("click");
    }
  });
})();
