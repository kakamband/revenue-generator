/* global revenueGeneratorGlobalOptions */
/**
 * JS to handle plugin dashboard screen interactions.
 *
 * @package revenue-generator
 */

/**
 * Internal dependencies.
 */
import '../utils';

(function ($) {
	$(function () {
		function revenueGeneratorDashboard() {
			// Dashboard screen elements.
			const $o = {
				body          : $('body'),
				paywallPreview: '.rev-gen-dashboard-content-paywall-preview',

				snackBar: $('#rg_js_SnackBar'),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function () {
				/**
				 * Handle the next button events of the tour and update preview accordingly.
				 */
				$o.body.on('click', $o.paywallPreview, function () {
					const paywallId = $(this).attr('data-paywall-id');
					if (paywallId) {
						window.location.href = revenueGeneratorGlobalOptions.paywallPageBase + '&current_paywall=' + paywallId;
					}
				});
			};

			// Initialize all required events.
			const initializePage = function () {
				bindEvents();
			};
			initializePage();
		}

		revenueGeneratorDashboard();
	});
})(jQuery); // eslint-disable-line no-undef
