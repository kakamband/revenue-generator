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
import {__} from '@wordpress/i18n';

(function ($) {
	$(function () {
		function revenueGeneratorPaywallPreview() {
			// Paywall screen elements.
			const $o = {
				body: $('body'),

				requestSent: false,

				// Preview wrapper.
				previewWrapper: $('.rev-gen-preview-main'),
				layoutWrapper : $('.rev-gen-layout-wrapper'),
				laterpayLoader: $('.laterpay-loader-wrapper'),

				// Search elements.
				searchContentWrapper: $('.rev-gen-preview-main--search'),
				searchContent       : $('#rg_js_searchContent'),
				searchResultWrapper : $('.rev-gen-preview-main--search-results'),
				searchResultItem    : '.rev-gen-preview-main--search-results-item',

				// Post elements.
				postPreviewWrapper: $('#rg_js_postPreviewWrapper'),
				postTitle         : '.rev-gen-preview-main--post--title',
				postExcerpt       : $('#rg_js_postPreviewExcerpt'),
				postContent       : $('#rg_js_postPreviewContent'),

				// Overlay elements.
				purchaseOverlay          : $('#rg_js_purchaseOverlay'),
				purchaseOverlayRemove    : '.rg-purchase-overlay-remove',
				purchaseOptionItems      : '.rg-purchase-overlay-purchase-options',
				purchaseOptionItem       : '.rg-purchase-overlay-purchase-options-item',
				purchaseOptionItemInfo   : '.rg-purchase-overlay-purchase-options-item-info',
				purchaseOptionItemTitle  : '.rg-purchase-overlay-purchase-options-item-info-title',
				purchaseOptionItemDesc   : '.rg-purchase-overlay-purchase-options-item-info-description',
				purchaseOptionItemPrice  : '.rg-purchase-overlay-purchase-options-item-price-span',
				purchaseOptionPriceSymbol: '.rg-purchase-overlay-purchase-options-item-price-symbol',
				optionArea               : '.rg-purchase-overlay-option-area',
				addOptionArea            : '.rg-purchase-overlay-option-area-add-option',

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
				entitySelection           : '.rg-purchase-overlay-option-manager-entity',

				// Paywall publish actions.
				activatePaywall     : $('#rg_js_activatePaywall'),
				savePaywall         : $('#rg_js_savePaywall'),
				searchPaywallContent: $('#rg_js_searchPaywallContent'),
				searchPaywallWrapper: $('.rev-gen-preview-main--paywall-actions-search'),
				paywallName         : $('.rev-gen-preview-main-paywall-name'),
				paywallTitle        : '.rg-purchase-overlay-title',
				paywallDesc         : '.rg-purchase-overlay-description',
				paywallAppliesTo    : '.rev-gen-preview-main-paywall-applies-to',

				// Currency modal.
				currencyOverlay   : '.rev-gen-preview-main-currency-modal',
				currencyRadio     : '.rev-gen-preview-main-currency-modal-inputs-currency',
				currencyButton    : '.rev-gen-preview-main-currency-modal-button',
				currencyModalClose: '.rev-gen-preview-main-currency-modal-cross',

				// Purchase options warning modal.
				purchaseOptionWarningWrapper: '.rev-gen-preview-main-option-update',
				purchaseOperationContinue   : '#rg_js_continueOperation',
				purchaseOperationCancel     : '#rg_js_cancelOperation',

				// Purchase options info modal.
				purchaseOptionInfoButton: '.rg-purchase-overlay-option-info',
				purchaseOptionInfoModal : '.rev-gen-preview-main-info-modal',
				purchaseOptionInfoClose : '.rev-gen-preview-main-info-modal-cross',

				// Paywall remove warning modal.
				paywallRemovalModal: '.rev-gen-preview-main-remove-paywall',
				paywallRemove      : '#rg_js_removePaywall',
				paywallCancelRemove: '#rg_js_cancelPaywallRemoval',

				snackBar: $('#rg_js_SnackBar'),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function () {

				/**
				 * When the page has loaded, load the post content.
				 */
				$(document).ready(function () {
					$o.postPreviewWrapper.fadeIn('slow');
					$($o.paywallAppliesTo).trigger('change');

					// Get all purchase options.
					const allPurchaseOptions = $($o.purchaseOptionItems);
					if (allPurchaseOptions.length) {
						const paywallId = allPurchaseOptions.attr('data-paywall-id');

						// Enabled publish button if saved paywall.
						if (paywallId.length) {
							$o.activatePaywall.removeAttr('disabled');
						}
					}
				});

				/**
				 * Hide the post content search if not in focus and revert back to original title.
				 */
				$o.postPreviewWrapper.on('click', function () {
					// Hide result wrapper and revert search box text if no action was taken.
					$o.searchResultWrapper.hide();
					$o.searchContentWrapper.find('label').show();
					const searchText = $o.searchContent.val().trim();
					const postTitle = $($o.postTitle).text().trim();
					if (searchText !== postTitle) {
						$o.searchContent.val(postTitle);
					}
				});

				/**
				 * Handle the event when merchant has clicked a post for preview.
				 */
				$o.body.on('click', $o.searchResultItem, function () {
					const searchItem = $(this);
					const searchPostID = searchItem.attr('data-id');
					showPreviewContent(searchPostID);
				});

				/**
				 * When merchant starts to type in the search box blur out the rest of the area.
				 */
				$o.searchContent.on('focus', function () {
					$o.postPreviewWrapper.addClass('blury');
					$('html, body').animate({scrollTop: 0}, 'slow');
					$o.body.css({
						overflow: 'hidden',
						height  : '100%',
					});
				});

				/**
				 * Revert back to original state once the focus is no more on search box.
				 */
				$o.searchContent.on('focusout', function () {
					$o.body.css({
						overflow: 'auto',
						height  : 'auto',
					});
					$o.postPreviewWrapper.removeClass('blury');
				});

				/**
				 * Handle preview content search input.
				 */
				$o.searchContent.on('input change', debounce(function () {
					$o.searchContentWrapper.find('label').hide();
					const searchPostTerm = $(this).val().trim();
					const postTitle = $($o.postTitle).text().trim();
					if (searchPostTerm.length && searchPostTerm !== postTitle) {
						searchPreviewContent(searchPostTerm);
					}
				}, 1500));

				$o.searchPaywallContent.select2({
					ajax              : {
						url           : revenueGeneratorGlobalOptions.ajaxUrl,
						dataType      : 'json',
						delay         : 500,
						type          : 'POST',
						data          : function (params) {
							return {
								term    : params.term,
								action  : 'rg_search_term',
								security: revenueGeneratorGlobalOptions.rg_paywall_nonce,
							};
						},
						processResults: function (data) {
							let options = [];
							if (data) {
								$.each(data.categories, function (index) {
									const term = data.categories[index];
									options.push({
										id  : term.term_id,
										text: term.name
									});
								});
							}
							return {
								results: options
							};
						},
						cache         : true
					},
					placeholder       : __('search', 'revenue-generator'),
					language          : {
						inputTooShort: function () {
							return __('Please enter 1 or more characters.', 'revenue-generator');
						},
						noResults    : function () {
							return __('No results found.', 'revenue-generator');
						}
					},
					minimumInputLength: 1
				});

				$o.searchPaywallContent.on('change', function () {
					const categoryId = $(this).val();
					const currentCategoryId = $o.postPreviewWrapper.attr('data-access-id');

					// Remove current meta.
					if ( currentCategoryId ) {
						removeCurrentCategoryMeta( currentCategoryId );
					}

					if (categoryId) {
						$o.postPreviewWrapper.attr('data-access-id', categoryId);
					}
				});

				/**
				 * Add action items on purchase item hover.
				 */
				$o.body.on('mouseenter', $o.purchaseOptionItem, function () {
					// Hide the paywall border.
					$o.purchaseOverlay.removeClass('overlay-border');
					$($o.purchaseOverlayRemove).hide();

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

				/**
				 * Remove action items when purchase item is not being edited.
				 */
				$o.body.on('mouseleave', $o.purchaseOptionItem, function () {
					$(this).removeClass('option-highlight');
					$(this).find('.rg-purchase-overlay-purchase-options-item-actions').remove();
					$(this).find('.rg-purchase-overlay-option-manager').hide();
				});

				/**
				 * Handle purchase option edit operations.
				 */
				$o.body.on('click', $o.editOption, function () {
					const optionItem = $(this).parents('.rg-purchase-overlay-purchase-options-item');
					let actionManager = optionItem.find('.rg-purchase-overlay-option-manager');

					// Get all purchase options.
					const allPurchaseOptions = $($o.purchaseOptionItems);
					let doesIndividualOptionExist = false;

					// Check if an individual option exist.
					allPurchaseOptions.children($o.purchaseOptionItem).each(function () {
						if ('individual' === $(this).attr('data-purchase-type')) {
							doesIndividualOptionExist = true;
						}
					});

					if (!actionManager.length) {

						const entityType = optionItem.attr('data-purchase-type');

						// Send the data to our new template function, get the HTML markup back.
						const data = {
							entityType,
						};

						// Get the template for purchase overlay action.
						const actionTemplate = wp.template('revgen-purchase-overlay-item-manager');

						const actionMarkup = actionTemplate(data);

						// Add purchase option manager to the selected item.
						optionItem.prepend(actionMarkup);

						actionManager = optionItem.find('.rg-purchase-overlay-option-manager');
						const pricingManager = actionManager.find('.rg-purchase-overlay-option-manager-entity');

						// Duration selection.
						const periodSelection = actionManager.find($o.durationWrapper);

						if ('individual' !== entityType) {
							// hide pricing type selection if not individual.
							const dynamicPricing = actionManager.find($o.individualPricingWrapper);
							dynamicPricing.hide();

							// show period selection if not individual.
							periodSelection.find($o.periodSelection).val(optionItem.attr('data-expiry-duration'));
							periodSelection.find($o.periodCountSelection).val(optionItem.attr('data-expiry-period'));
							periodSelection.show();

							if (doesIndividualOptionExist) {
								const individualOption = pricingManager.find('option').filter('[value=individual]');
								individualOption.attr('disabled', true);
							}
						} else {
							periodSelection.hide();
						}

						const revenueWrapper = actionManager.find($o.purchaseRevenueWrapper);
						if ('subscription' === entityType) {
							revenueWrapper.hide();
						} else {
							// Set revenue model for selected option.
							const priceItem = optionItem.find($o.purchaseOptionItemPrice);
							const revenueModel = priceItem.attr('data-pay-model');
							if ('ppu' === revenueModel) {
								revenueWrapper.find($o.purchaseRevenueSelection).prop('checked', true);
							} else {
								revenueWrapper.find($o.purchaseRevenueSelection).prop('checked', false);
							}
							revenueWrapper.show();
						}

					} else {
						if (doesIndividualOptionExist) {
							const pricingManager = actionManager.find('.rg-purchase-overlay-option-manager-entity');
							const individualOption = pricingManager.find('option').filter('[value=individual]');
							individualOption.attr('disabled', true);
						}
						actionManager.show();
					}
				});

				/**
				 * Remove purchase option.
				 */
				$o.body.on('click', $o.optionRemove, function () {
					const purchaseItem = $(this).parents('.rg-purchase-overlay-purchase-options-item');
					const type = purchaseItem.attr('data-purchase-type');
					let entityId;
					if ('individual' === type) {
						entityId = purchaseItem.attr('data-paywall-id');
					} else if ('timepass' === type) {
						entityId = purchaseItem.attr('data-tlp-id');
					} else if ('subscription' === type) {
						entityId = purchaseItem.attr('data-sub-id');
					}

					// if id exists remove item from DB after confirmation.
					if (entityId) {
						showPurchaseOptionUpdateWarning().then((confirmation) => {
							if (true === confirmation) {
								purchaseItem.remove();
								reorderPurchaseItems();
								removePurchaseOption(type, entityId);
								$o.savePaywall.trigger('click')
							}
						});
					} else {
						purchaseItem.remove();
						reorderPurchaseItems();
					}
				});

				/**
				 * Move purchase option one up.
				 */
				$o.body.on('click', $o.moveOptionUp, function () {
					const purchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');
					$(this).parents('.rg-purchase-overlay-purchase-options-item').prev().insertAfter(purchaseOption);
					reorderPurchaseItems();
				});

				/**
				 * Move purchase option one down.
				 */
				$o.body.on('click', $o.moveOptionDown, function () {
					const purchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');
					$(this).parents('.rg-purchase-overlay-purchase-options-item').next().insertBefore(purchaseOption);
					reorderPurchaseItems();
				});

				/**
				 * Handle change of purchase option type.
				 */
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

				/**
				 * Handle revenue model change.
				 */
				$o.body.on('change', $o.individualPricingSelection, function () {
					const optionItem = $(this).parents($o.purchaseOptionItem);
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const pricingSelection = purchaseManager.find($o.individualPricingSelection);
					if (pricingSelection.prop('checked')) {
						optionItem.attr('data-pricing-type', 'dynamic');
						pricingSelection.val(1);
					} else {
						optionItem.attr('data-pricing-type', 'static');
						pricingSelection.val(0);
					}
				});

				/**
				 * Handle pricing type change for individual type.
				 */
				$o.body.on('change', $o.purchaseRevenueSelection, function () {
					const optionItem = $(this).parents($o.purchaseOptionItem);
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const revenueSelection = purchaseManager.find($o.purchaseRevenueSelection);
					const priceItem = optionItem.find($o.purchaseOptionItemPrice);
					if (revenueSelection.prop('checked')) {
						priceItem.attr('data-pay-model', 'ppu');
						revenueSelection.val(1);
					} else {
						priceItem.attr('data-pay-model', 'sis');
						revenueSelection.val(0);
					}
				});

				/**
				 * Period selection change handler.
				 */
				$o.body.on('change', $o.periodSelection, function () {
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const periodSelection = purchaseManager.find($o.periodSelection);
					const periodCountSelection = purchaseManager.find($o.periodCountSelection);
					changeDurationOptions(periodSelection.val(), periodCountSelection);
					const optionItem = $(this).parents($o.purchaseOptionItem);
					optionItem.attr('data-expiry-duration', periodSelection.val());
				});

				/**
				 * Period count selection change handler.
				 */
				$o.body.on('change', $o.periodCountSelection, function () {
					const purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');
					const periodCountSelection = purchaseManager.find($o.periodCountSelection);
					const optionItem = $(this).parents($o.purchaseOptionItem);
					optionItem.attr('data-expiry-period', periodCountSelection.val());
				});

				/**
				 * Handle price input and change.
				 */
				$o.body.on('focus input', $o.purchaseOptionItemPrice, debounce(function () {
					const optionItem = $(this).parents($o.purchaseOptionItem);
					const priceItem = optionItem.find($o.purchaseOptionItemPrice);
					const priceSymbol = optionItem.find($o.purchaseOptionPriceSymbol);

					const symbol = priceSymbol.text().trim();
					if (!symbol.length && !revenueGeneratorGlobalOptions.globalOptions.merchant_currency.length) {
						showCurrencySelectionModal();
					}

					const validatedPrice = validatePrice(priceItem.text().trim(), 'subscription' === optionItem.attr('data-purchase-type'));
					priceItem.empty().text(validatedPrice);
					validateRevenue(validatedPrice, optionItem);
				}, 1500));

				/**
				 * Handle currency selection.
				 */
				$o.body.on('change', $o.currencyRadio, function () {
					if ($(this).val().length) {
						const currencyButton = $($o.currencyOverlay).find($o.currencyButton);
						currencyButton.removeProp('disabled');
					}
				});

				/**
				 * Handle paywall applicable dropdown.
				 */
				$o.body.on('change', $o.paywallAppliesTo, function () {
					if ('exclude_category' === $(this).val() || 'category' === $(this).val()) {
						$o.searchPaywallWrapper.show();
						$o.postPreviewWrapper.attr('data-access-id', $o.searchPaywallContent.val());
					} else {
						$o.searchPaywallWrapper.hide();
						$o.postPreviewWrapper.attr('data-access-id', $o.postPreviewWrapper.attr('data-preview-id'));
					}
				});

				/**
				 * Handle currency submission.
				 */
				$o.body.on('click', $o.currencyButton, function () {
					// form data for currency.
					const formData = {
						action      : 'rg_update_currency_selection',
						config_key  : 'merchant_currency',
						config_value: $('input:radio[name=currency]:checked').val(),
						security    : revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					$.ajax({
						url     : revenueGeneratorGlobalOptions.ajaxUrl,
						method  : 'POST',
						data    : formData,
						dataType: 'json',
					}).done(function (r) {
						$($o.currencyModalClose).trigger('click');
						$o.snackBar.showSnackbar(r.msg, 1500);

						const purchaseOptions = $($o.purchaseOptionItems);
						purchaseOptions.children($o.purchaseOptionItem).each(function () {
							const priceSymbol = $(this).find($o.purchaseOptionPriceSymbol);
							const symbol = 'USD' === formData.config_value ? '$' : '€';
							priceSymbol.empty().text(symbol);
						});
					});
				});

				/**
				 * Close currency modal.
				 */
				$o.body.on('click', $o.currencyModalClose, function () {
					$o.previewWrapper.find($o.currencyOverlay).remove();
					$o.body.removeClass('modal-blur');
					$o.purchaseOverlay.css({
						filter          : 'unset',
						'pointer-events': 'unset',
					});
				});

				/**
				 * Hide the purchase option add button.
				 */
				$o.body.on('mouseenter', $o.optionArea, function () {
					// Hide the paywall border.
					$o.purchaseOverlay.removeClass('overlay-border');
					$($o.purchaseOverlayRemove).hide();

					// Only show if total count limit doesn't exceed.
					const currentOptionCount = $($o.purchaseOptionItems).find($o.purchaseOptionItem).length;
					if (currentOptionCount < 5) {
						$($o.addOptionArea).css({display: 'flex'});
					}
				});

				/**
				 * Hide the add option button when not in focus.
				 */
				$o.body.on('mouseleave', $o.optionArea, function () {
					$($o.addOptionArea).hide();
				});

				/**
				 * Add new option handler.
				 */
				$o.body.on('click', $o.addOptionArea, function () {
					// Only add if total count limit doesn't exceed.
					const currentOptionCount = $($o.purchaseOptionItems).find($o.purchaseOptionItem).length;
					if (currentOptionCount < 5) {
						// Get the template for default option.
						const optionItem = wp.template('revgen-default-purchase-option-item');
						$($o.purchaseOptionItems).append(optionItem);
					}
					reorderPurchaseItems();
				});

				/**
				 * Handle tooltip button events for info modals.
				 */
				$o.body.on('click', $o.purchaseOptionInfoButton, function () {
					const infoButton = $(this);
					const modalType = infoButton.attr('data-info-for');
					$o.previewWrapper.find($o.purchaseOptionInfoModal).remove();
					const template = wp.template(`revgen-info-${modalType}`);
					$o.previewWrapper.append(template);
					$o.body.addClass('modal-blur');
					$o.purchaseOverlay.css({
						filter          : 'blur(5px)',
						'pointer-events': 'none',
					});
				});

				/**
				 * Close info modal.
				 */
				$o.body.on('click', $o.purchaseOptionInfoClose, function () {
					$o.previewWrapper.find($o.purchaseOptionInfoModal).remove();
					$o.body.removeClass('modal-blur');
					$o.purchaseOverlay.css({
						filter          : 'unset',
						'pointer-events': 'unset',
					});
				});

				/**
				 * Add paywall border if hovering over the saved paywall area.
				 */
				$o.purchaseOverlay.on('mouseenter', function (e) {
					const paywall = $($o.purchaseOptionItems);
					const paywallId = paywall.attr('data-paywall-id');
					if (paywallId.length) {
						$o.purchaseOverlay.addClass('overlay-border');
						$($o.purchaseOverlayRemove).show();
					}
				});

				/**
				 * Hide the border and paywall remove button when not in focus.
				 */
				$o.purchaseOverlay.on('mouseleave', function () {
					$o.purchaseOverlay.removeClass('overlay-border');
					$($o.purchaseOverlayRemove).hide();
				});

				/**
				 * Remove the paywall after merchant confirmation.
				 */
				$o.body.on('click', $o.purchaseOverlayRemove, function () {
					showPaywallRemovalConfirmation().then((confirmation) => {
						if (true === confirmation) {
							removePaywall();
						}
					});
				});

				/**
				 * Handle the change of entity type i.e Individual, TimePass, Subscription.
				 */
				$o.body.on('change', $o.entitySelection, function (e) {
					const optionItem = $(this).parents($o.purchaseOptionItem);
					const currentType = optionItem.attr('data-purchase-type');
					const selectedEntityType = $(this).val();
					let entityId;

					if (currentType !== selectedEntityType) {

						// Set the id based on current type.
						if ('subscription' === currentType) {
							entityId = optionItem.attr('data-sub-id');
						} else if ('timepass' === currentType) {
							entityId = optionItem.attr('data-tlp-id');
						} else if ('individual' === currentType) {
							entityId = optionItem.attr('data-paywall-id-id');
						}

						if (entityId.length) {
							showPurchaseOptionUpdateWarning().then((confirmation) => {
								// If merchant selects to continue, remove current option from DB.
								if (true === confirmation) {
									// Remove the data from DB.
									removePurchaseOption(currentType, entityId, false);
									$o.savePaywall.trigger('click');

									// Remove all current attributes.
									optionItem.removeAttr('data-purchase-type');
									optionItem.removeAttr('data-expiry-duration');
									optionItem.removeAttr('data-expiry-period');
									optionItem.removeAttr('data-pricing-type');
									optionItem.removeAttr('data-paywall-id');
									optionItem.removeAttr('data-tlp-id');
									optionItem.removeAttr('data-sub-id');
									optionItem.removeAttr('data-uid');
									optionItem.removeAttr('data-order');

									// Add empty options for a fresh option.
									optionItem.attr('data-order', '');
									optionItem.attr('data-uid', '');
									optionItem.attr('data-purchase-type', selectedEntityType);

									// Add type specific options.
									if ('individual' !== selectedEntityType) {
										// Set default 1 Month period for changed option.

										const optionPrice = optionItem.find($o.purchaseOptionItemPrice);
										optionPrice.removeAttr('data-pay-model');

										if ('timepass' === selectedEntityType) {
											const timePassDefaultValues = revenueGeneratorGlobalOptions.defaultConfig.timepass;

											// Default value for new time pass.
											optionItem.attr('data-tlp-id', '');
											optionItem.attr('data-expiry-duration', timePassDefaultValues.duration);
											optionItem.attr('data-expiry-period', timePassDefaultValues.period);
											optionPrice.attr('data-pay-model', timePassDefaultValues.revenue);
											optionPrice.text(timePassDefaultValues.price);

											// Set option item info.
											optionItem.find($o.purchaseOptionItemTitle).text(timePassDefaultValues.title);
											optionItem.find($o.purchaseOptionItemDesc).text(timePassDefaultValues.description);
										} else if ('subscription' === selectedEntityType) {
											const subscriptionDefaultValues = revenueGeneratorGlobalOptions.defaultConfig.subscription;

											// Default value for new subscription.
											optionItem.attr('data-sub-id', '');
											optionItem.attr('data-expiry-duration', subscriptionDefaultValues.duration);
											optionItem.attr('data-expiry-period', subscriptionDefaultValues.period);
											optionPrice.attr('data-pay-model', subscriptionDefaultValues.revenue);
											optionPrice.text(subscriptionDefaultValues.price);

											// Set option item info.
											optionItem.find($o.purchaseOptionItemTitle).text(subscriptionDefaultValues.title);
											optionItem.find($o.purchaseOptionItemDesc).text(subscriptionDefaultValues.description);
										}
									} else {
										// Set static pricing by default if individual.
										optionItem.attr('data-pricing-type', 'static');
										optionItem.attr('data-paywall-id', '');
									}
								} else {
									optionItem.attr('data-purchase-type', currentType);
									$(this).val(currentType);
									return false;
								}
							});
						} else {
							optionItem.attr('data-purchase-type', selectedEntityType);
							$(this).val(selectedEntityType);
							return false;
						}
					}
				});

				/**
				 * Save Paywall and its purchase options.
				 */
				$o.savePaywall.on('click', function () {
					showLoader();
					reorderPurchaseItems();

					// Get all purchase options.
					const purchaseOptions = $($o.purchaseOptionItems);

					/**
					 * Loop through Time Passes and Subscriptions and add unique ids
					 * so that created id can be added accordingly.
					 */
					purchaseOptions.children($o.purchaseOptionItem).each(function () {
						const uid = $(this).attr('data-uid');
						if (!uid) {
							// To add appropriate ids after saving.
							$(this).attr('data-uid', createUniqueID());
						}
					});

					// Store individual pricing.
					const individualOption = purchaseOptions.find("[data-purchase-type='individual']");
					let individualObj;

					/**
					 * Create individual purchase option data.
					 */
					if (individualOption.length) {
						individualObj = {
							title  : individualOption.find($o.purchaseOptionItemTitle).text().trim(),
							desc   : individualOption.find($o.purchaseOptionItemDesc).text().trim(),
							price  : individualOption.find($o.purchaseOptionItemPrice).text().trim(),
							revenue: individualOption.find($o.purchaseOptionItemPrice).attr('data-pay-model'),
							type   : individualOption.attr('data-pricing-type'),
							order  : individualOption.attr('data-order')
						};
					}

					// Store time pass pricing.
					const timePassOptions = purchaseOptions.find("[data-purchase-type='timepass']");
					const timePasses = [];

					/**
					 * Create time passes data array.
					 */
					timePassOptions.each(function () {
						const timePass = $(this);
						const timePassObj = {
							title   : timePass.find($o.purchaseOptionItemTitle).text().trim(),
							desc    : timePass.find($o.purchaseOptionItemDesc).text().trim(),
							price   : timePass.find($o.purchaseOptionItemPrice).text().trim(),
							revenue : $(timePass.find($o.purchaseOptionItemPrice)).attr('data-pay-model'),
							duration: $(timePass).attr('data-expiry-duration'),
							period  : $(timePass).attr('data-expiry-period'),
							tlp_id  : $(timePass).attr('data-tlp-id'),
							uid     : $(timePass).attr('data-uid'),
							order   : $(timePass).attr('data-order')
						};
						timePasses.push(timePassObj)
					});

					// Store subscription pricing.
					const subscriptionOptions = purchaseOptions.find("[data-purchase-type='subscription']");
					const subscriptions = [];

					/**
					 * Create subscriptions data array.
					 */
					subscriptionOptions.each(function () {
						const subscription = $(this);
						const subscriptionObj = {
							title   : subscription.find($o.purchaseOptionItemTitle).text().trim(),
							desc    : subscription.find($o.purchaseOptionItemDesc).text().trim(),
							price   : subscription.find($o.purchaseOptionItemPrice).text().trim(),
							revenue : $(subscription.find($o.purchaseOptionItemPrice)).attr('data-pay-model'),
							duration: $(subscription).attr('data-expiry-duration'),
							period  : $(subscription).attr('data-expiry-period'),
							sub_id  : $(subscription).attr('data-sub-id'),
							uid     : $(subscription).attr('data-uid'),
							order   : $(subscription).attr('data-order')
						};
						subscriptions.push(subscriptionObj)
					});

					/**
					 * Paywall data.
					 */
					const paywall = {
						id        : purchaseOptions.attr('data-paywall-id'),
						title     : $o.purchaseOverlay.find($o.paywallTitle).text().trim(),
						desc      : $o.purchaseOverlay.find($o.paywallDesc).text().trim(),
						name      : $o.paywallName.text().trim(),
						applies   : $($o.paywallAppliesTo).val(),
						preview_id: $o.postPreviewWrapper.attr('data-preview-id'),
					};

					/**
					 * Final data of paywall.
					 */
					const data = {
						action       : 'rg_update_paywall',
						post_id      : $o.postPreviewWrapper.attr('data-access-id'),
						paywall      : paywall,
						individual   : individualObj,
						time_passes  : timePasses,
						subscriptions: subscriptions,
						security     : revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					// Update paywall data.
					updatePaywall(revenueGeneratorGlobalOptions.ajaxUrl, data);
				});
			};

			/**
			 * Clear category meta on change.
			 *
			 * @param categoryId
			 */
			const removeCurrentCategoryMeta = function ( categoryId ) {
				// prevent duplicate requests.
				if (!$o.requestSent) {
					$o.requestSent = true;

					// Create form data.
					const formData = {
						action         : 'rg_clear_category_meta',
						rg_category_id: categoryId,
						security       : revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					$.ajax({
						url     : revenueGeneratorGlobalOptions.ajaxUrl,
						method  : 'POST',
						data    : formData,
						dataType: 'json',
					}).done(function (r) {
						$o.requestSent = false;
					});
				}
			};

			/**
			 * Update the post preview based on selected preview content.
			 *
			 * @param {number} postId Post ID.
			 */
			const showPreviewContent = function (postId) {
				// prevent duplicate requests.
				if (!$o.requestSent) {
					$o.requestSent = true;

					// Create form data.
					const formData = {
						action         : 'rg_select_preview_content',
						post_preview_id: postId,
						security       : revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					$.ajax({
						url     : revenueGeneratorGlobalOptions.ajaxUrl,
						method  : 'POST',
						data    : formData,
						dataType: 'json',
					}).done(function (r) {
						$o.requestSent = false;
						if (r.redirect_to) {
							window.location.href = r.redirect_to;
						}
					});
				}
			};

			/**
			 * Search post content for preview based on merchants search term.
			 *
			 * @param {string} searchTerm The part of title being searched for preview.
			 */
			const searchPreviewContent = function (searchTerm) {
				if (searchTerm.length) {
					// prevent duplicate requests.
					if (!$o.requestSent) {
						$o.requestSent = true;

						// Create form data.
						const formData = {
							action     : 'rg_search_preview_content',
							search_term: searchTerm,
							security   : revenueGeneratorGlobalOptions.rg_paywall_nonce,
						};

						$.ajax({
							url     : revenueGeneratorGlobalOptions.ajaxUrl,
							method  : 'POST',
							data    : formData,
							dataType: 'json',
						}).done(function (r) {
							$o.requestSent = false;
							if (true === r.success) {
								$o.searchResultWrapper.empty();
								const postPreviews = r.preview_posts;
								postPreviews.forEach(function (item) {
									const searchItem = $('<span/>', {
										'data-id': item.id,
										class    : 'rev-gen-preview-main--search-results-item',
									}).text(item.title);
									$o.searchResultWrapper.append(searchItem);
									$o.searchResultWrapper.css({display: 'flex'});
								})
							} else {
								$o.snackBar.showSnackbar(r.msg, 1500);
							}
						});
					}
				}
			};

			/**
			 * Show the loader.
			 */
			const showLoader = function () {
				$o.laterpayLoader.css({display: 'flex'});
			};

			/**
			 * Hide the loader.
			 */
			const hideLoader = function () {
				$o.laterpayLoader.hide();
			};

			/**
			 * Remove paywall.
			 */
			const removePaywall = function () {

				const paywall = $($o.purchaseOptionItems);
				const paywallId = paywall.attr('data-paywall-id');

				// Create form data.
				const formData = {
					action  : 'rg_remove_paywall',
					id      : paywallId,
					security: revenueGeneratorGlobalOptions.rg_paywall_nonce,
				};

				// Delete the option.
				$.ajax({
					url     : revenueGeneratorGlobalOptions.ajaxUrl,
					method  : 'POST',
					data    : formData,
					dataType: 'json',
				}).done(function (r) {
					$o.snackBar.showSnackbar(r.msg, 1500);
					$o.purchaseOverlay.hide();
				});
			};

			/**
			 * Show the confirmation box for removing paywall.
			 */
			const showPaywallRemovalConfirmation = async function () {
				const confirm = await createPaywallRemovalConfirmation();
				$o.previewWrapper.find($o.paywallRemovalModal).remove();
				$o.body.removeClass('modal-blur');
				$o.purchaseOverlay.css({
					filter          : 'unset',
					'pointer-events': 'unset',
				});
				return confirm;
			};

			/**
			 * Create a confirmation modal with warning before removing paywall.
			 */
			const createPaywallRemovalConfirmation = function () {
				return new Promise((complete, failed) => {
					$o.previewWrapper.find($o.paywallRemovalModal).remove();

					// Get the template for confirmation popup and add it.
					const template = wp.template('revgen-remove-paywall');
					$o.previewWrapper.append(template);

					$o.body.addClass('modal-blur');
					$o.purchaseOverlay.css({
						filter          : 'blur(5px)',
						'pointer-events': 'none',
					});

					$($o.paywallRemove).off('click');
					$($o.paywallCancelRemove).off('click');

					$($o.paywallRemove).on('click', () => {
						$($o.paywallRemovalModal).hide();
						complete(true);
					});
					$($o.paywallCancelRemove).on('click', () => {
						$($o.paywallRemovalModal).hide();
						complete(false);
					});
				});
			};

			/**
			 * Show the confirmation box for saved entity update.
			 */
			const showPurchaseOptionUpdateWarning = async function () {
				const confirm = await createEntityUpdateConfirmation();
				$o.previewWrapper.find($o.purchaseOptionWarningWrapper).remove();
				$o.body.removeClass('modal-blur');
				$o.purchaseOverlay.css({
					filter          : 'unset',
					'pointer-events': 'unset',
				});
				return confirm;
			};

			/**
			 * Create a confirmation modal with warning before saved entity is updated.
			 */
			const createEntityUpdateConfirmation = function () {
				return new Promise((complete, failed) => {
					$o.previewWrapper.find($o.purchaseOptionWarningWrapper).remove();

					// Get the template for confirmation popup and add it.
					const template = wp.template('revgen-purchase-option-update');
					$o.previewWrapper.append(template);

					$o.body.addClass('modal-blur');
					$o.purchaseOverlay.css({
						filter          : 'blur(5px)',
						'pointer-events': 'none',
					});

					$($o.purchaseOperationContinue).off('click');
					$($o.purchaseOperationCancel).off('click');

					$($o.purchaseOperationContinue).on('click', () => {
						$($o.purchaseOptionWarningWrapper).hide();
						complete(true);
					});
					$($o.purchaseOperationCancel).on('click', () => {
						$($o.purchaseOptionWarningWrapper).hide();
						complete(false);
					});
				});
			};

			/**
			 * Remove purchase option from DB.
			 *
			 * @param {string}  type        Type of purchase option being removed.
			 * @param {number}  id          Id of the purchase option.
			 * @param {boolean} showMessage Should the message be shown for removal..
			 */
			const removePurchaseOption = function (type, id, showMessage = true) {

				const paywall = $($o.purchaseOptionItems);
				const paywallId = paywall.attr('data-paywall-id');

				// Create form data.
				const formData = {
					action    : 'rg_remove_purchase_option',
					type      : type,
					id        : id,
					paywall_id: paywallId,
					security  : revenueGeneratorGlobalOptions.rg_paywall_nonce,
				};

				// Delete the option.
				$.ajax({
					url     : revenueGeneratorGlobalOptions.ajaxUrl,
					method  : 'POST',
					data    : formData,
					dataType: 'json',
				}).done(function (r) {
					if (true === showMessage) {
						$o.snackBar.showSnackbar(r.msg, 1500);
					}
				});
			};

			/**
			 * Update purchase options order.
			 */
			const reorderPurchaseItems = function () {
				// Get all purchase options.
				const purchaseOptions = $($o.purchaseOptionItems);

				/**
				 * Loop through all purchase options and update reorder.
				 */
				purchaseOptions.children($o.purchaseOptionItem).each(function (i) {
					const order = i + 1;
					$(this).attr('data-order', order);
				});
			};

			/**
			 * Validate the purchase item revenue model.
			 *
			 * @param {string} price         Price of the item.
			 * @param {Object} purchaseItem  Purchase option.
			 */
			const validateRevenue = function (price, purchaseItem) {
				const purchaseManager = $(purchaseItem).find('.rg-purchase-overlay-option-manager');
				const revenueWrapper = purchaseManager.find($o.purchaseRevenueWrapper);
				if (price > revenueGeneratorGlobalOptions.currency.sis_only_limit) {
					$(purchaseItem).find($o.purchaseOptionItemPrice).attr('data-pay-model', 'sis');
					revenueWrapper.find($o.purchaseRevenueSelection).prop('checked', false);
				} else if (price > revenueGeneratorGlobalOptions.currency.ppu_min && price < revenueGeneratorGlobalOptions.currency.sis_min) {
					$(purchaseItem).find($o.purchaseOptionItemPrice).attr('data-pay-model', 'ppu');
					revenueWrapper.find($o.purchaseRevenueSelection).prop('checked', true);
				}
			};

			/**
			 * Get validated price.
			 *
			 * @param {string}  price                   Purchase option price.
			 * @param {boolean} subscriptionValidation  Is current item subscription.
			 * @returns {string}
			 */
			const validatePrice = function (price, subscriptionValidation) {
				// strip non-number characters
				price = price.replace(/[^0-9\,\.]/g, '');

				// convert price to proper float value
				price = parseFloat(price.replace(',', '.')).toFixed(2);

				// prevent non-number prices
				if (isNaN(price)) {
					price = 0;
				}

				// prevent negative prices
				price = Math.abs(price);

				if (subscriptionValidation) {
					if (price < revenueGeneratorGlobalOptions.currency.sis_min) {
						price = revenueGeneratorGlobalOptions.currency.sis_min;
					} else if (price > revenueGeneratorGlobalOptions.currency.sis_max) {
						price = revenueGeneratorGlobalOptions.currency.sis_max;
					}
				} else {
					// correct prices outside the allowed range of 0.05 - 149.99
					if (price > revenueGeneratorGlobalOptions.currency.sis_max) {
						price = revenueGeneratorGlobalOptions.currency.sis_max;
					} else if (price > 0 && price < revenueGeneratorGlobalOptions.currency.ppu_min) {
						price = revenueGeneratorGlobalOptions.currency.ppu_min;
					}
				}

				// format price with two digits
				price = price.toFixed(2);

				// localize price
				if (revenueGeneratorGlobalOptions.locale.indexOf('de_DE') !== -1) {
					price = price.replace('.', ',');
				}

				return price;
			};

			/**
			 * Add currency modal.
			 */
			const showCurrencySelectionModal = function () {
				$o.previewWrapper.find($o.currencyOverlay).remove();
				// Get the template for currency popup and add it.
				const template = wp.template('revgen-purchase-currency-overlay');
				$o.previewWrapper.append(template);
				$o.body.addClass('modal-blur');
				$o.purchaseOverlay.css({
					filter          : 'blur(5px)',
					'pointer-events': 'none',
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
					hideLoader();
					$o.snackBar.showSnackbar(r.msg, 1500);

					const purchaseOptions = $($o.purchaseOptionItems);

					if (r.paywall_id.length) {
						$o.activatePaywall.removeAttr('disabled');
					}

					// Set main paywall id.
					purchaseOptions.attr('data-paywall-id', r.paywall_id);

					const individualOption = purchaseOptions.find("[data-purchase-type='individual']");
					if (individualOption.length) {
						individualOption.attr('data-paywall-id', r.paywall_id);
					}

					const timePassOptions = purchaseOptions.find("[data-purchase-type='timepass']");
					if (timePassOptions.length) {
						// Add returned ids to appropriate purchase option.
						timePassOptions.each(function () {
							const timePassUID = $(this).attr('data-uid');
							$(this).attr('data-tlp-id', r.time_passes[timePassUID]);
						});
					}

					const subscriptionOptions = purchaseOptions.find("[data-purchase-type='subscription']");
					if (subscriptionOptions.length) {
						// Add returned ids to appropriate purchase option.
						subscriptionOptions.each(function () {
							const subscriptionUID = $(this).attr('data-uid');
							$(this).attr('data-sub-id', r.subscriptions[subscriptionUID]);
						});
					}

					if (r.redirect_to) {
						window.location.href = r.redirect_to;
					}
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
					$o.purchaseOverlay.append(template);
					$o.purchaseOverlay.show();
				}
			};

			/**
			 * Throttle the execution of a function by a given delay.
			 */
			const debounce = function (fn, delay) {
				var timer;
				return function () {
					var context = this,
						args = arguments;

					clearTimeout(timer);

					timer = setTimeout(function () {
						fn.apply(context, args);
					}, delay);
				};
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
