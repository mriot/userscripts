// ==UserScript==
// @name         [MEET] Disable Cam & Mic automatically
// @version      1.0
// @description  Automatically disable microphone and camera upon joining a meeting
// @author       https://github.com/mriot
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
