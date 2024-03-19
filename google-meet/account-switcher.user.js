// ==UserScript==
// @name         Google Meet auto account switcher
// @description  Automatically use selected account if there are multiple
// @version      1.1
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        https://meet.google.com/*
// ==/UserScript==

(function () {
    "use strict";

    // change the number to the account-id you want to use to join meetings
    if (location.search !== "?authuser=1") location.search = "?authuser=1";
})();
