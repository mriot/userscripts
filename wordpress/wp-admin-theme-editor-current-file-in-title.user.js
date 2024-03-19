// ==UserScript==
// @name         Display filename from WordPress editor in window title
// @description  Show name of current file openend in theme-editor in window title
// @version      1.1
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        http*://*/wp-admin/theme-editor.php*
// ==/UserScript==

(function () {
    "use strict";

    const filename = new URLSearchParams(window.location.search).get("file");
    if (!filename) return;

    document.title = filename + " - " + document.title;
})();
