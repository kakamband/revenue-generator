/* global revenueGeneratorGlobalOptions */
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
				purchaseOverly         : $('#rg_js_purchaseOverly'),
				purchaseOptionItems    : '.rg-purchase-overlay-purchase-options',
				purchaseOptionItem     : '.rg-purchase-overlay-purchase-options-item',
				purchaseOptionItemInfo : '.rg-purchase-overlay-purchase-options-item-info',
				purchaseOptionItemTitle: '.rg-purchase-overlay-purchase-options-item-info-title',
				purchaseOptionItemDesc : '.rg-purchase-overlay-purchase-options-item-info-description',
				purchaseOptionItemPrice: '.rg-purchase-overlay-purchase-options-item-price-span',

				// Action buttons
				editOption    : '.rg-purchase-overlay-option-edit',
				moveOptionUp  : '.rg-purchase-overlay-option-up',
				moveOptionDown: '.rg-purchase-overlay-option-down',

				// Option manager.
				optionRemove              : '.rg-purchase-overlay-option-remove',
				purchaseOptionType        : '#rg_js_purchaseOptionType',
				individualPricingWrapper  : '.rg-purchase-overlay-option-manager-pricing',
				individualPricingSelection: '.rg-purchase-overlay-option-pricing-selection',
				purchaseRevenueWrapper    : '.rg-purchase-overlay-option-manager-revenue',
				purchaseRevenueSelection  : '.rg-purchase-overlay-option-revenue-selection',
				durationWrapper           : '.rg-purchase-overlay-option-manager-duration',
				periodCountSelection      : '.rg-purchase-overlay-option-manager-duration-count',
				periodSelection           : '.rg-purchase-overlay-option-manager-duration-period',

				// Paywall publish actions.
				activatePaywall     : $('#rg_js_activatePaywall'),
				savePaywall         : $('#rg_js_savePaywall'),
				searchPaywallContent: $('#rg_js_searchPaywallContent'),
				paywallName         : $('.rev-gen-preview-main-paywall-name'),
				paywallTitle        : '.rg-purchase-overlay-title',
				paywallDesc         : '.rg-purchase-overlay-description',

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

				// Add action items on purchase item hover.
				$o.body.on('mouseenter', $o.purchaseOptionItem, function () {

					const currentActions = $(this).find('.rg-purchase-overlay-purchase-options-item-actions');

					if (currentActions.length) {
						currentActions.find('.rg-purchase-overlay-option-manager').hide();
						currentActions.show();
					} else {
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
					}
				});

				// Remove action items when purchase item is not being edited.
				$o.body.on('mouseleave', $o.purchaseOptionItem, function () {
					$(this).removeClass('option-highlight');
					$(this).find('.rg-purchase-overlay-purchase-options-item-actions').hide();
				});

				$o.body.on('click', $o.editOption, function () {

					const optionItem = $(this).parents('.rg-purchase-overlay-purchase-options-item');
					const actionItems = optionItem.find('.rg-purchase-overlay-purchase-options-item-actions');
					const actionManager = actionItems.find('.rg-purchase-overlay-option-manager');

					if (!actionManager.length) {

						const entityType = optionItem.data('purchase-type');

						// Send the data to our new template function, get the HTML markup back.
						const data = {
							entityType,
						};

						// Get the template for purchase overlay action.
						const actionTemplate = wp.template('revgen-purchase-overlay-item-manager');

						const actionMarkup = actionTemplate(data);

						// Add purchase option manager to the selected item.
						actionItems.prepend(actionMarkup);

						if ('individual' !== entityType) {
							// hide pricing type selection if not individual.
							const dynamicPricing = actionItems.find($o.individualPricingWrapper);
							const periodSelection = actionItems.find($o.durationWrapper);
							dynamicPricing.hide();

							// show period selection if not individual.
							periodSelection.find($o.periodSelection).val(optionItem.data('expiry-unit'));
							periodSelection.find($o.periodCountSelection).val(optionItem.data('expiry-value'));
							periodSelection.show();
						}

						const revenueWrapper = actionItems.find($o.purchaseRevenueWrapper);
						if ('subscription' === entityType) {
							revenueWrapper.hide();
						} else {
							revenueWrapper.show();
						}

					} else {
						actionManager.show();
					}
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
					const purchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');
					$(this).parents('.rg-purchase-overlay-purchase-options-item').next().insertBefore(purchaseOption);
				});

				// Handle change of purchase option type.
				$o.body.on('change', $o.purchaseOptionType, function () {
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const pricingManager = purchaseManager.find('.rg-purchase-overlay-option-manager-entity');
					const staticPricingOptions = purchaseManager.find($o.individualPricingWrapper);
					const revenueWrapper = purchaseManager.find($o.purchaseRevenueWrapper);
					const durationWrapper = purchaseManager.find($o.durationWrapper);

					// Hide dynamic pricing selection options if not Individual type.
					if ('individual' === pricingManager.val()) {
						staticPricingOptions.show();
						durationWrapper.hide();
					} else {
						staticPricingOptions.hide();
						durationWrapper.show();
					}

					// Hide revenue mode selection options if not Subscription type.
					if ('subscription' === pricingManager.val()) {
						revenueWrapper.hide();
					} else {
						revenueWrapper.show();
					}
				});

				// Handle revenue model change.
				$o.body.on('change', $o.individualPricingSelection, function () {
					const optionItem = $(this).parents($o.purchaseOptionItem);
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const pricingSelection = purchaseManager.find($o.individualPricingSelection);
					if (pricingSelection.prop('checked')) {
						optionItem.data('pricing-type', 'dynamic');
						pricingSelection.val(1);
					} else {
						optionItem.data('pricing-type', 'static');
						pricingSelection.val(0);
					}
				});

				// Handle pricing type change for individual type..
				$o.body.on('change', $o.purchaseRevenueSelection, function () {
					const optionItem = $(this).parents($o.purchaseOptionItem);
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const revenueSelection = purchaseManager.find($o.purchaseRevenueSelection);
					const priceItem = optionItem.find($o.purchaseOptionItemPrice);
					if (revenueSelection.prop('checked')) {
						priceItem.data('pay-model', 'ppu');
						revenueSelection.val(1);
					} else {
						priceItem.data('pay-model', 'sis');
						revenueSelection.val(0);
					}
				});

				// Period selection change handler.
				$o.body.on('change', $o.periodSelection, function () {
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const periodSelection = purchaseManager.find($o.periodSelection);
					const periodCountSelection = purchaseManager.find($o.periodCountSelection);
					changeDurationOptions(periodSelection.val(), periodCountSelection);
					const optionItem = $(this).parents($o.purchaseOptionItem);
					optionItem.data('expiry-unit', periodSelection.val());
				});

				// Period count selection change handler.
				$o.body.on('change', $o.periodCountSelection, function () {
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const periodCountSelection = purchaseManager.find($o.periodCountSelection);
					const optionItem = $(this).parents($o.purchaseOptionItem);
					optionItem.data('expiry-value', periodCountSelection.val());
				});

				$o.savePaywall.on('click', function () {

					const purchaseOptions = $($o.purchaseOptionItems);

					purchaseOptions.children($o.purchaseOptionItem).each(function () {
						// To add appropriate ids after saving.
						$(this).data('uid', createUniqueID());
					});

					// Store individual pricing.
					const individualOption = purchaseOptions.find("[data-purchase-type='individual']");
					let individualObj;

					if (individualOption.length) {
						individualObj = {
							title  : individualOption.find($o.purchaseOptionItemTitle).text().trim(),
							desc   : individualOption.find($o.purchaseOptionItemDesc).text().trim(),
							price  : individualOption.find($o.purchaseOptionItemPrice).text().trim(),
							revenue: individualOption.find($o.purchaseOptionItemPrice).data('pay-model'),
							type   : individualOption.data('pricing-type')
						};
					}

					// Store time pass pricing.
					const timePassOptions = purchaseOptions.find("[data-purchase-type='time-pass']");
					const timePasses = [];

					timePassOptions.each(function () {
						const timePass = $(this);
						const timePassObj = {
							title  : timePass.find($o.purchaseOptionItemTitle).text().trim(),
							desc   : timePass.find($o.purchaseOptionItemDesc).text().trim(),
							price  : timePass.find($o.purchaseOptionItemPrice).text().trim(),
							revenue: $(timePass.find($o.purchaseOptionItemPrice)).data('pay-model'),
							unit   : $(timePass).data('expiry-unit'),
							value  : $(timePass).data('expiry-value'),
							tlp_id : $(timePass).data('tlp-id'),
							uid    : $(timePass).data('uid'),
						};
						timePasses.push(timePassObj)
					});

					// Store subscription pricing.
					const subscriptionOptions = purchaseOptions.find("[data-purchase-type='subscription']");
					const subscriptions = [];

					subscriptionOptions.each(function () {
						const subscription = $(this);
						const subscriptionObj = {
							title  : subscription.find($o.purchaseOptionItemTitle).text().trim(),
							desc   : subscription.find($o.purchaseOptionItemDesc).text().trim(),
							price  : subscription.find($o.purchaseOptionItemPrice).text().trim(),
							revenue: $(subscription.find($o.purchaseOptionItemPrice)).data('pay-model'),
							unit   : $(subscription).data('expiry-unit'),
							value  : $(subscription).data('expiry-value'),
							sub_id : $(subscription).data('sub-id'),
							uid    : $(subscription).data('uid'),
						};
						subscriptions.push(subscriptionObj)
					});

					const paywall = {
						id   : purchaseOptions.data('paywall-id'),
						title: $o.purchaseOverly.find($o.paywallTitle).text().trim(),
						desc : $o.purchaseOverly.find($o.paywallDesc).text().trim(),
						name : $o.paywallName.text().trim(),
					};

					const data = {
						action       : 'rg_update_paywall',
						post_id      : $o.postPreviewWrapper.data('post-id'),
						paywall,
						individual   : individualObj,
						time_passes  : timePasses,
						subscriptions,
						security     : revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					updatePaywall(revenueGeneratorGlobalOptions.ajaxUrl, data);

				});

			};

			/**
			 *
			 * @param {string} ajaxURL  AJAX URL.
			 * @param {Object} formData Form data to be submitted.
			 */
			const updatePaywall = function (ajaxURL, formData) {
				$.ajax({
					url     : ajaxURL,
					method  : 'POST',
					data    : formData,
					dataType: 'json',
				}).done(function (r) {
					$o.snackBar.showSnackbar(r.msg, 1500);

					const purchaseOptions = $($o.purchaseOptionItems);

					purchaseOptions.data('paywall-id', r.paywall_id );

					const timePassOptions = purchaseOptions.find("[data-purchase-type='time-pass']");

					timePassOptions.each(function () {
						const timePassUID = $(this).data('uid');
						$(this).data('tlp-id',r.time_passes[timePassUID]);
					} );

					const subscriptionOptions = purchaseOptions.find("[data-purchase-type='subscription']");

					subscriptionOptions.each(function () {
						const subscriptionUID = $(this).data('uid');
						$(this).data('sub-id',r.subscriptions[subscriptionUID]);
					});
				});
			};

			/**
			 * Create a unique identifier.
			 */
			const createUniqueID = function () {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			};

			/**
			 * Create options markup based on period selection.
			 *
			 * @param {string} period   Type of period, i.e Year, Month, Day, Hour.
			 * @param {Object} $wrapper Select wrapper.
			 */
			const changeDurationOptions = function (period, $wrapper) {
				let options = [], limit = 24;

				// change duration options.
				if (period === 'y') {
					limit = 1;
				} else if (period === 'm') {
					limit = 12;
				}

				for (let i = 1; i <= limit; i++) {
					const option = $('<option/>', {
						value: i,
					});
					option.text(i);
					options.push(option);
				}

				$($wrapper).find('option').remove().end().append(options);
			};

			/**
			 * Adds paywall.
			 */
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
