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
				purchaseOverly    : $('#rg_js_purchaseOverly'),
				purchaseOptionItem: '.rg-purchase-overlay-purchase-options-item',

				// Action buttons
				editOption    : '.rg-purchase-overlay-option-edit',
				moveOptionUp  : '.rg-purchase-overlay-option-up',
				moveOptionDown: '.rg-purchase-overlay-option-down',

				// Option manager.
				optionRemove: '.rg-purchase-overlay-option-remove',

				snackBar: $('#rg_js_SnackBar'),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function () {

				// When the page has loaded, load the post content.
				$(document).ready(function () {
					$('#rg_js_postPreviewWrapper').fadeIn('slow');

					$( 'div.rg-purchase-overlay-purchase-options' ).sortable({
						cursor: 'move',
						connectWith: 'div.rg-purchase-overlay-purchase-options-item'
					});
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

				// Add action items on purchase item hover.
				$o.body.on('mouseenter', $o.purchaseOptionItem, function () {

					// Get the template for purchase overlay action.
					const actionTemplate = wp.template('revgen-purchase-overlay-actions');

					// Send the data to our new template function, get the HTML markup back.
					const data = {
						showMoveUp  : $(this).prev('.rg-purchase-overlay-purchase-options-item').length,
						showMoveDown: $(this).next('.rg-purchase-overlay-purchase-options-item').length
					};

					const overlayMarkup = actionTemplate(data);

					// Highlight the current option being edited.
					$(this).addClass('option-highlight');

					// Add purchase option actions to the highlighted item.
					$(this).prepend(overlayMarkup);
				});

				// Remove action items when purchase item is not being edited.
				$o.body.on('mouseleave', $o.purchaseOptionItem, function () {
					$(this).removeClass('option-highlight');
					$(this).find('.rg-purchase-overlay-purchase-options-item-actions').remove();
				});

				$o.body.on('click', $o.editOption, function () {

					// Get the template for purchase overlay action.
					const actionTemplate = wp.template('revgen-purchase-overlay-item-manager');

					// Add purchase option manager to the selected item.
					$(this).prepend(actionTemplate);
				});

				// Remove purchase option.
				$o.body.on('click', $o.optionRemove, function () {
					// @todo add functionality to delete entity from db when removed.
					$(this).parents('.rg-purchase-overlay-purchase-options-item').remove();
				});

				//  Move purchase option one up.
				$o.body.on('click', $o.moveOptionUp, function () {
					const pruchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');
					$(this).parents('.rg-purchase-overlay-purchase-options-item').prev().insertAfter(pruchaseOption);
				});

				//  Move purchase option one down.
				$o.body.on('click', $o.moveOptionDown, function () {
					const pruchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');
					$(this).parents('.rg-purchase-overlay-purchase-options-item').next().insertBefore(pruchaseOption);
				});

			};

			// Add paywall.
			const addPaywall = function () {
				const postExcerptExists = $o.postExcerpt.length ? true : false;
				if ($o.postContent) {
					// Blur the paid content out.
					$o.postContent.addClass('blur-content');

					// Get the template for purchase overlay along with data.
					const template = wp.template('revgen-purchase-overlay');

					// Send the data to our new template function, get the HTML markup back.
					$o.purchaseOverly.append(template);
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
