// ==UserScript==
// @name         [CONFLUENCE] Full quality profile pics
// @version      0.1
// @description  Swaps low-res profile pictures with their high-res counterparts
// @author       mkremer
// @match        https://confluence.apps.seibert-media.net/*
// @grant        none
// ==/UserScript==

/**
 * Known bugs:
 * Microblog: "load more" wont trigger image replacement for new images
 * 
 */

(function () {
	'use strict';

	const $ = window.jQuery;
	const entry = $("body")[0];
	const observerConfig = {
		attributes: true,
		childList: true,
		characterData: true
	};

	const qualify = () => {
		const unqualifiedImages = $(`
			.userLogoLink img:not([data-qualified]),
			.userLogo:not([data-qualified]),
			.avatar-img:not([data-qualified]),
			.avatar:not([data-qualified]),
			.aui-avatar-small img:not([data-qualified])
		`);

		unqualifiedImages.each((index, avatar) => {
			const originalPath = $(avatar).attr("src");
			if (!originalPath) return; // Could not read image source from element (probably not an image)
			const newPath = originalPath.replace(/([^\/]+$)/, "cup-ldap-profile-picture?api=v2");

			fetch(newPath, {
				method: "GET",
				cache: "force-cache"
			}).then(res => {
				if (res.ok) {
					$(avatar).attr("src", newPath).css({
						// filter: "blur(3px)"
					})
				}
			})
			$(avatar).attr("data-qualified", true);
		});
	}

	$(() => qualify());
	$(window).load(() => qualify());

	setInterval(qualify, 5000);

	const observer = new MutationObserver(() => qualify());
	observer.observe(entry, observerConfig);
})();
