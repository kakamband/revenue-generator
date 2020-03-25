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
				restartTour   : $('#rg_js_RestartTutorial'),

				// Dashboard bar action items.
				newPaywall  : $('#rg_js_newPaywall'),
				sortPaywalls: $('#rg_js_filterPaywalls'),

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

				/**
				 * Handle paywall sorting dropdown.
				 */
				$o.sortPaywalls.on('change', function () {
					const sortBy = $(this).val();
					// Create form data.
					const formData = {
						action        : 'rg_set_paywall_order',
						rg_current_url: window.location.href,
						rg_sort_order : sortBy,
						security      : revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					// Delete the option.
					$.ajax({
						url     : revenueGeneratorGlobalOptions.ajaxUrl,
						method  : 'POST',
						data    : formData,
						dataType: 'json',
					}).done(function (r) {
						if (true === r.success && r.redirect_to) {
							window.location.href = r.redirect_to;
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
