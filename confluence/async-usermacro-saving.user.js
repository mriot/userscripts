// ==UserScript==
// @name         [CONFLUENCE] Async user macro saving
// @description  Asynchronously save user macros without reloading the site
// @version      1.1
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        https://*/admin/updateusermacro-start.action?macro=*
// ==/UserScript==

(function () {
    "use strict";

    const $ = window.jQuery || alert("ERROR in async user macro saving script:\nCould not get jQuery from site!");
    const AJS = window.AJS || alert("ERROR in async user macro saving script:\nCould not get AJS from site!");
    const toastConfig = {
        fadeout: true,
        delay: 2000,
        title: "Macro saved!",
    };

    document.body.addEventListener("keydown", (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "s") {
            event.preventDefault();
            $("#confirm").trigger("click");
        }
    });

    $("#confirm").on("click", (event) => {
        event.preventDefault();
        $("#confirm").before(
            `<aui-spinner size="small" class="usermacro-loading-icon" style="display: inline-block; margin-right: 10px;"></aui-spinner>`
        );

        (async () => {
            const response = await fetch(`${window.location.origin}/admin/updateusermacro.action`, {
                headers: {
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                },
                method: "POST",
                body: $("#user-macro-form").serialize(),
            });

            // console.log(response);

            $(".usermacro-loading-icon").remove();

            if (!response.ok) {
                alert(`Could not save macro!\nCode: ${response.status}`);
                return;
            }

            if (new URLSearchParams(response.url).get("permissionViolation") !== null) {
                alert("It seems you're not logged in!\nYou must re-authenticate in Confluence.");
                return;
            }

            AJS.messages.confirmation("#helptd", toastConfig);
            AJS.messages.confirmation("#admin-body-content", toastConfig);
        })();
    });
})();
