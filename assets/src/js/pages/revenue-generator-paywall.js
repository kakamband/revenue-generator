/**
 * JS to handle plugin paywall preview screen interactions.
 *
 * @package revenue-generator
 */

/**
 * Internal dependencies.
 */
import '../utils';

(function ($) {
	$(function () {
		function revenueGeneratorPaywallPreview() {
			// Paywall screen elements.
			const $o = {
				body: $('body'),

				// Preview wrapper.
				previewWrapper: $('.rev-gen-preview-main'),

				// Search elements.
				searchContent: $('#rg_js_searchContent'),

				// Post elements.
				postPreviewWrapper: $('#rg_js_postPreviewWrapper'),
				postExcerpt       : $('#rg_js_postPreviewExcerpt'),
				postContent       : $('#rg_js_postPreviewContent'),

				// Overlay elements.
				purchaseOverly: $('#rg_js_purchaseOverly'),

				snackBar: $('#rg_js_SnackBar'),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function () {

				// When the page has loaded, load the post content.
				$(document).ready(function () {
					$('#rg_js_postPreviewWrapper').fadeIn('slow');
				});

				// When merchant types in the search box blur out the rest of the area.
				$o.searchContent.on('focus', function () {
					$o.postPreviewWrapper.addClass('blury');
					$('html, body').animate({scrollTop: 0}, 'slow');
					$o.body.css({
						overflow: 'hidden',
						height  : '100%',
					});
				});

				// Revert back to original state once the focus is no more on search box.
				$o.searchContent.on('focusout', function () {
					$o.body.css({
						overflow: 'auto',
						height  : 'auto',
					});
					$o.postPreviewWrapper.removeClass('blury');
				});
			};

			// Add paywall.
			const addPaywall = function () {
				const postExcerptExists = $o.postExcerpt.length ? true : false;
				if ($o.postContent) {
					// Blur the paid content out.
					$o.postContent.addClass('blur-content');

					// Get the template for purchase overlay.
					const template = wp.template('revgen-purchase-overlay');

					// Send the data to our new template function, get the HTML markup back.
					const overlayMarkup = template();
					$o.purchaseOverly.append(overlayMarkup);
					$o.purchaseOverly.show();
				}
			};

			// Initialize all required events.
			const initializePage = function () {
				bindEvents();
				addPaywall();
			};
			initializePage();
		}

		revenueGeneratorPaywallPreview();
	});
})(jQuery); // eslint-disable-line no-undef
