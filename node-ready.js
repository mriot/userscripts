/**
 * Wait for a node to be ready in the DOM.
 * Can be used with a callback or as a promise.
 *
 * @param {string} selector - The CSS selector to watch for.
 * @param {string} container - The CSS selector of the container to watch.
 * @param {function} [callback] - The callback to execute when the node is ready. If not provided, a promise is returned.
 * @param {boolean} [keepWatching=false] - Whether to keep watching for new nodes. Can only be used with a callback.
 */
const nodeReady = (selector, container, callback, keepWatching = false) => {
    const watcher = (resolve) => {
        const element = document.querySelector(selector);
        if (element) {
            callback ? callback(element) : resolve(element);
            return;
        }
        new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.matches(selector)) {
                        callback ? callback(node) : resolve(node);
                        if (!keepWatching) observer.disconnect();
                        return;
                    }
                }
            }
        }).observe(document.querySelector(container), { childList: true, subtree: true });
    };
    return callback ? watcher() : new Promise(watcher);
};
