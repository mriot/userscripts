# A collection of some utility scripts

Userscripts enhance websites by extending or modifying certain behaviors or adding new features.  
They can be used with a userscript manager like [Violentmonkey](https://violentmonkey.github.io/) which is open source.

Scripts located within the [cheat-engine](cheat-engine/) folder are intended to be used with [Cheat Engine](https://www.cheatengine.org/).

## Installation

On GitHub, navigate to a script and click on it. Then press the <kbd>raw</kbd> button.  
This should automatically open the installation page of your userscript manager.

> [!IMPORTANT]
> Some scripts require you to modify them slightly before you can use them.  
> E.g. inserting the url of your jira instance.

---

## nodeReady()

This function waits for a node to be ready in the DOM and either executes a callback or returns a promise.

```javascript
/**
 * Wait for a node to be ready in the DOM.
 * Can be used with a callback or as a promise.
 *
 * @param {string} targetSelector - The CSS selector to watch for.
 * @param {string} containerSelector - The CSS selector of the container to watch.
 * @param {function} [callback] - The callback to execute when the node is ready. If not provided, a promise is returned.
 * @param {boolean} [keepWatching=false] - Whether to keep watching for new nodes. Can only be used with a callback.
 */
const nodeReady = (targetSelector, containerSelector, callback, keepWatching = false) => {
    const watcher = (resolve) => {
        const container = document.querySelector(containerSelector);
        const element = document.querySelector(targetSelector);
        if (element) return callback ? callback(element) : resolve(element);
        if (!container) return console.error(`nodeReady(): Container '${containerSelector}' not found.`);
        new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.matches(targetSelector)) {
                        callback ? callback(node) : resolve(node);
                        if (!keepWatching) observer.disconnect();
                        return;
                    }
                }
            }
        }).observe(container, { childList: true, subtree: true });
    };
    return callback ? watcher() : new Promise(watcher);
};
```

See [node-ready.js](node-ready.js)

#### Usage

```javascript
// callback mode & keeps watching for new nodes
nodeReady("img", "body", (node) => {
  console.log("hello from callback", node)
}, true);

// promise mode
nodeReady("img", "body").then((node) => {
  console.log("hello from promise", node)
});

// prmoise mode with async/await
(async () => {
  const node = await nodeReady("img", "body");
  console.log("hello from async/await", node);
})();

// watching for multiple nodes
["img.icon", "div"].forEach((selector) => {
    // nodeReady("selector", ...
});
```
