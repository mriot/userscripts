// ==UserScript==
// @name         [MEET] Auto account switcher
// @version      0.1
// @description  Automatically use selected account
// @author       mkremer
// @match        https://meet.google.com/*
// ==/UserScript==

(function() {
  'use strict';

  // change the number to the account-id you want to use to join meetings
  if (location.search !== "?authuser=1") location.search = "?authuser=1";
})();
