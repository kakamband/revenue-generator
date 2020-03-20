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
				newPaywall    : $('#rg_js_newPaywall'),
				restartTour   : $('#rg_js_RestartTutorial'),

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

				/**
				 * Restart the tour from dashboard.
				 */
				$o.restartTour.on('click', function () {
					// Create form data.
					const formData = {
						action      : 'rg_restart_tour',
						restart_tour: '1',
						security    : revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					// Delete the option.
					$.ajax({
						url     : revenueGeneratorGlobalOptions.ajaxUrl,
						method  : 'POST',
						data    : formData,
						dataType: 'json',
					}).done(function (r) {
						if (true === r.success) {
							window.location = $o.newPaywall.attr('href');
						}
					});
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
