/**
 * JS to handle plugin welcome screen interactions.
 *
 * @package revenue-generator
 */

/* global revenueGenerator */
(function ($) {
	$(
		function () {
			function revenueGeneratorWelcome() {
				// Welcome screen elements.
				const $o = {
						body: $('body'),

						// Cards.
						lowPostCard: $('#rg_js_lowPostCard'),
						highPostCard: $('#rg_js_highPostCard'),
					},

					/**
					 * Bind all element events.
					 */
					bindEvents = function () {
					},

					initializePage = function () {
						bindEvents();
					};
				initializePage();
			}

			revenueGeneratorWelcome();
		}
	);
}(jQuery));
