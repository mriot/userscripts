// ==UserScript==
// @name         [CONFLUENCE] Company Happiness Overview
// @version      0.3
// @description  Look up company happiness entries without filling it out
// @author       mkremer
// @match        https://confluence.apps.seibert-media.net/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const $ = window.jQuery;

  $.ajax({
    url: "https://confluence.apps.seibert-media.net/rest/cosuto/latest/survey/1",
    cache: false,
    headers: {
      "X-Atlassian-Token": "no-check",
      contentType: "application/json; charset=utf-8"
    }
  }).done(json => {

    const getAnswersAsListItems = (answersArray) => {
      // console.log(answersArray);
      return answersArray.reduce((acc, item) => {
        if (item.text.length > 0) {
          acc.push(`<li>${item.text}</li>`);
        }
        return acc;
      }, []).join("");
    };

    $(`
      <section id="company-happiness-dialog" class="aui-dialog2 aui-dialog2-large aui-layer" role="dialog" aria-hidden="true">
        <header class="aui-dialog2-header">
            <h2 class="aui-dialog2-header-main">Company Happiness Overview</h2>
            <a class="aui-dialog2-header-close">
                <span class="aui-icon aui-icon-small aui-iconfont-close-dialog">Close</span>
            </a>
        </header>
        <div class="aui-dialog2-content">
            <h2>${json.reports[2].question}</h2>
            <ol style="line-height: 2;">
              ${getAnswersAsListItems(json.reports[2].answers)}
            </ol>
            <hr style="margin: 30px 0;">
            <h2>${json.reports[3].question}</h2>
            <ol style="line-height: 2;">
              ${getAnswersAsListItems(json.reports[3].answers)}
            </ol>
        </div>
      </section>
      <style>
        #company-happiness-dialog ol li:hover {
          border-radius: 3px;
          background: linear-gradient(45deg, #eee, transparent);
        }
      </style>
    `).appendTo("body");

    $("#linchpin-header-inner #header #header-right-panel").prepend(`
      <div id="company-happiness-header" style="margin-right: 15px; color: #ebecf0; align-self: center; cursor: pointer;">
        Team: ${json.reports[0].median.toFixed(2)} // Company: ${json.reports[1].median.toFixed(2)}
      </div>
    `);

    $("#company-happiness-header").on("click", () => {
      AJS.dialog2("#company-happiness-dialog").show();
    });

  });
})();
