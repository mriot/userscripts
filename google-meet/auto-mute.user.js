// ==UserScript==
// @name         [MEET] Disable Cam & Mic automatically
// @version      0.1
// @description  Automatically disable microphone and camera upon joining a meeting
// @author       mkremer
// @match        https://meet.google.com/*
// ==/UserScript==

(function() {
  'use strict';

  // credits: https://github.com/burkybang/Google-Meet-Auto-Disable-Camera/blob/master/content.js
  window.onload = () => {
      // NOTE: selector is using hotkey-description (aria-label) to identify buttons
      const disableCameraButton = document.querySelector('div[role="button"][aria-label$=" + e)"][data-is-muted="false"]');
      const disableMicrophoneButton = document.querySelector('div[role="button"][aria-label$=" + d)"][data-is-muted="false"]');

      if (disableCameraButton) disableCameraButton.click();
      if (disableMicrophoneButton) disableMicrophoneButton.click();
  };
})();
