// Returns a promise that resolves if a node matching the selector is added to the container.
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

// Executes the callback function if a node matching the selector is added to the container.
const nodeReadyCB = (selector, callback, container = "body", keepWatching = false) => {
    new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length && mutation.addedNodes[0].matches(selector)) {
                callback();
                keepWatching || observer.disconnect();
            }
        });
    }).observe(document.querySelector(container), { childList: true, subtree: true });
};
