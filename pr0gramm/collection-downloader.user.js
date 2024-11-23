// ==UserScript==
// @name         pr0gramm collection downloader
// @description  Downloads a full collection, neatly organized into swf, nsfw, nsfl, and pol folders, and packaged as a zip.
// @version      1.1
// @author       mriot
// @namespace    https://github.com/mriot/userscripts
// @homepageURL  https://github.com/mriot/userscripts
// @supportURL   https://github.com/mriot/userscripts/issues

// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @match        https://pr0gramm.com/user/*/*
// ==/UserScript==

console.log("%cRun downloadCurrentCollection() to start downloading%c", "color: #bada55; padding: 5px", "");

unsafeWindow.downloadCurrentCollection = async function () {
    const timestamp = () => new Date().toLocaleString("sv").replace(/\s/g, "_").replace(/:/g, "-");
    const zip = await attachJSZip();
    const FOLDER = { 1: "sfw", 2: "nsfw", 4: "nsfl", 8: "nsfp", 16: "pol" };
    const username = window.location.pathname.split("/").at(-2);
    const collection = window.location.pathname.split("/").pop() || "favoriten";
    const apiUrl = new URL("https://pr0gramm.com/api/items/get");
    const items = [];

    apiUrl.searchParams.set("flags", "31"); // all flags
    apiUrl.searchParams.set("user", username);
    apiUrl.searchParams.set("collection", collection);

    console.log("Acquiring item list...");

    let atEnd = false;
    while (!atEnd) {
        const data = await fetch(apiUrl);
        const json = await data.json();

        if (json.error) {
            console.error("Error fetching item list:", json.error);
            return;
        }

        if (!json.atEnd) {
            apiUrl.searchParams.set("older", json.items.at(-1).id);
        }

        items.push(...json.items);
        atEnd = json.atEnd;
    }

    console.log(`Downloading ${items.length} items from collection '${collection}'...`);

    let counter = 0;
    for (const item of items) {
        counter++;

        const { id, user, image, flags } = item;
        const ext = image.split(".").pop();
        const filename = `${user}_${id}.${ext}`;

        console.log(`${counter}/${items.length} - Downloading ${filename} (${FOLDER[flags]}) ...`);

        try {
            const subdomain = ext === "mp4" ? "vid" : "img";
            const url = new URL(image, `https://${subdomain}.pr0gramm.com`).toString();

            const blob = await new Promise((resolve, reject) => {
                // bypass CORS issues (that start with page 2 for some reason)
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: function (response) {
                        if (response.status === 200) {
                            resolve(response.response);
                        } else {
                            reject(`Failed to fetch the file: ${response.status}`);
                        }
                    },
                    onerror: function (error) {
                        reject(error);
                    },
                });
            });

            zip.folder(FOLDER[flags]).file(filename, blob);
        } catch (error) {
            console.error(`Error downloading ${filename}:`, error);
            continue;
        }
    }

    console.log("Done downloading files!");

    console.log("Zipping...");

    const content = await zip.generateAsync({ type: "blob" });

    console.log("Done!");

    await GM_download(URL.createObjectURL(content), `${username} ${collection} ${timestamp()}.zip`);
    // note: download might fail if we revoke the object URL here
};

// bypass the userscript sandbox by injecting JSZip into the page
// apparently JSZip does not like running in a sandbox?
async function attachJSZip() {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    document.head.appendChild(script);

    return new Promise((resolve) => {
        script.onload = () => {
            resolve(new JSZip());
        };
    });
}
