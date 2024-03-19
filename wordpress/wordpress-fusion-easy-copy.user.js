// ==UserScript==
// @name         Easy Copy for WordPress Fusion
// @description  This script helps you copying entire *containers* from one wordpress to another
// @version      1.1
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        http*://*/wp-admin/post.php*
// ==/UserScript==

(function ($) {
    "use strict";

    if (!$ || !$("body").hasClass("fusion-body")) return;

    let toggle = false;
    const config = {
        attributes: false,
        childList: true,
        subtree: false,
    };

    const $button = $(`
    <li id="wp-fusion-easycopy-toggle">
      <div class="ab-item" style="cursor: pointer; padding: 0 10px;">Toggle EasyCopy</div>
    </li>
  `)
        .on("click", () => {
            toggle = !toggle;

            if (toggle) {
                observer.observe($("#fusion_builder_main_container")[0], config);
                $button.find("div").text("EasyCopy (Active)");
            } else {
                observer.disconnect();
                $button.find("div").text("EasyCopy (Inactive)");
            }
        })
        .appendTo("#wp-admin-bar-root-default");

    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach((mutation) => {
            if ($(".fusion-builder-context-menu").length < 1 || !window.FusionPageBuilderApp.contextMenuView) return;

            window.navigator.clipboard.readText().then((clipboardData) => {
                if (!clipboardData) return;

                if ($(".fusion-builder-context-menu ul li[data-action^='paste-']").length < 1) {
                    $(`<li data-action="paste-before">Paste Before</li>`).appendTo(".fusion-builder-context-menu ul");
                    $(`<li data-action="paste-after">Paste After</li>`).appendTo(".fusion-builder-context-menu ul");

                    console.log("EasyCopy: Updated context menu.");
                }

                window.FusionPageBuilderApp.contextMenuView.copyData.data.content = clipboardData;
                window.FusionPageBuilderApp.contextMenuView.copyData.data.type = "fusion_builder_container";

                console.log("EasyCopy: Done!", window.FusionPageBuilderApp.contextMenuView.copyData);
            });
        });
    });
})(window.jQuery);
