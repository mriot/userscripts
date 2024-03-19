// ==UserScript==
// @name         WordPress keybind to save theme editor
// @description  CMD/CTRL + S will save theme editor contents
// @version      1.1
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        http*://*/wp-admin/theme-editor.php*
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
