// ==UserScript==
// @name         [JIRA] Toggle button for 'done'-column
// @version      1.1
// @description  Adds a button for toggling the visiblity of the done-column
// @author       mkremer
// @match        https://jira.apps.seibert-media.net/secure/RapidBoard.jspa?rapidView=*
// @grant        none
// ==/UserScript==

(function () {
  const $ = window.jQuery;
  let state = JSON.parse(localStorage.getItem("done-column-hidden")); // using JSON.parse to convert string to boolean

  // general styling
  $(`
    <style>
      body.ghx-header-compact #ghx-controls-work .toggle-done-column {
        display: block !important;
        position: absolute;
        right: 50px;
        bottom: 10px;
      }
    </style>
  `).appendTo("head");

  const setStyleRules = display => {
    $("#done-column-toggle-styles").remove();
    $(`
      <style id="done-column-toggle-styles">
        .ghx-zone-overlay .ghx-zone-overlay-column:last-child {
          display: ${display};
        }
      </style>
    `).appendTo("head");
  };

  // wait for board to be "ready"
  let interval = setInterval(() => {
    if ($("#ghx-controls-work button.aui-button").length > 0 && $("#ghx-column-header-group").length > 0) {
      clearInterval(interval);

      // if column was hidden, hide it again on page-load
      if (state) {
        $("#ghx-column-headers li:last-child").hide();
        $(".ghx-columns li:last-child").hide();
        setStyleRules("none");
      }

      // element to watch
      const entry = $("#ghx-pool")[0];

      // watch for these
      const observerConfig = {
        attributes: false,
        childList: true,
        characterData: false
      };

      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          console.log(mutation);
          if (state) {
            $("#ghx-column-headers li:last-child").hide();
            $(".ghx-columns li:last-child").hide();
            setStyleRules("none");
          }
        })
      });

      // run watcher
      observer.observe(entry, observerConfig);

      // set up custom button
      let $button = $("#ghx-controls-work button.aui-button").clone();
      $button
        .removeClass("ghx-compact-toggle")
        .removeClass("js-compact-toggle")
        .addClass("toggle-done-column")
        .find("span.aui-icon")
          .removeClass()
          .addClass("aui-icon")
          .addClass("aui-icon-small")
          .addClass("aui-iconfont-page-layout-toggle")
        .end()
        .insertBefore("#ghx-modes-tools > #ghx-view-presentation") // when header is visible
        .clone()
        .appendTo("#ghx-controls-work") // when header is hidden
        .hide()
    }

    // apply event listener to all toggle-buttons
    $(".toggle-done-column").on("click", () => {
      $("#ghx-column-headers li:last-child").toggle(0);
      $(".ghx-columns li:last-child").toggle(200);

      // store current state of the column (hidden/visible => true/false)
      let isHidden = $("#ghx-column-headers li:last-child").is(":hidden");
      localStorage.setItem("done-column-hidden", isHidden);
      // update state for non-reload-related DOM changes (like ticket drag'n'drop, ...)
      state = isHidden;

      // set css rules for drag 'n' drop overlay
      setStyleRules(isHidden ? "none" : "table-cell");
    });
  }, 100)
})();
