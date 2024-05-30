// ==UserScript==
// @name         W2G Player Enhancements
// @description  Make the player behave more intuitively
// @version      1.0
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @grant        none
// @match        https://player.w2g.tv/w2g_player/*
// ==/UserScript==

const $ = document.querySelector.bind(document);

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const untracked = new Set();
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        /**
         * Player controls bar
         */
        const playerControls = $("#player_controls");
        if (playerControls && !untracked.has(playerControls)) {
            console.log("player_controls found", playerControls);
            untracked.add(playerControls);

            // move the fullscreen button into the player controls bar
            const fs_btn = playerControls.querySelector("#fullscreen_button");
            fs_btn.querySelector(".popup_label").remove();
            playerControls.appendChild(fs_btn);
        }

        /**
         * Video 'container' - can be either an iframe or the video element itself
         */
        const containerElement = $("#video_container iframe") || $("#video_container video");
        if (containerElement && !untracked.has(containerElement)) {
            console.log("containerElement found", containerElement);

            let targetBody;
            switch (containerElement.tagName) {
                case "VIDEO":
                    targetBody = document.body; // video is already in the main document
                    break;
                case "IFRAME":
                    targetBody = containerElement.contentDocument.body;
                    break;
                default:
                    console.error("targetBody not valid", containerElement);
                    return;
            }

            console.log("targetBody found", targetBody);

            if (!targetBody.querySelector("video")) return;

            console.log("targetVideo found", targetBody.querySelector("video"));
            untracked.add(containerElement);

            // hide video info (title, license, etc.) while video is playing
            const styleElement = document.createElement("style");
            styleElement.innerHTML = `
                body.playing .video-info-player {
                    opacity: 0 !important;
                }
            `;
            targetBody.appendChild(styleElement);

            // hide video controls and cursor after some inactivity in fullscreen
            targetBody.addEventListener("mousemove", () => {
                const playerControls = $("#player_controls");

                if (targetBody.classList.contains("fullscreen")) {
                    playerControls.style.opacity = "1";
                    targetBody.style.cursor = "default";
                    clearTimeout(playerControls.hideTimeout);

                    playerControls.hideTimeout = setTimeout(() => {
                        playerControls.style.opacity = "0";
                        targetBody.style.cursor = "none";
                    }, 2000);
                } else {
                    playerControls.style.opacity = "1";
                    targetBody.style.cursor = "default";
                }
            });

            // video click events
            let timeout;
            targetBody.querySelector("#video_container").addEventListener("click", (event) => {
                if (!timeout) {
                    timeout = setTimeout(() => {
                        // single click to play/pause video
                        $("#player_controls .player_button:first-child").click();
                        timeout = null;
                    }, 200);

                    return;
                }

                // double click to toggle fullscreen
                $("#player_controls #fullscreen_button").click();
                clearTimeout(timeout);
                timeout = null;
            });
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
});
