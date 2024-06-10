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

### Callback version

Executes the callback function if a node matching the selector is added to the container.  
Optionally, you can keep watching for more nodes to be added.
```javascript
const nodeReady = (selector, callback, container = "body", keepWatching = false) => {
    new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length && mutation.addedNodes[0].matches(selector)) {
                callback();
                keepWatching || observer.disconnect();
            }
        });
    }).observe(document.querySelector(container), { childList: true, subtree: true });
};
```

#### Usage

```javascript
// keeping the observer running to watch for more nodes
nodeReady("img", () => console.log("node added"), "#container", true);

// watching for multiple nodes
["img", "div"].map((selector) => {
    nodeReady(selector, () => console.log(`${selector} added`), "#container");
});
```

### Promise version

Returns a promise that resolves if a node matching the selector is added to the container.
```javascript
const nodeReady = (selector, container = "body") => {
    return new Promise((resolve) => {
        new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length && mutation.addedNodes[0].matches(selector)) {
                    resolve();
                    observer.disconnect();
                }
            });
        }).observe(document.querySelector(container), { childList: true, subtree: true });
    });
};
```

#### Usage

```javascript
// using async/await and without a container selector (default is body)
(async () => {
    await nodeReady("img");
    console.log("node added");
})();

// using .then
nodeReady("img", "#container").then(() => console.log("node added"));

// watching for multiple nodes
["img", "div"].forEach((selector) => {
    nodeReady(selector, "#container").then(() => console.log(`${selector} added`));
});
```
