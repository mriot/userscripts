// ==UserScript==
// @name         Google Meet disable Cam & Mic automatically
// @description  Automatically disable microphone and camera upon joining a meeting
// @version      1.1
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        https://meet.google.com/*
// ==/UserScript==

(function () {
    "use strict";

    window.onload = () => {
        // NOTE: selector is using hotkey-description (aria-label) to identify buttons
        const disableCameraButton = document.querySelector(
            'div[role="button"][aria-label$=" + e)"][data-is-muted="false"]'
        );
        const disableMicrophoneButton = document.querySelector(
            'div[role="button"][aria-label$=" + d)"][data-is-muted="false"]'
        );

        if (disableCameraButton) disableCameraButton.click();
        if (disableMicrophoneButton) disableMicrophoneButton.click();
    };
})();
