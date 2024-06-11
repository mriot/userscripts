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
