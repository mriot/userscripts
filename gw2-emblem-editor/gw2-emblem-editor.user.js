// ==UserScript==
// @name         Gw2 Emblem Editor
// @description  Adds two buttons to randomize the emblem and its colors separately
// @version      1.0
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @match        https://nailek.net/gw2/emblemeditor/
// @icon         https://nailek.net/gw2/resources/favicon.ico
// ==/UserScript==

(function () {
    const $ = (s) => document.querySelectorAll(s);

    const {
        currentEmblem,
        randomKeyInObject,
        randomVarInArray,
        emblemDefs,
        emblemColorIDsInOrder,
        refreshEmblem,
        emblemBackgroundDefs,
    } = window;

    function randomizeColors() {
        currentEmblem.background.colors[0] = randomVarInArray(emblemColorIDsInOrder);
        currentEmblem.foreground.colors = [
            randomVarInArray(emblemColorIDsInOrder),
            randomVarInArray(emblemColorIDsInOrder),
        ];

        refreshEmblem();
    }

    function randomizeEmblemAndBackground() {
        currentEmblem.foreground.id = randomKeyInObject(emblemDefs);
        currentEmblem.background.id = randomKeyInObject(emblemBackgroundDefs);

        refreshEmblem();
    }

    const randColorsButton = document.createElement("button");
    randColorsButton.innerText = "Randomize Colors";
    randColorsButton.addEventListener("click", randomizeColors);

    const randGraphicsButton = document.createElement("button");
    randGraphicsButton.innerText = "Randomize Graphics";
    randGraphicsButton.addEventListener("click", randomizeEmblemAndBackground);

    $("#randomEmblemButton")[0].after(randColorsButton);
    $("#randomEmblemButton")[0].after(randGraphicsButton);
})();
