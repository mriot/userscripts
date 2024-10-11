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

## nodeReady - utility

A utility function that waits for a node to be ready in the DOM and either executes a callback or returns a promise.

-> [node-ready.js](node-ready.js)

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
