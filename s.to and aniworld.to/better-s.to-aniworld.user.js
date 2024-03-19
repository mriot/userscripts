// ==UserScript==
// @name         Better s.to & aniworld
// @description  Sortable watchlist, hosting providers and more
// @version      1.2
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        https://s.to/*
// @match        https://aniworld.to/*
// @match        https://bradleyviewdoctor.com/e/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=s.to
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// ==/UserScript==

(function () {
    "use strict";

    const $ = window.jQuery;
    const $nav = $("header.main-header").find(".primary-navigation");

    // === STYLES ===
    $(`<style>
      .main-header {
        background: #243743;
      }
      .logo-wrapper {
        background: none;
      }
    </style>`).appendTo("head");

    // === NAVIGATION MODS ===
    // remove tutorial link
    $nav.find("a[href^='/support/anleitung']").parent().remove();
    // put 'subscribed' link into main nav
    $nav.find(".offset-navigation .dd li > a[href^='/account/subscribed']")
        .parent()
        .clone()
        .appendTo($nav.find("> ul"));
    // put 'watchlist' link into main nav
    $nav.find(".offset-navigation .dd li > a[href^='/account/watchlist']").parent().clone().appendTo($nav.find("> ul"));
    // put 'calendar' link into main nav
    $nav.find("a[href^='/serienkalender']").parent().appendTo($nav.find("> ul"));
    // remove "more" menu item
    $nav.find("li > strong").parent().remove();
    // remove avatar
    $nav.find(".avatar").remove();
    // remove hover trigger from dropdown menu
    $nav.find(".dd")
        .remove()
        .clone()
        .click((e) => {
            e.stopPropagation();
            $(".dd .modal").slideToggle(150);
        })
        .appendTo(".offset-navigation");

    // sorting of stream hosters + first hoster will be loaded by default
    if (location.pathname.includes("/serie/stream") || location.pathname.includes("/anime/stream")) {
        const data = GM_getValue("hoster_order");

        if (data) {
            const list = JSON.parse(data);
            console.log(list);

            let nameToElement = new Map();
            $(".hosterSiteVideo > ul > li:visible").each((key, element) => {
                const name = $(element).find("h4").text();
                nameToElement.set(name, element);
            });

            let sortedElements = list.map((name) => nameToElement.get(name));
            $(".hosterSiteVideo > ul").prepend(sortedElements);

            // activate hoster
            $(".generateInlinePlayer:visible:eq(0)").trigger("click");
        }

        $(".hosterSiteVideo > ul").sortable({
            containment: ".hosterSiteVideo > ul",
            axis: "x",
            helper: "clone",
            revert: 100, // animation
            stop: (event, ui) => {
                const list = $(".hosterSiteVideo > ul > li:visible").map((i, e) => $(e).find("h4").text());
                GM_setValue("hoster_order", JSON.stringify(Array.from(list)));
            },
        });
    }

    // sortable lists
    if (location.pathname.includes("/account/subscribed") || location.pathname.includes("/account/watchlist")) {
        const data = GM_getValue(location.pathname);

        if (data) {
            const list = Array.from(data);
            console.log(list);

            let urlToElement = new Map();
            $(".seriesListContainer > div").each((key, element) => {
                const url = $(element).find("a").attr("href");
                urlToElement.set(url, element);
            });

            let sortedElements = list.map((url) => urlToElement.get(url));
            $(".seriesListContainer").append(sortedElements);
        }

        $(".seriesListContainer").sortable({
            containment: ".seriesListContainer",
            revert: 100, // animation
            stop: (event, ui) => {
                const list = $(".seriesListContainer > div > a").map((i, e) => $(e).attr("href"));
                GM_setValue(location.pathname, list);
            },
        });

        // remove 'sort by' on watchlist page
        $(".seriesListNavigation").remove();
    }
})();
