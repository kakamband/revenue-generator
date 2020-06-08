/* global revenueGeneratorGlobalOptions, Shepherd, tippy */
/**
 * JS to handle plugin paywall preview screen interactions.
 *
 * @package revenue-generator
 */

/**
 * Internal dependencies.
 */
import '../utils';
import { debounce } from '../helpers';
import { __, sprintf } from '@wordpress/i18n';

( function( $ ) {
	$( function() {
		function revenueGeneratorPaywallPreview() {
			// Paywall screen elements.
			const $o = {
				body: $( 'body' ),

				requestSent: false,
				isPublish: false,

				// Preview wrapper and Contribution Wrapper.
				previewWrapper: $(
					'.rev-gen-preview-main, .rev-gen-contribution-main'
				),
				layoutWrapper: $( '.rev-gen-layout-wrapper' ),
				laterpayLoader: $( '.laterpay-loader-wrapper' ),
				noResultsWrapper: '.rev-gen-preview-main-no-result',

				// Contribution elements for account modal.
				contributionBox: $( '.rev-gen-contribution-main--box' ),

				// Search elements.
				searchContentWrapper: $( '.rev-gen-preview-main--search' ),
				searchContent: $( '#rg_js_searchContent' ),
				currentPaywall: $( '#rg_currentPaywall' ),
				searchResultWrapper: $(
					'.rev-gen-preview-main--search-results'
				),
				searchResultItem: '.rev-gen-preview-main--search-results-item',

				// Post elements.
				postPreviewWrapper: $( '#rg_js_postPreviewWrapper' ),
				postTitle: '.rev-gen-preview-main--post--title',
				postExcerpt: $( '#rg_js_postPreviewExcerpt' ),
				postContent: $( '#rg_js_postPreviewContent' ),

				// Overlay elements.
				purchaseOverlay: $( '#rg_js_purchaseOverlay' ),
				purchaseOverlayRemove: '.rg-purchase-overlay-remove',
				purchaseOptionItems: '.rg-purchase-overlay-purchase-options',
				purchaseOptionItem:
					'.rg-purchase-overlay-purchase-options-item',
				purchaseOptionItemInfo:
					'.rg-purchase-overlay-purchase-options-item-info',
				purchaseOptionItemTitle:
					'.rg-purchase-overlay-purchase-options-item-info-title',
				purchaseOptionItemDesc:
					'.rg-purchase-overlay-purchase-options-item-info-description',
				purchaseItemPriceIcon:
					'.rg-purchase-overlay-purchase-options-item-price-icon',
				purchaseOptionItemPrice:
					'.rg-purchase-overlay-purchase-options-item-price-span',
				purchaseOptionPriceSymbol:
					'.rg-purchase-overlay-purchase-options-item-price-symbol',
				optionArea: '.rg-purchase-overlay-option-area',
				addOptionArea: '.rg-purchase-overlay-option-area-add-option',
				previewSecondItem:
					'.rg-purchase-overlay-purchase-options .option-item-second',

				// Action buttons
				editOption: '.rg-purchase-overlay-option-edit',

				// Option manager.
				optionRemove: '.rg-purchase-overlay-option-remove',
				purchaseOptionType: '#rg_js_purchaseOptionType',
				optionManager: '.rg-purchase-overlay-option-manager',
				individualPricingWrapper:
					'.rg-purchase-overlay-option-manager-pricing',
				individualPricingSelection:
					'.rg-purchase-overlay-option-pricing-selection',
				purchaseRevenueWrapper:
					'.rg-purchase-overlay-option-manager-revenue',
				purchaseRevenueSelection:
					'.rg-purchase-overlay-option-revenue-selection',
				durationWrapper: '.rg-purchase-overlay-option-manager-duration',
				periodCountSelection:
					'.rg-purchase-overlay-option-manager-duration-count',
				periodSelection:
					'.rg-purchase-overlay-option-manager-duration-period',
				entitySelection: '.rg-purchase-overlay-option-manager-entity',

				// Paywall publish actions.
				addPaywall: '#rj_js_addNewPaywall',
				gotoDashboard: '#rg_js_gotoDashboard',
				actionsWrapper: $( '.rev-gen-preview-main--paywall-actions' ),
				actionButtons: $(
					'.rev-gen-preview-main--paywall-actions-update'
				),
				activatePaywall: $( '#rg_js_activatePaywall' ),
				savePaywall: $( '#rg_js_savePaywall' ),
				searchPaywallContent: $( '#rg_js_searchPaywallContent' ),
				searchPaywallWrapper: $(
					'.rev-gen-preview-main--paywall-actions-search'
				),
				paywallName: $( '.rev-gen-preview-main-paywall-name' ),
				paywallTitle: '.rg-purchase-overlay-title',
				paywallDesc: '.rg-purchase-overlay-description',
				paywallAppliesTo: '.rev-gen-preview-main-paywall-applies-to',

				// Currency modal.
				currencyOverlay: '.rev-gen-preview-main-currency-modal',
				currencyRadio:
					'.rev-gen-preview-main-currency-modal-inputs-currency',
				currencyButton: '.rev-gen-preview-main-currency-modal-button',
				currencyModalClose:
					'.rev-gen-preview-main-currency-modal-cross',

				// Purchase options warning modal.
				purchaseOptionWarningWrapper:
					'.rev-gen-preview-main-option-update',
				purchaseOptionWarningMessage:
					'.rev-gen-preview-main-option-update-message',
				purchaseOperationContinue: '#rg_js_continueOperation',
				purchaseOperationCancel: '#rg_js_cancelOperation',

				// Paywall warnning modal.
				newPaywallWarningContinue: '#rg_js_continueSearch',
				newPaywallWarningCancel: '#rg_js_cancelSearch',

				// Purchase options info modal.
				purchaseOptionInfoButton: '.rg-purchase-overlay-option-info',
				purchaseOptionInfoModal: '.rev-gen-preview-main-info-modal',

				// Paywall remove warning modal.
				paywallRemovalModal: '.rev-gen-preview-main-remove-paywall',
				paywallRemove: '#rg_js_removePaywall',
				paywallCancelRemove: '#rg_js_cancelPaywallRemoval',

				// Account activation modal.
				activationModal: '.rev-gen-preview-main-account-modal',
				activationModalClose:
					'.rev-gen-preview-main-account-modal-cross',
				connectAccount: '#rg_js_connectAccount',
				accountSignup: '#rg_js_signUp',
				activateAccount: '#rg_js_verifyAccount',
				reVerifyAccount: '#rg_js_restartVerification',
				accountActionsWrapper:
					'.rev-gen-preview-main-account-modal-action',
				accountActionsFields:
					'.rev-gen-preview-main-account-modal-fields',
				accountCredentialsInfo:
					'.rev-gen-preview-main-account-modal-credentials-info',
				accountActionId:
					'.rev-gen-preview-main-account-modal-fields-merchant-id',
				accountActionKey:
					'.rev-gen-preview-main-account-modal-fields-merchant-key',
				accountActionTitle:
					'.rev-gen-preview-main-account-modal-fields-title',
				accountActions: '.rev-gen-preview-main-account-modal-actions',
				accountVerificationLoader:
					'.rev-gen-preview-main-account-modal-fields-loader',
				activationModalError:
					'.rev-gen-preview-main-account-modal-error',
				activationModalSuccess:
					'.rev-gen-preview-main-account-modal-success',
				activationModalSuccessTitle:
					'.rev-gen-preview-main-account-modal-success-title',
				activationModalSuccessMessage:
					'.rev-gen-preview-main-account-modal-success-message',
				activationModalWarningMessage:
					'.rev-gen-preview-main-account-modal-warning-message',
				activateSignup: '#rg_js_activateSignup',
				warningSignup: '#rg_js_warningSignup',
				viewPost: '#rg_js_viewPost',
				viewDashboard: '#rg_js_viewDashboard',
				// Tour elements.
				exitTour: '.rev-gen-exit-tour',

				snackBar: $( '#rg_js_SnackBar' ),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function() {
				/**
				 * When the page has loaded, load the post content.
				 */
				$( document ).ready( function() {
					$o.postPreviewWrapper.fadeIn( 'slow' );

					// Highlight search bar and add tooltip, change background-color for wrapper.
					if ( $( $o.noResultsWrapper ).length ) {
						$o.layoutWrapper.css( {
							'background-color': 'rgba(0, 0, 0, 0.5)',
							'min-height': '800px',
						} );
						$o.searchContentWrapper.css( {
							'background-color': '#fff',
						} );
						const tippyInstance = tippy(
							document.querySelector(
								'.rev-gen-preview-main--search'
							),
							{
								arrow: tippy.roundArrow,
							}
						);
						tippyInstance.show();
					}

					$( $o.paywallAppliesTo ).trigger( 'change' );

					// Get all purchase options.
					const allPurchaseOptions = $( $o.purchaseOptionItems );
					if ( allPurchaseOptions.length ) {
						// Store individual pricing.
						const individualOption = allPurchaseOptions.find(
							"[data-purchase-type='individual']"
						);
						const pricingType = individualOption.attr(
							'data-pricing-type'
						);
						if ( 'dynamic' === pricingType ) {
							individualOption
								.find( $o.purchaseItemPriceIcon )
								.show();
							// Initialize tooltip for element.
							initializeTooltip(
								'.rg-purchase-overlay-purchase-options-item-price-icon'
							);
						}
					}

					// Start the welcome tour.
					if (
						revenueGeneratorGlobalOptions.globalOptions
							.average_post_publish_count.length &&
						0 ===
							parseInt(
								revenueGeneratorGlobalOptions.globalOptions
									.is_paywall_tutorial_completed
							) &&
						allPurchaseOptions &&
						allPurchaseOptions.length > 0
					) {
						const tour = initializeTour();
						addTourSteps( tour );
						startWelcomeTour( tour );
					}
				} );

				/**
				 * Handle the next button events of the tour and update preview accordingly.
				 */
				$o.body.on( 'click', '.shepherd-button', function() {
					const currentStep = Shepherd.activeTour.getCurrentStep();
					const stepId = currentStep.id;
					$( $o.purchaseOptionItem ).css( {
						'background-color': 'darkgray',
					} );

					$( $o.purchaseOptionItemInfo ).css( {
						'border-right': '1px solid #928d8d',
					} );

					if ( 'rg-purchase-option-item' === stepId ) {
						$( $o.previewSecondItem ).trigger( 'mouseenter' );
						$o.searchContentWrapper.css( {
							'background-color': '#a9a9a9',
						} );
						$( $o.previewSecondItem ).css( {
							'background-color': '#fff',
						} );
						$( $o.previewSecondItem )
							.find( $o.purchaseOptionItemInfo )
							.css( {
								'border-right': '1px solid #e3e4e6',
							} );
					} else if ( 'rg-purchase-option-item-price' === stepId ) {
						$( $o.optionArea ).trigger( 'mouseenter' );
						$( $o.previewSecondItem ).trigger( 'mouseleave' );
					} else if ( 'rg-purchase-option-paywall-name' === stepId ) {
						$( $o.paywallAppliesTo ).val( 'category' );
						$( $o.paywallAppliesTo ).trigger( 'change' );
						$( $o.optionArea ).trigger( 'mouseleave' );
						// Hack to get tooltip on expected place.
						Shepherd.activeTour.next();
						Shepherd.activeTour.back();
					} else if (
						'rg-purchase-option-paywall-publish' === stepId
					) {
						$o.activatePaywall.css( 'background-color', '#000' );
					}
				} );

				/**
				 * Complete the tour when exit tour is clicked.
				 */
				$o.body.on( 'click', $o.exitTour, function() {
					if (
						typeof Shepherd !== 'undefined' &&
						typeof Shepherd.activeTour !== 'undefined'
					) {
						Shepherd.activeTour.complete();
					}
				} );

				/**
				 * Hide the post content search if not in focus and revert back to original title.
				 */
				$o.postPreviewWrapper.on( 'click', function() {
					// Hide result wrapper and revert search box text if no action was taken.
					$o.searchResultWrapper.hide();
					$o.searchContentWrapper.find( 'label' ).show();
					const searchText = $o.searchContent.val().trim();
					const postTitle = $( $o.postTitle )
						.text()
						.trim();
					if ( searchText !== postTitle ) {
						$o.searchContent.val( postTitle );
					}
				} );

				/**
				 * Handle the event when merchant has clicked a post for preview.
				 */
				$o.body.on( 'click', $o.searchResultItem, function() {
					const searchItem = $( this );
					const searchPostID = searchItem.attr( 'data-id' );
					showPreviewContent( searchPostID );
				} );

				/**
				 * When merchant starts to type in the search box blur out the rest of the area.
				 */
				$o.searchContent.on( 'focus', function() {
					$o.postPreviewWrapper.addClass( 'blury' );
					$( 'html, body' ).animate( { scrollTop: 0 }, 'slow' );
					$o.body.css( {
						overflow: 'hidden',
						height: '100%',
					} );
				} );

				/**
				 * When merchant click in the search box blur out the rest of the area and prompt if existing.
				 */
				$o.searchContent.on( 'click', function() {
					// Check for existing paywall.
					const paywallId = $o.currentPaywall.val();
					if ( ! paywallId ) {
						return false;
					}

					// take promise for popupbox.
					return new Promise( ( complete ) => {
						const template = wp.template(
							'revgen-new-paywall-warning'
						);
						$o.previewWrapper.append( template );

						$o.body.addClass( 'modal-blur' );
						$o.actionsWrapper.css( 'background-color', '#a9a9a9' );
						$o.layoutWrapper.css( {
							'pointer-events': 'unset',
						} );
						$o.body
							.find( 'input, select, button' )
							.not(
								'#rg_js_searchContent,' +
									$o.newPaywallWarningContinue +
									',' +
									$o.newPaywallWarningCancel
							)
							.addClass( 'input-blur' );

						$( $o.newPaywallWarningContinue ).off( 'click' );
						$( $o.newPaywallWarningCancel ).off( 'click' );

						// On Continue button click.
						$( $o.newPaywallWarningContinue ).on( 'click', () => {
							$o.postPreviewWrapper.addClass( 'blury' );
							$( 'html, body' ).animate(
								{ scrollTop: 0 },
								'slow'
							);
							$o.body.css( {
								overflow: 'hidden',
								height: '100%',
							} );
							$o.body.removeClass( 'modal-blur' );
							$o.body
								.find( 'input, select, button' )
								.removeClass( 'input-blur' );
							$o.layoutWrapper.css( {
								'pointer-events': 'unset',
							} );
							$o.actionsWrapper.css( 'background-color', '#fff' );
							$( '.search-paywall-warning-modal' ).remove();
							$( this ).focus();
							complete( true );
						} );

						// On Cancel button click.
						$( $o.newPaywallWarningCancel ).on( 'click', () => {
							$o.body.removeClass( 'modal-blur' );
							$o.body
								.find( 'input, select, button' )
								.removeClass( 'input-blur' );
							$o.actionsWrapper.css( 'background-color', '#fff' );
							$o.layoutWrapper.css( {
								'pointer-events': 'unset',
							} );
							$( '.search-paywall-warning-modal' ).remove();
							complete( false );
						} );
					} );
				} );

				/**
				 * Revert back to original state once the focus is no more on search box.
				 */
				$o.searchContent.on( 'focusout', function() {
					$o.body.css( {
						overflow: 'auto',
						height: 'auto',
					} );
					$o.postPreviewWrapper.removeClass( 'blury' );
				} );

				/**
				 * Handle preview content search input.
				 */
				$o.searchContent.on(
					'input change',
					debounce( function() {
						$o.searchContentWrapper.find( 'label' ).hide();
						const searchPostTerm = $( this )
							.val()
							.trim();
						const postTitle = $( $o.postTitle )
							.text()
							.trim();
						if (
							searchPostTerm.length &&
							searchPostTerm !== postTitle
						) {
							searchPreviewContent( searchPostTerm );
						}
					}, 500 )
				);

				/**
				 * Add combobox with search for categories.
				 */
				$o.searchPaywallContent.select2( {
					ajax: {
						url: revenueGeneratorGlobalOptions.ajaxUrl,
						dataType: 'json',
						delay: 500,
						type: 'POST',
						data( params ) {
							return {
								term: params.term,
								action: 'rg_search_term',
								security:
									revenueGeneratorGlobalOptions.rg_paywall_nonce,
							};
						},
						processResults( data ) {
							const options = [];
							if ( data ) {
								$.each( data.categories, function( index ) {
									const term = data.categories[ index ];
									options.push( {
										id: term.term_id,
										text: term.name,
									} );
								} );
							}
							return {
								results: options,
							};
						},
						cache: true,
					},
					placeholder: __( 'search', 'revenue-generator' ),
					language: {
						inputTooShort() {
							return __(
								'Please enter 1 or more characters.',
								'revenue-generator'
							);
						},
						noResults() {
							return __(
								'No results found.',
								'revenue-generator'
							);
						},
					},
					minimumInputLength: 1,
				} );

				/**
				 * Handle change of current category to clear our meta data.
				 */
				$o.searchPaywallContent.on( 'change', function() {
					const categoryId = $( this ).val();
					const currentCategoryId = $o.postPreviewWrapper.attr(
						'data-access-id'
					);

					// Remove current meta.
					if ( currentCategoryId ) {
						removeCurrentCategoryMeta( currentCategoryId );
					}

					if ( categoryId ) {
						$o.postPreviewWrapper.attr(
							'data-access-id',
							categoryId
						);
						$o.savePaywall.removeAttr( 'disabled' );
						$o.activatePaywall.removeAttr( 'disabled' );
					}
				} );

				/**
				 * Hide the existing option manager if open by any chance.
				 */
				$o.previewWrapper.on( 'click', function( e ) {
					const currentTarget = $( e.target );
					const isEditButton = currentTarget.parent(
						'.rg-purchase-overlay-option-edit'
					).length;

					/**
					 * Hide other existing option manager in the view if parent is not the manager element
					 * and no modal is show currently.
					 */
					if (
						! currentTarget.parents(
							'.rg-purchase-overlay-option-manager'
						).length &&
						! $( $o.purchaseOptionInfoModal ).length &&
						! isEditButton
					) {
						$o.body
							.find( '.rg-purchase-overlay-option-manager' )
							.hide();
					}

					if (
						! currentTarget.parents(
							'.rg-purchase-overlay-option-manager'
						).length
					) {
						if ( $( '.pricing-info-modal' ).length ) {
							$o.body
								.find( '#pricing-info-modal' )
								.trigger( 'click' );
						}

						if ( $( '.revenue-info-modal' ).length ) {
							$o.body
								.find( '#revenue-info-modal' )
								.trigger( 'click' );
						}
					}
				} );

				/**
				 * Add action items on purchase item hover.
				 */
				$o.body.on( 'mouseenter', $o.purchaseOptionItem, function() {
					// Hide the paywall border.
					$o.purchaseOverlay
						.children( '.rg-purchase-overlay-highlight' )
						.hide();
					$( $o.purchaseOverlayRemove ).hide();

					const actionOptions = $( this ).find(
						'.rg-purchase-overlay-purchase-options-item-actions'
					);
					const actionsExist = actionOptions.length;
					const optionHighlight = $( this ).children(
						'.rg-purchase-overlay-purchase-options-item-highlight'
					);

					// Show action options if it already exist, else add it.
					if ( actionsExist ) {
						actionOptions.show();
						$( optionHighlight ).show();
					} else {
						// Get the template for purchase overlay action.
						const actionTemplate = wp.template(
							'revgen-purchase-overlay-actions'
						);

						const overlayMarkup = actionTemplate();

						// Highlight the current option being edited.
						$( optionHighlight ).show();

						// Add purchase option actions to the highlighted item.
						$( this ).prepend( overlayMarkup );
					}
				} );

				/**
				 * Remove action items when purchase item is not being edited.
				 */
				$o.body.on( 'mouseleave', $o.purchaseOptionItem, function() {
					const optionHighlight = $( this ).children(
						'.rg-purchase-overlay-purchase-options-item-highlight'
					);
					optionHighlight.hide();

					if (
						! $o.body.find(
							'.rg-purchase-overlay-option-manager:visible'
						).length
					) {
						$( this )
							.find(
								'.rg-purchase-overlay-purchase-options-item-actions'
							)
							.hide();
					}
				} );

				/**
				 * Handle purchase option edit operations.
				 */
				$o.body.on( 'click', $o.editOption, function() {
					const optionItem = $( this ).parents(
						'.rg-purchase-overlay-purchase-options-item'
					);
					let actionManager = optionItem.find(
						'.rg-purchase-overlay-option-manager'
					);

					const optionHighlight = $( this ).children(
						'.rg-purchase-overlay-purchase-options-item-highlight'
					);

					// Get all purchase options.
					const allPurchaseOptions = $( $o.purchaseOptionItems );
					let doesIndividualOptionExist = false;

					// Check if an individual option exist.
					allPurchaseOptions
						.children( $o.purchaseOptionItem )
						.each( function() {
							if (
								'individual' ===
								$( this ).attr( 'data-purchase-type' )
							) {
								doesIndividualOptionExist = true;
							}
						} );

					if ( ! actionManager.length ) {
						const entityType = optionItem.attr(
							'data-purchase-type'
						);

						// Send the data to our new template function, get the HTML markup back.
						const data = {
							entityType,
						};

						// Get the template for purchase overlay action.
						const actionTemplate = wp.template(
							'revgen-purchase-overlay-item-manager'
						);

						const actionMarkup = actionTemplate( data );

						// Add purchase option manager to the selected item.
						optionItem.prepend( actionMarkup );

						actionManager = optionItem.find(
							'.rg-purchase-overlay-option-manager'
						);
						const pricingManager = actionManager.find(
							'.rg-purchase-overlay-option-manager-entity'
						);

						$( '.rg-purchase-overlay-option-manager div' ).css( {
							'border-bottom-color': '#e3e4e6',
						} );
						$( '.rg-purchase-overlay-option-manager select' ).css( {
							'border-color': '#e3e4e6',
						} );

						// Duration selection.
						const periodSelection = actionManager.find(
							$o.durationWrapper
						);

						if ( 'individual' !== entityType ) {
							// hide pricing type selection if not individual.
							const dynamicPricing = actionManager.find(
								$o.individualPricingWrapper
							);
							dynamicPricing.hide();

							// show period selection if not individual.
							periodSelection
								.find( $o.periodSelection )
								.val(
									optionItem.attr( 'data-expiry-duration' )
								);
							periodSelection
								.find( $o.periodCountSelection )
								.val( optionItem.attr( 'data-expiry-period' ) );
							periodSelection.show();

							if ( doesIndividualOptionExist ) {
								const individualOption = pricingManager
									.find( 'option' )
									.filter( '[value=individual]' );
								individualOption.attr( 'disabled', true );
							}
						} else {
							periodSelection.hide();
							// Set pricing model for selected option.
							const pricingType = optionItem.attr(
								'data-pricing-type'
							);
							const pricingWrapper = actionManager.find(
								$o.individualPricingWrapper
							);
							if ( 'dynamic' === pricingType ) {
								pricingWrapper
									.find( $o.individualPricingSelection )
									.prop( 'checked', true );
								pricingWrapper
									.find( '.static-pricing' )
									.addClass( 'unchecked' );
							} else {
								pricingWrapper
									.find( $o.individualPricingSelection )
									.prop( 'checked', false );
								pricingWrapper
									.find( '.dynamic-pricing' )
									.addClass( 'unchecked' );
							}
						}

						const revenueWrapper = actionManager.find(
							$o.purchaseRevenueWrapper
						);
						if ( 'subscription' === entityType ) {
							// Add extra height to get proper styling.
							actionManager
								.find( 'div' )
								.css( { height: ' 55px' } );
							revenueWrapper.hide();
						} else {
							// Set revenue model for selected option.
							const priceItem = optionItem.find(
								$o.purchaseOptionItemPrice
							);
							const revenueModel = priceItem.attr(
								'data-pay-model'
							);
							if ( 'ppu' === revenueModel ) {
								revenueWrapper
									.find( $o.purchaseRevenueSelection )
									.prop( 'checked', true );
								revenueWrapper
									.find( '.pay-now' )
									.addClass( 'unchecked' );
							} else {
								revenueWrapper
									.find( $o.purchaseRevenueSelection )
									.prop( 'checked', false );
								revenueWrapper
									.find( '.pay-later' )
									.addClass( 'unchecked' );
							}
							revenueWrapper.show();
						}
					} else {
						if ( doesIndividualOptionExist ) {
							const pricingManager = actionManager.find(
								'.rg-purchase-overlay-option-manager-entity'
							);
							const individualOption = pricingManager
								.find( 'option' )
								.filter( '[value=individual]' );
							individualOption.attr( 'disabled', true );
						}

						actionManager.toggle();
						optionHighlight.show();
					}

					/**
					 * This is done to keep current state of triggered action manger
					 * not be changed by the hiding of all others.
					 */
					const actionManagerCurrentState = actionManager.css(
						'display'
					);
					const actionOptions = optionItem.find(
						'.rg-purchase-overlay-purchase-options-item-actions'
					);

					// Hide other open option managers.
					$o.body
						.find( '.rg-purchase-overlay-option-manager' )
						.hide();
					$o.body
						.find(
							'.rg-purchase-overlay-purchase-options-item-actions'
						)
						.hide();
					actionOptions.show();

					// Reset current action manager back to original state.
					actionManager.css( { display: actionManagerCurrentState } );
				} );

				/**
				 * Remove purchase option.
				 */
				$o.body.on( 'click', $o.optionRemove, function() {
					const purchaseItem = $( this ).parents(
						'.rg-purchase-overlay-purchase-options-item'
					);
					const type = purchaseItem.attr( 'data-purchase-type' );
					let entityId;
					if ( 'individual' === type ) {
						entityId = purchaseItem.attr( 'data-paywall-id' );
					} else if ( 'timepass' === type ) {
						entityId = purchaseItem.attr( 'data-tlp-id' );
					} else if ( 'subscription' === type ) {
						entityId = purchaseItem.attr( 'data-sub-id' );
					}

					if ( 'individual' !== type ) {
						showPurchaseOptionUpdateWarning( type ).then(
							( confirmation ) => {
								if ( true === confirmation ) {
									purchaseItem.remove();
									reorderPurchaseItems();
									removePurchaseOption( type, entityId );
									$o.isPublish = true;
									$o.savePaywall.trigger( 'click' );
								}
							}
						);
					} else {
						purchaseItem.remove();
						reorderPurchaseItems();
						removePurchaseOption( type, entityId );
						$o.isPublish = true;
						$o.savePaywall.trigger( 'click' );
					}
				} );

				/**
				 * Handle change of purchase option type.
				 */
				$o.body.on( 'change', $o.purchaseOptionType, function() {
					const purchaseManager = $( this ).parents(
						'.rg-purchase-overlay-option-manager'
					);
					const pricingManager = purchaseManager.find(
						'.rg-purchase-overlay-option-manager-entity'
					);
					const staticPricingOptions = purchaseManager.find(
						$o.individualPricingWrapper
					);
					const revenueWrapper = purchaseManager.find(
						$o.purchaseRevenueWrapper
					);
					const durationWrapper = purchaseManager.find(
						$o.durationWrapper
					);

					// Hide dynamic pricing selection options if not Individual type.
					if ( 'individual' === pricingManager.val() ) {
						staticPricingOptions.show();
						durationWrapper.hide();
					} else {
						staticPricingOptions.hide();
						durationWrapper.show();
					}

					// Hide revenue mode selection options if not Subscription type.
					if ( 'subscription' === pricingManager.val() ) {
						revenueWrapper.hide();
					} else {
						revenueWrapper.show();
					}
				} );

				/**
				 * Handle revenue model change.
				 */
				$o.body.on(
					'change',
					$o.individualPricingSelection,
					function() {
						const optionItem = $( this ).parents(
							$o.purchaseOptionItem
						);
						const purchaseManager = $( this ).parents(
							'.rg-purchase-overlay-option-manager'
						);
						const pricingSelection = purchaseManager.find(
							$o.individualPricingSelection
						);
						const pricingWrapper = purchaseManager.find(
							$o.individualPricingWrapper
						);

						if ( pricingSelection.prop( 'checked' ) ) {
							const allPurchaseOptions = $(
								$o.purchaseOptionItems
							);
							const dynamicPrice = allPurchaseOptions.attr(
								'data-dynamic-price'
							);
							const dynamicRevenue = allPurchaseOptions.attr(
								'data-dynamic-revenue'
							);
							const priceItem = optionItem.find(
								$o.purchaseOptionItemPrice
							);
							priceItem.attr( 'data-pay-model', dynamicRevenue );
							const dynamicStar = $( $o.purchaseItemPriceIcon );
							const validatedPrice = validatePrice(
								dynamicPrice
							);
							dynamicStar.css( { display: 'none' } );
							priceItem.text( validatedPrice );
							optionItem.attr( 'data-pricing-type', 'dynamic' );
							optionItem.find( $o.purchaseItemPriceIcon ).show();
							pricingSelection.val( 1 );
							pricingWrapper
								.find( '.static-pricing' )
								.addClass( 'unchecked' );
							pricingWrapper
								.find( '.dynamic-pricing' )
								.removeClass( 'unchecked' );
						} else {
							optionItem.attr( 'data-pricing-type', 'static' );
							optionItem.find( $o.purchaseItemPriceIcon ).hide();
							pricingSelection.val( 0 );
							pricingWrapper
								.find( '.static-pricing' )
								.removeClass( 'unchecked' );
							pricingWrapper
								.find( '.dynamic-pricing' )
								.addClass( 'unchecked' );
						}
					}
				);

				/**
				 * Handle pricing type change for individual type.
				 */
				$o.body.on( 'change', $o.purchaseRevenueSelection, function() {
					const optionItem = $( this ).parents(
						$o.purchaseOptionItem
					);
					const purchaseManager = $( this ).parents(
						'.rg-purchase-overlay-option-manager'
					);
					const revenueSelection = purchaseManager.find(
						$o.purchaseRevenueSelection
					);
					const priceItem = optionItem.find(
						$o.purchaseOptionItemPrice
					);
					const currentRevenue = priceItem.attr( 'data-pay-model' );
					const currentValue = revenueSelection.val();
					const optionType = optionItem.attr( 'data-purchase-type' );
					const revenueWrapper = purchaseManager.find(
						$o.purchaseRevenueWrapper
					);

					// If a saved option is being edited, get confirmation.
					if ( 'individual' !== optionType ) {
						showPurchaseOptionUpdateWarning( optionType ).then(
							( confirmation ) => {
								if ( true === confirmation ) {
									if ( revenueSelection.prop( 'checked' ) ) {
										priceItem.attr(
											'data-pay-model',
											'ppu'
										);
										revenueSelection.val( 1 );
										validatePricingRevenue(
											optionItem,
											true
										);
										revenueWrapper
											.find( '.pay-later' )
											.removeClass( 'unchecked' );
										revenueWrapper
											.find( '.pay-now' )
											.addClass( 'unchecked' );
									} else {
										priceItem.attr(
											'data-pay-model',
											'sis'
										);
										revenueSelection.val( 0 );
										validatePricingRevenue(
											optionItem,
											false
										);
										revenueWrapper
											.find( '.pay-later' )
											.addClass( 'unchecked' );
										revenueWrapper
											.find( '.pay-now' )
											.removeClass( 'unchecked' );
									}
								} else {
									priceItem.attr(
										'data-pay-model',
										currentRevenue
									);
									revenueSelection.val( currentValue );
									revenueSelection.attr(
										'checked',
										1 === parseInt( currentValue )
									);
									validatePricingRevenue(
										optionItem,
										1 === parseInt( currentValue )
									);
									if ( 1 === parseInt( currentValue ) ) {
										revenueWrapper
											.find( '.pay-later' )
											.removeClass( 'unchecked' );
										revenueWrapper
											.find( '.pay-now' )
											.addClass( 'unchecked' );
									} else {
										revenueWrapper
											.find( '.pay-later' )
											.addClass( 'unchecked' );
										revenueWrapper
											.find( '.pay-now' )
											.removeClass( 'unchecked' );
									}
								}
							}
						);
						return;
					}

					if ( revenueSelection.prop( 'checked' ) ) {
						priceItem.attr( 'data-pay-model', 'ppu' );
						revenueSelection.val( 1 );
						const newmsg = __(
							"You'll only be charged once you've reached $5.",
							'revenue-generator'
						);
						$( optionItem )
							.find( $o.purchaseOptionItemDesc )
							.text( newmsg );
						validatePricingRevenue( optionItem, true );
						revenueWrapper
							.find( '.pay-later' )
							.removeClass( 'unchecked' );
						revenueWrapper
							.find( '.pay-now' )
							.addClass( 'unchecked' );
					} else {
						priceItem.attr( 'data-pay-model', 'sis' );
						revenueSelection.val( 0 );
						const previewPostTitle = $o.searchContent.val();
						const newmsg = sprintf(
							__(
								'Get lifetime access to %1$s now!',
								'revenue-generator'
							),
							previewPostTitle
						);
						$( optionItem )
							.find( $o.purchaseOptionItemDesc )
							.text( newmsg );

						validatePricingRevenue( optionItem, false );
						revenueWrapper
							.find( '.pay-later' )
							.addClass( 'unchecked' );
						revenueWrapper
							.find( '.pay-now' )
							.removeClass( 'unchecked' );
					}
				} );

				/**
				 * Period selection change handler.
				 */
				$o.body.on( 'change', $o.periodSelection, function() {
					const purchaseManager = $( this ).parents(
						'.rg-purchase-overlay-option-manager'
					);
					const periodSelection = purchaseManager.find(
						$o.periodSelection
					);
					const periodCountSelection = purchaseManager.find(
						$o.periodCountSelection
					);
					changeDurationOptions(
						periodSelection.val(),
						periodCountSelection
					);
					const optionItem = $( this ).parents(
						$o.purchaseOptionItem
					);
					optionItem.attr(
						'data-expiry-duration',
						periodSelection.val()
					);
				} );

				/**
				 * Period count selection change handler.
				 */
				$o.body.on( 'change', $o.periodCountSelection, function() {
					const purchaseManager = $( this ).parents(
						'.rg-purchase-overlay-option-manager'
					);
					const periodCountSelection = purchaseManager.find(
						$o.periodCountSelection
					);
					const optionItem = $( this ).parents(
						$o.purchaseOptionItem
					);
					optionItem.attr(
						'data-expiry-period',
						periodCountSelection.val()
					);
				} );

				/**
				 * Handle price input and change.
				 */
				$o.body
					.on( 'focus', $o.purchaseOptionItemPrice, function() {
						const currentPrice = $( this )
							.text()
							.trim();
						$( this ).attr( 'data-current-value', currentPrice );
					} )
					.on(
						'input change',
						$o.purchaseOptionItemPrice,
						debounce( function() {
							const optionItem = $( this ).parents(
								$o.purchaseOptionItem
							);
							const priceItem = optionItem.find(
								$o.purchaseOptionItemPrice
							);
							const currentPrice = $( this ).attr(
								'data-current-value'
							);
							const newPrice = priceItem.text().trim();
							const priceSymbol = optionItem.find(
								$o.purchaseOptionPriceSymbol
							);
							const optionType = optionItem.attr(
								'data-purchase-type'
							);
							const currentRevenue = priceItem.attr(
								'data-pay-model'
							);

							const symbol = priceSymbol.text().trim();
							if (
								! symbol.length &&
								! revenueGeneratorGlobalOptions.globalOptions
									.merchant_currency.length
							) {
								showCurrencySelectionModal();
							}

							// If a saved item is being updated, display warning.
							if ( 'individual' !== optionType ) {
								showPurchaseOptionUpdateWarning(
									optionType
								).then( ( confirmation ) => {
									// If merchant selects to continue, remove current option from DB.
									if ( true === confirmation ) {
										const validatedPrice = validatePrice(
											newPrice,
											'subscription' === optionType
										);
										$( this )
											.empty()
											.text( validatedPrice );
										validateRevenue(
											validatedPrice,
											optionItem
										);
									} else {
										const validatedPrice = validatePrice(
											currentPrice,
											'subscription' === optionType
										);
										$( this )
											.empty()
											.text( validatedPrice );
										validateRevenue(
											validatedPrice,
											optionItem
										);
									}
								} );
							} else {
								const validatedPrice = validatePrice(
									newPrice,
									'subscription' === optionType
								);
								const dynamicStar = $(
									$o.purchaseItemPriceIcon
								);
								dynamicStar.css( { display: 'none' } );
								$( this ).text( validatedPrice );
								validateRevenue( validatedPrice, optionItem );
							}

							// Display message when revenue chagnes based on price.
							if (
								currentRevenue !==
								priceItem.attr( 'data-pay-model' )
							) {
								if (
									'ppu' === priceItem.attr( 'data-pay-model' )
								) {
									$o.snackBar.showSnackbar(
										__(
											'Pay Now is only available for prices set to $1.99 or higher.',
											'revenue-generator'
										),
										2500
									);
								} else {
									$o.snackBar.showSnackbar(
										__(
											'Pay Later is only available for prices set less than $5.',
											'revenue-generator'
										),
										2500
									);
								}
							}

							reorderPurchaseItems();
						}, 1000 )
					);

				/**
				 * Handle currency selection.
				 */
				$o.body.on( 'change', $o.currencyRadio, function() {
					if ( $( this ).val().length ) {
						const currencyButton = $( $o.currencyOverlay ).find(
							$o.currencyButton
						);
						currencyButton.removeProp( 'disabled' );
					}
				} );

				/**
				 * Handle paywall applicable dropdown.
				 */
				$o.body.on( 'change', $o.paywallAppliesTo, function() {
					if (
						'exclude_category' === $( this ).val() ||
						'category' === $( this ).val()
					) {
						$o.searchPaywallWrapper.show();
						if (
							$o.searchPaywallContent.length &&
							null === $o.searchPaywallContent.val()
						) {
							$o.savePaywall.attr( 'disabled', true );
							$o.activatePaywall.attr( 'disabled', true );
						}
						$o.postPreviewWrapper.attr(
							'data-access-id',
							$o.searchPaywallContent.val()
						);
					} else {
						$o.savePaywall.removeAttr( 'disabled' );
						$o.activatePaywall.removeAttr( 'disabled' );
						$o.searchPaywallWrapper.hide();
						$o.postPreviewWrapper.attr(
							'data-access-id',
							$o.postPreviewWrapper.attr( 'data-preview-id' )
						);
					}
				} );

				/**
				 * Handle currency submission.
				 */
				$o.body.on( 'click', $o.currencyButton, function() {
					// form data for currency.
					const formData = {
						action: 'rg_update_currency_selection',
						config_key: 'merchant_currency',
						config_value: $(
							'input:radio[name=currency]:checked'
						).val(),
						security:
							revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					$.ajax( {
						url: revenueGeneratorGlobalOptions.ajaxUrl,
						method: 'POST',
						data: formData,
						dataType: 'json',
					} ).done( function( r ) {
						$( $o.currencyModalClose ).trigger( 'click' );
						$o.snackBar.showSnackbar( r.msg, 1500 );

						const purchaseOptions = $( $o.purchaseOptionItems );
						purchaseOptions
							.children( $o.purchaseOptionItem )
							.each( function() {
								const priceSymbol = $( this ).find(
									$o.purchaseOptionPriceSymbol
								);
								const symbol =
									'USD' === formData.config_value ? '$' : '€';
								priceSymbol.empty().text( symbol );
							} );
					} );
				} );

				/**
				 * Close currency modal.
				 */
				$o.body.on( 'click', $o.currencyModalClose, function() {
					$o.previewWrapper.find( $o.currencyOverlay ).remove();
					$o.body.removeClass( 'modal-blur' );
					$o.purchaseOverlay.css( {
						filter: 'unset',
						'pointer-events': 'unset',
					} );
				} );

				/**
				 * Hide the purchase option add button.
				 */
				$o.body.on( 'mouseenter', $o.optionArea, function() {
					// Hide the paywall border.
					$o.purchaseOverlay
						.children( '.rg-purchase-overlay-highlight' )
						.hide();
					$( $o.purchaseOverlayRemove ).hide();

					// Only show if total count limit doesn't exceed.
					const currentOptionCount = $( $o.purchaseOptionItems ).find(
						$o.purchaseOptionItem
					).length;
					if ( currentOptionCount < 5 ) {
						$( $o.addOptionArea ).css( { display: 'flex' } );
					}
				} );

				/**
				 * Hide the add option button when not in focus.
				 */
				$o.body.on( 'mouseleave', $o.optionArea, function() {
					$( $o.addOptionArea ).hide();
				} );

				/**
				 * Add new option handler.
				 */
				$o.body.on( 'click', $o.addOptionArea, function() {
					// Only add if total count limit doesn't exceed.
					const currentOptionCount = $( $o.purchaseOptionItems ).find(
						$o.purchaseOptionItem
					).length;
					if ( currentOptionCount < 5 ) {
						// Get the template for default option.
						const optionItem = wp.template(
							'revgen-default-purchase-option-item'
						);
						$( $o.purchaseOptionItems ).append( optionItem );
					}
					reorderPurchaseItems();
				} );

				/**
				 * Handle tooltip button events for info modals.
				 */
				$o.body.on( 'click', $o.purchaseOptionInfoButton, function() {
					const infoButton = $( this );
					const modalType = infoButton.attr( 'data-info-for' );
					const existingModal = $o.previewWrapper.find(
						$o.purchaseOptionInfoModal
					);

					// Remove any existing modal.
					if ( existingModal.length ) {
						$o.body.removeClass( 'modal-blur' );
						existingModal.remove();

						// Reset the background for all greyed out elements.
						$( $o.optionManager ).css( {
							'background-color': '#fff',
						} );
						$( '.rg-purchase-overlay-option-manager div' ).css( {
							'border-bottom-color': '#a9a9a9',
						} );
						$( $o.optionManager )
							.find( 'select' )
							.css( {
								'background-color': '#fff',
								'border-bottom-color': '#a9a9a9',
							} );
						$( $o.purchaseOptionItem ).css( {
							'background-color': '#fff',
						} );
						$o.actionsWrapper.css( {
							'background-color': '#fff',
						} );
						$o.actionButtons.css( { opacity: '1' } );
						$o.searchContentWrapper.css( {
							'background-color': '#fff',
						} );
						$( $o.purchaseRevenueWrapper ).css( {
							'background-color': '#fff',
							'border-bottom-color': 'unset !important',
						} );
						$( $o.individualPricingWrapper ).css( {
							'background-color': '#fff',
							'border-color': 'unset !important',
						} );
					} else {
						const template = wp.template(
							`revgen-info-${ modalType }`
						);
						$o.previewWrapper.append( template );

						// Change background color and highlight the clicked parent.
						$o.body.addClass( 'modal-blur' );

						// Grey out the option manager and overlay elements in it.
						$( $o.optionManager ).css( {
							'background-color': '#a9a9a9',
						} );
						$( '.rg-purchase-overlay-option-manager div' ).css( {
							'border-bottom-color': '#000',
						} );
						$( $o.optionManager )
							.find( 'select' )
							.css( {
								'background-color': '#a9a9a9',
								'border-color': '#a9a9a9',
							} );
						$( $o.purchaseOptionItem ).css( {
							'background-color': '#a9a9a9',
						} );

						// Grey out the paywall actions and change position.
						$o.actionsWrapper.css( {
							'background-color': '#a9a9a9',
						} );
						$o.actionButtons.css( { opacity: '0.5' } );
						$o.searchContentWrapper.css( {
							'background-color': '#a9a9a9',
						} );

						// Highlight selected info modal parent based on type.
						if ( 'revenue' === modalType ) {
							$( $o.purchaseRevenueWrapper ).css( {
								'background-color': '#fff',
								cursor: 'pointer',
								'pointer-events': 'all',
							} );
							$( $o.individualPricingWrapper ).css( {
								'background-color': '#a9a9a9',
							} );
						} else {
							$( $o.individualPricingWrapper ).css( {
								'background-color': '#fff',
								cursor: 'pointer',
								'pointer-events': 'all',
							} );
							$( $o.purchaseRevenueWrapper ).css( {
								'background-color': '#a9a9a9',
							} );
						}
					}
				} );

				/**
				 * Add paywall border if hovering over the saved paywall area.
				 */
				$o.purchaseOverlay.on( 'mouseenter', function() {
					const paywall = $( $o.purchaseOptionItems );
					const paywallId = paywall.attr( 'data-paywall-id' );
					if ( paywallId.length ) {
						$o.purchaseOverlay
							.children( '.rg-purchase-overlay-highlight' )
							.show();
						$( $o.purchaseOverlayRemove ).show();
					}
				} );

				/**
				 * Hide the border and paywall remove button when not in focus.
				 */
				$o.purchaseOverlay.on( 'mouseleave', function() {
					$o.purchaseOverlay
						.children( '.rg-purchase-overlay-highlight' )
						.hide();
					$( $o.purchaseOverlayRemove ).hide();
				} );

				/**
				 * Remove the paywall after merchant confirmation.
				 */
				$o.body.on( 'click', $o.purchaseOverlayRemove, function() {
					showPaywallRemovalConfirmation().then( ( confirmation ) => {
						if ( true === confirmation ) {
							removePaywall();
						}
					} );
				} );

				/**
				 * Add new paywall from paywall publish action.
				 */
				$o.body.on( 'click', $o.addPaywall, function() {
					const postPreviewId = $( $o.addPaywall ).attr(
						'data-preview-id'
					);
					if ( postPreviewId ) {
						showPreviewContent( postPreviewId );
					}
				} );

				/**
				 * Handle the dashboard redirection on paywall deletion.
				 */
				$o.body.on( 'click', $o.gotoDashboard, function() {
					const dashboardURL = $( this ).attr( 'data-dashboard-url' );

					if ( dashboardURL ) {
						window.location.href = dashboardURL;
					}
				} );

				/**
				 * Handle the change of entity type i.e Individual, TimePass, Subscription.
				 */
				$o.body.on( 'change', $o.entitySelection, function() {
					const optionItem = $( this ).parents(
						$o.purchaseOptionItem
					);
					const currentType = optionItem.attr( 'data-purchase-type' );
					const selectedEntityType = $( this ).val();
					const optionManager = optionItem.find(
						'.rg-purchase-overlay-option-manager'
					);
					let entityId;

					if ( currentType !== selectedEntityType ) {
						// Set the id based on current type.
						if ( 'subscription' === currentType ) {
							entityId = optionItem.attr( 'data-sub-id' );
						} else if ( 'timepass' === currentType ) {
							entityId = optionItem.attr( 'data-tlp-id' );
						} else if ( 'individual' === currentType ) {
							entityId = optionItem.attr( 'data-paywall-id-id' );
						}

						if ( 'individual' !== currentType ) {
							showPurchaseOptionUpdateWarning( currentType ).then(
								( confirmation ) => {
									// If merchant selects to continue, remove current option from DB.
									if ( true === confirmation ) {
										// Remove the data from DB.
										removePurchaseOption(
											currentType,
											entityId,
											false
										);
										$o.isPublish = true;
										$o.savePaywall.trigger( 'click' );
									} else {
										optionItem.attr(
											'data-purchase-type',
											currentType
										);
										$( this ).val( currentType );
										return false;
									}
								}
							);
						}

						// Remove all current attributes.
						optionItem.removeAttr( 'data-purchase-type' );
						optionItem.removeAttr( 'data-expiry-duration' );
						optionItem.removeAttr( 'data-expiry-period' );
						optionItem.removeAttr( 'data-pricing-type' );
						optionItem.removeAttr( 'data-paywall-id' );
						optionItem.removeAttr( 'data-tlp-id' );
						optionItem.removeAttr( 'data-sub-id' );
						optionItem.removeAttr( 'data-uid' );
						optionItem.removeAttr( 'data-order' );

						// Add empty options for a fresh option.
						optionItem.attr( 'data-order', '' );
						optionItem.attr( 'data-uid', '' );
						optionItem.attr(
							'data-purchase-type',
							selectedEntityType
						);
						$( this ).val( selectedEntityType );

						// Add type specific options.
						if ( 'individual' !== selectedEntityType ) {
							// Set default 1 Month period for changed option.

							const optionPrice = optionItem.find(
								$o.purchaseOptionItemPrice
							);
							optionPrice.removeAttr( 'data-pay-model' );

							if ( 'timepass' === selectedEntityType ) {
								const timePassDefaultValues =
									revenueGeneratorGlobalOptions.defaultConfig
										.timepass;

								// Default value for new time pass.
								optionItem.attr( 'data-tlp-id', '' );
								optionItem.attr(
									'data-expiry-duration',
									timePassDefaultValues.duration
								);
								optionItem.attr(
									'data-expiry-period',
									timePassDefaultValues.period
								);
								optionPrice.attr(
									'data-pay-model',
									timePassDefaultValues.revenue
								);
								optionPrice.text( timePassDefaultValues.price );

								// Set option item info.
								optionItem
									.find( $o.purchaseOptionItemTitle )
									.text( timePassDefaultValues.title );
								optionItem
									.find( $o.purchaseOptionItemDesc )
									.text( timePassDefaultValues.description );

								optionManager
									.find( 'div' )
									.css( { height: ' 45px' } );
							} else if (
								'subscription' === selectedEntityType
							) {
								const subscriptionDefaultValues =
									revenueGeneratorGlobalOptions.defaultConfig
										.subscription;

								// Default value for new subscription.
								optionItem.attr( 'data-sub-id', '' );
								optionItem.attr(
									'data-expiry-duration',
									subscriptionDefaultValues.duration
								);
								optionItem.attr(
									'data-expiry-period',
									subscriptionDefaultValues.period
								);
								optionPrice.attr(
									'data-pay-model',
									subscriptionDefaultValues.revenue
								);
								optionPrice.text(
									subscriptionDefaultValues.price
								);

								// Set option item info.
								optionItem
									.find( $o.purchaseOptionItemTitle )
									.text( subscriptionDefaultValues.title );
								optionItem
									.find( $o.purchaseOptionItemDesc )
									.text(
										subscriptionDefaultValues.description
									);

								optionManager
									.find( 'div' )
									.css( { height: ' 55px' } );
							}
						} else {
							// Set static pricing by default if individual.
							optionItem.attr( 'data-pricing-type', 'static' );
							optionItem.attr( 'data-paywall-id', '' );
							optionManager
								.find( 'div' )
								.css( { height: ' 45px' } );
						}
					}
				} );

				/**
				 * Save Paywall and its purchase options.
				 */
				$o.savePaywall.on( 'click', function() {
					showLoader();
					reorderPurchaseItems();

					// Get all purchase options.
					const purchaseOptions = $( $o.purchaseOptionItems );

					/**
					 * Loop through Time Passes and Subscriptions and add unique ids
					 * so that created id can be added accordingly.
					 */
					purchaseOptions
						.children( $o.purchaseOptionItem )
						.each( function() {
							const uid = $( this ).attr( 'data-uid' );
							if ( ! uid ) {
								// To add appropriate ids after saving.
								$( this ).attr( 'data-uid', createUniqueID() );
							}
						} );

					// Store individual pricing.
					const individualOption = purchaseOptions.find(
						"[data-purchase-type='individual']"
					);
					let individualObj;

					/**
					 * Create individual purchase option data.
					 */
					if ( individualOption.length ) {
						individualObj = {
							title: individualOption
								.find( $o.purchaseOptionItemTitle )
								.text()
								.trim(),
							desc: individualOption
								.find( $o.purchaseOptionItemDesc )
								.text()
								.trim(),
							price: individualOption
								.find( $o.purchaseOptionItemPrice )
								.text()
								.trim(),
							revenue: individualOption
								.find( $o.purchaseOptionItemPrice )
								.attr( 'data-pay-model' ),
							type: individualOption.attr( 'data-pricing-type' ),
							order: individualOption.attr( 'data-order' ),
						};
					}

					// Store time pass pricing.
					const timePassOptions = purchaseOptions.find(
						"[data-purchase-type='timepass']"
					);
					const timePasses = [];

					/**
					 * Create time passes data array.
					 */
					timePassOptions.each( function() {
						const timePass = $( this );
						const timePassObj = {
							title: timePass
								.find( $o.purchaseOptionItemTitle )
								.text()
								.trim(),
							desc: timePass
								.find( $o.purchaseOptionItemDesc )
								.text()
								.trim(),
							price: timePass
								.find( $o.purchaseOptionItemPrice )
								.text()
								.trim(),
							revenue: $(
								timePass.find( $o.purchaseOptionItemPrice )
							).attr( 'data-pay-model' ),
							duration: $( timePass ).attr(
								'data-expiry-duration'
							),
							period: $( timePass ).attr( 'data-expiry-period' ),
							tlp_id: $( timePass ).attr( 'data-tlp-id' ),
							uid: $( timePass ).attr( 'data-uid' ),
							order: $( timePass ).attr( 'data-order' ),
						};
						timePasses.push( timePassObj );
					} );

					// Store subscription pricing.
					const subscriptionOptions = purchaseOptions.find(
						"[data-purchase-type='subscription']"
					);
					const subscriptions = [];

					/**
					 * Create subscriptions data array.
					 */
					subscriptionOptions.each( function() {
						const subscription = $( this );
						const subscriptionObj = {
							title: subscription
								.find( $o.purchaseOptionItemTitle )
								.text()
								.trim(),
							desc: subscription
								.find( $o.purchaseOptionItemDesc )
								.text()
								.trim(),
							price: subscription
								.find( $o.purchaseOptionItemPrice )
								.text()
								.trim(),
							revenue: $(
								subscription.find( $o.purchaseOptionItemPrice )
							).attr( 'data-pay-model' ),
							duration: $( subscription ).attr(
								'data-expiry-duration'
							),
							period: $( subscription ).attr(
								'data-expiry-period'
							),
							sub_id: $( subscription ).attr( 'data-sub-id' ),
							uid: $( subscription ).attr( 'data-uid' ),
							order: $( subscription ).attr( 'data-order' ),
						};
						subscriptions.push( subscriptionObj );
					} );

					/**
					 * Paywall data.
					 */
					const paywall = {
						id: purchaseOptions.attr( 'data-paywall-id' ),
						title: $o.purchaseOverlay
							.find( $o.paywallTitle )
							.text()
							.trim(),
						desc: $o.purchaseOverlay
							.find( $o.paywallDesc )
							.text()
							.trim(),
						name: $o.paywallName.text().trim(),
						applies: $( $o.paywallAppliesTo ).val(),
						preview_id: $o.postPreviewWrapper.attr(
							'data-preview-id'
						),
					};

					/**
					 * Final data of paywall.
					 */
					const data = {
						action: 'rg_update_paywall',
						post_id: $o.postPreviewWrapper.attr( 'data-access-id' ),
						paywall,
						individual: individualObj,
						time_passes: timePasses,
						subscriptions,
						security:
							revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					// Update paywall data.
					updatePaywall(
						revenueGeneratorGlobalOptions.ajaxUrl,
						data
					);
				} );

				/**
				 * Reload the Connect account page.
				 */
				$o.body.on( 'click', $o.reVerifyAccount, function( e ) {
					e.preventDefault();
					showAccountActivationModal();
				} );

				/**
				 * Handle paywall activation.
				 */
				$o.activatePaywall.on( 'click', function() {
					if (
						0 ===
						parseInt(
							revenueGeneratorGlobalOptions.globalOptions
								.is_merchant_verified
						)
					) {
						showAccountActivationModal();
					} else {
						/**
						 * Save paywall data to get new paywall id and wait for some time to publish the paywall.
						 */
						$o.isPublish = true;
						$o.savePaywall.trigger( 'click' );
						$o.savePaywall.addClass( 'hide' );
						showLoader();
						setTimeout( function() {
							publishPaywall();
							hideLoader();
							$o.isPublish = false;
						}, 1500 );
					}
				} );

				/**
				 * Handle Connect Account button handler.
				 */
				$o.body.on( 'click', $o.connectAccount, function() {
					showAccountVerificationFields();
				} );

				/**
				 * Handle initial account signup button click event and show account fields.
				 */
				$o.body.on( 'click', $o.accountSignup, function() {
					if (
						revenueGeneratorGlobalOptions.globalOptions
							.merchant_region.length
					) {
						const currentRegion =
							revenueGeneratorGlobalOptions.globalOptions
								.merchant_region;
						const signUpURL =
							revenueGeneratorGlobalOptions.signupURL;
						if ( 'US' === currentRegion ) {
							window.open( signUpURL.US, '_blank' );
						} else {
							window.open( signUpURL.EU, '_blank' );
						}
						showAccountVerificationFields();
					}
				} );

				/**
				 * Handle signup link event for activate signup button.
				 */
				$o.body.on( 'click', $o.activateSignup, function() {
					if (
						revenueGeneratorGlobalOptions.globalOptions
							.merchant_region.length
					) {
						const currentRegion =
							revenueGeneratorGlobalOptions.globalOptions
								.merchant_region;
						const signUpURL =
							revenueGeneratorGlobalOptions.signupURL;
						if ( 'US' === currentRegion ) {
							window.open( signUpURL.US, '_blank' );
						} else {
							window.open( signUpURL.EU, '_blank' );
						}
					}
				} );

				/**
				 * Handle signup link event for warning signup button.
				 */
				$o.body.on( 'click', $o.warningSignup, function() {
					if (
						revenueGeneratorGlobalOptions.globalOptions
							.merchant_region.length
					) {
						const currentRegion =
							revenueGeneratorGlobalOptions.globalOptions
								.merchant_region;
						const signUpURL =
							revenueGeneratorGlobalOptions.signupURL;
						if ( 'US' === currentRegion ) {
							window.open( signUpURL.US, '_blank' );
						} else {
							window.open( signUpURL.EU, '_blank' );
						}
					}
				} );

				/**
				 * Close account activation modal.
				 */
				$o.body.on( 'click', $o.activationModalClose, function() {
					//Blur out the body and disable events.
					$o.previewWrapper.find( $o.activationModal ).remove();
					$o.body.removeClass( 'modal-blur' );
					$o.contributionBox.removeClass( 'modal-blur' );
					$o.body.find( 'input' ).removeClass( 'input-blur' );
					$o.purchaseOverlay.css( {
						filter: 'unset',
						'pointer-events': 'unset',
					} );
					$o.actionsWrapper.css( {
						'background-color': '#fff',
					} );
					$o.actionButtons.css( { opacity: '1' } );
					$o.searchContentWrapper.css( {
						'background-color': '#fff',
					} );
				} );

				/**
				 * Handle merchant id input.
				 */
				$o.body.on( 'input change', $o.accountActionId, function() {
					const activationModal = $o.previewWrapper.find(
						$o.activationModal
					);
					const merchantId = activationModal
						.find( $o.accountActionId )
						.val()
						.trim();
					const merchantKey = activationModal
						.find( $o.accountActionKey )
						.val()
						.trim();
					if ( merchantId.length && merchantKey.length ) {
						$( $o.activateAccount ).removeAttr( 'disabled' );
					}
				} );

				/**
				 * Handle merchant key input.
				 */
				$o.body.on( 'input change', $o.accountActionKey, function() {
					const activationModal = $o.previewWrapper.find(
						$o.activationModal
					);
					const merchantId = activationModal
						.find( $o.accountActionId )
						.val()
						.trim();
					const merchantKey = activationModal
						.find( $o.accountActionKey )
						.val()
						.trim();
					if ( merchantId.length && merchantKey.length ) {
						$( $o.activateAccount ).removeAttr( 'disabled' );
					}
				} );

				/**
				 * Verify the account details.
				 */
				$o.body.on( 'click', $o.activateAccount, function() {
					const activationModal = $o.previewWrapper.find(
						$o.activationModal
					);
					const merchantId = activationModal
						.find( $o.accountActionId )
						.val()
						.trim();
					const merchantKey = activationModal
						.find( $o.accountActionKey )
						.val()
						.trim();
					verifyAccountCredentials( merchantId, merchantKey );
				} );

				/**
				 * Open paywall target post.
				 */
				$o.body.on( 'click', $o.viewPost, function() {
					const targetPostId = $( this ).attr( 'data-target-id' );
					const selectedCategoryId = $o.searchPaywallContent.val();
					if ( targetPostId ) {
						viewPost( targetPostId, selectedCategoryId );
					}
				} );

				/**
				 * View Dashboard on click.
				 */
				$o.body.on( 'click', $o.viewDashboard, function() {
					const dashboardURL = $( this ).attr( 'data-dashboard-url' );

					if ( dashboardURL ) {
						location.href = dashboardURL;
					}
				} );
			};

			/**
			 * Get permalink for preview post id and take merchant to the post.
			 *
			 * @param {number} previewPostId Post Preview ID.
			 * @param {number} selectedCategoryId Selected Category ID.
			 */
			const viewPost = function( previewPostId, selectedCategoryId = 0 ) {
				// Create form data.
				const formData = {
					action: 'rg_post_permalink',
					preview_post_id: previewPostId,
					category_id: selectedCategoryId,
					security: revenueGeneratorGlobalOptions.rg_paywall_nonce,
				};

				// Delete the option.
				$.ajax( {
					url: revenueGeneratorGlobalOptions.ajaxUrl,
					method: 'POST',
					data: formData,
					dataType: 'json',
				} ).done( function( r ) {
					if ( r.redirect_to ) {
						window.open( r.redirect_to, '_blank' );
					}
				} );
			};

			/**
			 * Publish the paywall.
			 */
			const publishPaywall = function() {
				if (
					1 ===
					parseInt(
						revenueGeneratorGlobalOptions.globalOptions
							.is_merchant_verified
					)
				) {
					$o.previewWrapper.find( $o.activationModal ).remove();

					// Get the template for account verification.
					const template = wp.template(
						'revgen-account-activation-modal'
					);
					$o.previewWrapper.append( template );

					// Blur out the background.
					$o.body.addClass( 'modal-blur' );
					$o.purchaseOverlay.css( {
						filter: 'blur(5px)',
						'pointer-events': 'none',
					} );
					$o.actionsWrapper.css( {
						'background-color': '#a9a9a9',
					} );
					$o.actionButtons.css( { opacity: '0.5' } );
					$o.searchContentWrapper.css( {
						'background-color': '#a9a9a9',
					} );
				}

				if ( ! $o.requestSent ) {
					$o.requestSent = true;
					showLoader();

					// Get paywall id.
					const paywall = $( $o.purchaseOptionItems );
					const paywallId = paywall.attr( 'data-paywall-id' );

					// Create form data for activating paywall.
					const formData = {
						action: 'rg_activate_paywall',
						paywall_id: paywallId,
						security:
							revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					// Delete the option.
					$.ajax( {
						url: revenueGeneratorGlobalOptions.ajaxUrl,
						method: 'POST',
						data: formData,
						dataType: 'json',
					} ).done( function( r ) {
						$o.requestSent = false;
						hideLoader();

						// Get required info for success message.
						const postPreviewId = $o.postPreviewWrapper.attr(
							'data-preview-id'
						);
						const paywallName = $o.paywallName.text().trim();
						const appliedTo = $( $o.paywallAppliesTo ).val();
						let publishMessage = '';

						// Compose message based on paywall attributes.
						if (
							'category' === appliedTo ||
							'exclude_category' === appliedTo
						) {
							const categoryName = $o.searchPaywallContent
								.text()
								.trim();
							if ( 'category' === appliedTo ) {
								publishMessage = sprintf(
									/* translators: %s category name */
									__(
										'Has been published to <b>all posts</b> in category <b>%s</b>.',
										'revenue-generator'
									),
									categoryName
								);
							} else {
								publishMessage = sprintf(
									/* translators: %s category name */
									__(
										'Has been published to <b>all posts, except posts under</b> in category <b>%s</b>.',
										'revenue-generator'
									),
									categoryName
								);
							}
						} else if ( 'supported' === appliedTo ) {
							publishMessage = sprintf(
								/* translators: %s post name */
								__(
									'Has been published on <b>%s</b>.',
									'revenue-generator'
								),
								$( $o.postTitle )
									.text()
									.trim()
							);
						} else {
							publishMessage = __(
								'Has been published on <b>all posts</b>.',
								'revenue-generator'
							);
						}

						// Remove unnecessary markup form modal and show success message.
						const activationModal = $o.previewWrapper.find(
							$o.activationModal
						);
						const activationSuccess = activationModal.find(
							$o.activationModalSuccess
						);
						activationSuccess
							.find( $o.activationModalSuccessTitle )
							.text( paywallName );
						activationSuccess
							.find( $o.activationModalSuccessMessage )
							.append( $( '<p/>' ).html( publishMessage ) );
						activationSuccess
							.find( $o.viewPost )
							.attr( 'data-target-id', postPreviewId );
						activationModal
							.find( $o.activationModalError )
							.remove();
						activationModal
							.find( $o.accountActionsWrapper )
							.remove();
						activationModal
							.find( $o.accountActionsFields )
							.remove();

						// If merchant has more than one paywalls, add a warning.
						if ( true === r.has_paywalls ) {
							activationSuccess
								.find( $o.activationModalWarningMessage )
								.show();
						} else {
							activationSuccess
								.find( $o.activationModalWarningMessage )
								.hide();
						}

						activationSuccess.css( { display: 'flex' } );
					} );
				}
			};

			/**
			 * Verify merchant credentials and allow paywall publishing.
			 *
			 * @param {string}  merchantId  Merchant ID.
			 * @param {string}  merchantKey Merchant Key.
			 */
			const verifyAccountCredentials = function(
				merchantId,
				merchantKey
			) {
				if ( ! $o.requestSent ) {
					$o.requestSent = true;

					// Create form data.
					const formData = {
						action: 'rg_verify_account_credentials',
						merchant_id: merchantId,
						merchant_key: merchantKey,
						security:
							revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					// Remove merchant credential fields and show the loader.
					const activationModal = $o.previewWrapper.find(
						$o.activationModal
					);
					activationModal
						.find( $o.accountActionTitle )
						.text( __( 'Just a second...', 'revenue-generator' ) );
					activationModal.find( $o.accountActionId ).remove();
					activationModal.find( $o.accountCredentialsInfo ).remove();
					activationModal.find( $o.accountActionKey ).remove();
					activationModal.find( $o.accountActions ).remove();
					activationModal.find( $o.accountVerificationLoader ).show();

					// Validate merchant details.
					$.ajax( {
						url: revenueGeneratorGlobalOptions.ajaxUrl,
						method: 'POST',
						data: formData,
						dataType: 'json',
					} ).done( function( r ) {
						$o.requestSent = false;
						activationModal.find( $o.accountActionsFields ).hide();
						// Get all purchase options and check paywall id.
						const allPurchaseOptions = $( $o.purchaseOptionItems );

						// Check for Screen to perform actions paywall.
						if (
							allPurchaseOptions &&
							allPurchaseOptions.length > 0
						) {
							if ( true === r.success ) {
								const paywallId = allPurchaseOptions.attr(
									'data-paywall-id'
								);

								/**
								 * If paywall id exists, then publish directly, else wait to save paywall data to
								 * get new paywall id and wait for some time to publish the paywall.
								 */
								if ( paywallId.length ) {
									publishPaywall();
								} else {
									// Save the paywall as well, so that we don't miss any new changes if merchant as done any.
									$o.isPublish = true;
									$o.savePaywall.trigger( 'click' );
									showLoader();
									setTimeout( function() {
										// Explicitly change loclized data.
										revenueGeneratorGlobalOptions.globalOptions.is_merchant_verified =
											'1';
										publishPaywall();
										hideLoader();
									}, 2000 );
								}
							} else {
								// Save the paywall as well, so that we don't miss any new changes if merchant as done any.
								$o.isPublish = true;
								$o.savePaywall.trigger( 'click' );
								activationModal
									.find( $o.activationModalError )
									.css( { display: 'flex' } );
							}

							// Check for Screen to perform actions Contribution.
						} else if (
							$o.contributionBox &&
							$o.contributionBox.length > 0
						) {
							if ( true === r.success ) {
								$o.isPublish = true;
								showLoader();
								$( $o.activationModalClose ).trigger( 'click' );

								setTimeout( function() {
									// Explicitly change loclized data.
									revenueGeneratorGlobalOptions.globalOptions.is_merchant_verified =
										'1';
									hideLoader();
									// Display message about Credentails.
									$o.snackBar.showSnackbar( r.msg, 1500 );
								}, 2000 );
							} else {
								// If there is error show Modal Error.
								$o.isPublish = true;
								activationModal
									.find( $o.activationModalError )
									.css( { display: 'flex' } );
							}
						} else {
							// If there is error show Modal Error.
							$o.isPublish = true;
							activationModal
								.find( $o.activationModalError )
								.css( { display: 'flex' } );
						}
					} );
				}
			};

			/**
			 * Initialized the tooltip on given element.
			 *
			 * @param {string} elementIdentifier Selector matching elements on the document
			 */
			const initializeTooltip = function( elementIdentifier ) {
				tippy( elementIdentifier, { arrow: tippy.roundArrow } );
			};

			/**
			 * Display account verification fields.
			 */
			const showAccountVerificationFields = function() {
				const activationModal = $o.previewWrapper.find(
					$o.activationModal
				);
				activationModal.find( $o.accountActionsWrapper ).hide();
				activationModal
					.find( $o.accountActionsFields )
					.css( { display: 'flex' } );
			};

			/**
			 * Display account activation modal for new merchant.
			 */
			const showAccountActivationModal = function() {
				$o.previewWrapper.find( $o.activationModal ).remove();

				// Get the template for account verification.
				const template = wp.template(
					'revgen-account-activation-modal'
				);
				$o.previewWrapper.append( template );

				// Blur out the background.
				$o.body.addClass( 'modal-blur' );
				$o.purchaseOverlay.css( {
					filter: 'blur(5px)',
					'pointer-events': 'none',
				} );
				$o.actionsWrapper.css( {
					'background-color': '#a9a9a9',
				} );
				$o.actionButtons.css( { opacity: '0.5' } );
				$o.searchContentWrapper.css( {
					'background-color': '#a9a9a9',
				} );
			};

			/**
			 * Initialize the tour object.
			 *
			 * @return {Shepherd.Tour} Shepherd tour object.
			 */
			const initializeTour = function() {
				return new Shepherd.Tour( {
					defaultStepOptions: {
						classes: 'rev-gen-tutorial-card',
						scrollTo: { behavior: 'smooth', block: 'center' },
					},
				} );
			};

			/**
			 * Add required info steps for the merchant.
			 *
			 * @param {Shepherd.Tour} tour Tour object.
			 */
			const addTourSteps = function( tour ) {
				const skipTourButton = {
					text: __( 'Skip Tour', 'revenue-generator' ),
					action: tour.complete,
					classes: 'shepherd-content-skip-tour',
				};

				const nextButton = {
					text: __( 'Next >', 'revenue-generator' ),
					action: tour.next,
					classes: 'shepherd-content-next-tour-element',
				};

				// Add tutorial step for main search.
				tour.addStep( {
					id: 'rg-main-search-input',
					text: __(
						"Search for the page or post you'd like to preview with Revenue Generator here.",
						'revenue-generator'
					),
					attachTo: {
						element: '.rev-gen-preview-main--search',
						on: 'bottom',
					},
					arrow: true,
					classes: 'shepherd-content-add-space-top',
					buttons: [ skipTourButton, nextButton ],
				} );

				// Add tutorial step for editing header title
				tour.addStep( {
					id: 'rg-purchase-overlay-header',
					text: __( 'Click to Edit', 'revenue-generator' ),
					attachTo: {
						element: '.rg-purchase-overlay-title',
						on: 'bottom',
					},
					arrow: true,
					classes: 'rev-gen-tutorial-title',
					buttons: [ nextButton ],
				} );

				// Add tutorial step for option item.
				tour.addStep( {
					id: 'rg-purchase-option-item',
					text: __(
						'Hover over each element to see the available options.',
						'revenue-generator'
					),
					attachTo: {
						element:
							'.rg-purchase-overlay-purchase-options .option-item-second',
						on: 'top',
					},
					arrow: true,
					classes: 'shepherd-content-add-space-bottom',
					buttons: [ nextButton ],
				} );

				// Add tutorial step for option item edit button.
				tour.addStep( {
					id: 'rg-purchase-option-item-edit',
					text: __(
						'Click on the ‘more options’ icon to set the product type (single item purchase, time pass, or subscription).',
						'revenue-generator'
					),
					attachTo: {
						element:
							'.rg-purchase-overlay-purchase-options .option-item-second .rg-purchase-overlay-option-edit',
						on: 'left',
					},
					arrow: true,
					buttons: [ nextButton ],
				} );

				// Add tutorial step for option item title area.
				tour.addStep( {
					id: 'rg-purchase-option-item-title',
					text: __(
						'Click on any text element to edit it.',
						'revenue-generator'
					),
					attachTo: {
						element:
							'.rg-purchase-overlay-purchase-options .option-item-second .rg-purchase-overlay-purchase-options-item-info .rg-purchase-overlay-purchase-options-item-info-title',
						on: 'top',
					},
					arrow: true,
					classes: 'shepherd-content-add-space-bottom',
					buttons: [ nextButton ],
				} );

				// Add tutorial step for option item price area.
				tour.addStep( {
					id: 'rg-purchase-option-item-price',
					text: sprintf(
						/* translators: %1$s line break tag, %2$s laterpay.net info link opening,  %3$s laterpay.net info link closing */
						__(
							'These are our recommended prices. %1$s%1$sClick to edit; prices lower than 5.00 will default to %2$spay later%3$s.',
							'revenue-generator'
						),
						'<br/>',
						'<a class="info-link" href="https://www.laterpay.net/academy/getting-started-with-laterpay-the-difference-between-pay-now-pay-later" target="_blank" rel="noopener noreferrer">',
						'</a>'
					),
					attachTo: {
						element:
							'.rg-purchase-overlay-purchase-options .option-item-second .rg-purchase-overlay-purchase-options-item-price',
						on: 'top',
					},
					arrow: true,
					classes: 'shepherd-content-add-space-bottom',
					buttons: [ nextButton ],
				} );

				// Add tutorial step for option item add.
				tour.addStep( {
					id: 'rg-purchase-option-item-add',
					text: __(
						'Hover below the paywall to get the option to add another purchase button.',
						'revenue-generator'
					),
					attachTo: {
						element: '.rg-purchase-overlay-option-area-add-option',
						on: 'top',
					},
					arrow: true,
					classes: 'shepherd-content-add-space-bottom',
					buttons: [ nextButton ],
				} );

				// Add tutorial step for paywall name.
				tour.addStep( {
					id: 'rg-purchase-option-paywall-name',
					text: __(
						'Click here to change the name of your paywall.',
						'revenue-generator'
					),
					attachTo: {
						element: '.rev-gen-preview-main-paywall-name',
						on: 'bottom',
					},
					arrow: true,
					classes: 'shepherd-content-add-space-bottom',
					buttons: [ nextButton ],
				} );

				// Add tutorial step for paywall actions search.
				tour.addStep( {
					id: 'rg-purchase-option-paywall-actions-search',
					text: __(
						'Select the content that  should display this paywall.',
						'revenue-generator'
					),
					attachTo: {
						element:
							'.rev-gen-preview-main--paywall-actions .rev-gen-preview-main--paywall-actions-search',
						on: 'bottom',
					},
					arrow: true,
					classes: 'shepherd-content-add-space-bottom',
					buttons: [ nextButton ],
				} );

				// Add tutorial step for paywall actions publish.
				tour.addStep( {
					id: 'rg-purchase-option-paywall-publish',
					text: __(
						'When you’re ready to activate your paywall, connect your LaterPay account.',
						'revenue-generator'
					),
					attachTo: {
						element:
							'.rev-gen-preview-main--paywall-actions-update .rev-gen-preview-main--paywall-actions-update-publish',
						on: 'bottom',
					},
					arrow: true,
					classes: 'shepherd-content-add-space-bottom',
					buttons: [
						{
							text: __( 'Complete', 'revenue-generator' ),
							action: tour.next,
							classes: 'shepherd-content-complete-tour-element',
						},
					],
				} );
			};

			/**
			 * Handle the tour of the paywall elements.
			 *
			 * @param {Shepherd.Tour} tour Tour object.
			 */
			const startWelcomeTour = function( tour ) {
				// Show exit tour button.
				$( $o.exitTour ).css( {
					visibility: 'visible',
					'pointer-events': 'all',
					cursor: 'pointer',
				} );

				// Blur out the wrapper and disable events, to highlight the tour elements.
				$o.body.addClass( 'modal-blur' );
				$o.layoutWrapper.css( {
					'pointer-events': 'none',
				} );
				$( $o.purchaseOptionItem ).css( {
					'background-color': 'darkgray',
				} );
				$( $o.purchaseOptionItemInfo ).css( {
					'border-right': '1px solid #928d8d',
				} );

				const directionalKeys = [
					'ArrowUp',
					'ArrowDown',
					'ArrowRight',
					'ArrowLeft',
				];
				const disableArrowKeys = function( e ) {
					if ( directionalKeys.includes( e.key ) ) {
						e.preventDefault();
						return false;
					}
				};

				// Disable arrow events.
				$( document ).keydown( disableArrowKeys );

				// Remove the blurry class and allow click events.
				Shepherd.on( 'complete', function() {
					// Revert to original state.
					$o.body.removeClass( 'modal-blur' );

					$o.layoutWrapper.css( {
						'pointer-events': 'unset',
					} );

					// Removed background from search bar.
					$o.searchContentWrapper.css( {
						'background-color': '#fff',
					} );

					// Revert to original theme.
					$( $o.purchaseOptionItem ).css( {
						'background-color': '#fff',
					} );
					$( $o.purchaseOptionItemInfo ).css( {
						'border-right': '1px solid #e3e4e6',
					} );

					// Hide exit tour button.
					$( $o.exitTour ).remove();

					// Enable arrow events.
					$( document ).unbind( 'keydown', disableArrowKeys );

					// Complete the tour, and update plugin option.
					completeTheTour();
				} );

				// Start the tour.
				tour.start();
			};

			/**
			 * Complete the tour.
			 */
			const completeTheTour = function() {
				// Create form data.
				const formData = {
					action: 'rg_complete_tour',
					config_key: 'is_paywall_tutorial_completed',
					config_value: 1,
					security: revenueGeneratorGlobalOptions.rg_paywall_nonce,
				};

				// Delete the option.
				$.ajax( {
					url: revenueGeneratorGlobalOptions.ajaxUrl,
					method: 'POST',
					data: formData,
					dataType: 'json',
				} ).done( function( r ) {
					if ( r.success ) {
						window.location.reload();
					}
				} );
			};

			/**
			 * Clear category meta on change.
			 *
			 * @param {number} categoryId Category Id.
			 */
			const removeCurrentCategoryMeta = function( categoryId ) {
				// prevent duplicate requests.
				if ( ! $o.requestSent ) {
					$o.requestSent = true;

					// Create form data.
					const formData = {
						action: 'rg_clear_category_meta',
						rg_category_id: categoryId,
						security:
							revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					$.ajax( {
						url: revenueGeneratorGlobalOptions.ajaxUrl,
						method: 'POST',
						data: formData,
						dataType: 'json',
					} ).done( function() {
						$o.requestSent = false;
					} );
				}
			};

			/**
			 * Update the post preview based on selected preview content.
			 *
			 * @param {number} postId Post ID.
			 */
			const showPreviewContent = function( postId ) {
				// prevent duplicate requests.
				if ( ! $o.requestSent ) {
					$o.requestSent = true;

					// Create form data.
					const formData = {
						action: 'rg_select_preview_content',
						post_preview_id: postId,
						security:
							revenueGeneratorGlobalOptions.rg_paywall_nonce,
					};

					$.ajax( {
						url: revenueGeneratorGlobalOptions.ajaxUrl,
						method: 'POST',
						data: formData,
						dataType: 'json',
					} ).done( function( r ) {
						$o.requestSent = false;
						if ( r.redirect_to ) {
							window.location.href = r.redirect_to;
						}
					} );
				}
			};

			/**
			 * Search post content for preview based on merchants search term.
			 *
			 * @param {string} searchTerm The part of title being searched for preview.
			 */
			const searchPreviewContent = function( searchTerm ) {
				if ( searchTerm.length ) {
					// prevent duplicate requests.
					if ( ! $o.requestSent ) {
						$o.requestSent = true;

						// Create form data.
						const formData = {
							action: 'rg_search_preview_content',
							search_term: searchTerm,
							security:
								revenueGeneratorGlobalOptions.rg_paywall_nonce,
						};

						$.ajax( {
							url: revenueGeneratorGlobalOptions.ajaxUrl,
							method: 'POST',
							data: formData,
							dataType: 'json',
						} ).done( function( r ) {
							$o.requestSent = false;
							if ( true === r.success ) {
								$o.searchResultWrapper.empty();
								const postPreviews = r.preview_posts;
								postPreviews.forEach( function( item ) {
									const itemType =
										item.type === 'post'
											? 'dashicons-admin-post'
											: 'dashicons-admin-page';
									const itemTitle = item.title;
									const searchRegExp = new RegExp(
										searchTerm,
										'i'
									);
									const highlightedTitle = itemTitle.replace(
										searchRegExp,
										`<b>${ searchTerm }</b>`
									);
									const searchItem = $( '<span/>', {
										'data-id': item.id,
										class:
											'rev-gen-preview-main--search-results-item dashicons-before',
									} ).append( highlightedTitle );
									searchItem.addClass( itemType );
									$o.searchResultWrapper.append( searchItem );
									$o.searchResultWrapper.css( {
										display: 'flex',
									} );
								} );
							} else {
								$o.snackBar.showSnackbar( r.msg, 1500 );
							}
						} );
					}
				}
			};

			/**
			 * Show the loader.
			 */
			const showLoader = function() {
				$o.laterpayLoader.css( { display: 'flex' } );
			};

			/**
			 * Hide the loader.
			 */
			const hideLoader = function() {
				$o.laterpayLoader.hide();
			};

			/**
			 * Remove paywall.
			 */
			const removePaywall = function() {
				const paywall = $( $o.purchaseOptionItems );
				const paywallId = paywall.attr( 'data-paywall-id' );

				// Create form data.
				const formData = {
					action: 'rg_remove_paywall',
					id: paywallId,
					security: revenueGeneratorGlobalOptions.rg_paywall_nonce,
				};

				// Delete the option.
				$.ajax( {
					url: revenueGeneratorGlobalOptions.ajaxUrl,
					method: 'POST',
					data: formData,
					dataType: 'json',
				} ).done( function( r ) {
					// Show message and remove the overlay.
					$o.snackBar.showSnackbar( r.msg, 1500 );
					$o.purchaseOverlay.remove();

					// Update paywall actions bar with new button.
					$o.actionsWrapper.css( {
						width: '75%',
						'background-color': 'rgba(239, 239, 239, 0.3)',
						'backdrop-filter': 'blur(10px)',
					} );

					// Get the template for confirmation popup and add it.
					const template = wp.template( 'revgen-add-paywall' );
					$o.actionsWrapper.empty().append( template );

					// Add preview url for new paywall.
					if ( r.preview_id ) {
						$( $o.addPaywall ).attr(
							'data-preview-id',
							r.preview_id
						);
					}
				} );
			};

			/**
			 * Show the confirmation box for removing paywall.
			 */
			const showPaywallRemovalConfirmation = async function() {
				const confirm = await createPaywallRemovalConfirmation();
				$o.previewWrapper.find( $o.paywallRemovalModal ).remove();
				$o.body.removeClass( 'modal-blur' );
				$o.purchaseOverlay.css( {
					filter: 'unset',
					'pointer-events': 'unset',
				} );
				return confirm;
			};

			/**
			 * Create a confirmation modal with warning before removing paywall.
			 */
			const createPaywallRemovalConfirmation = function() {
				return new Promise( ( complete ) => {
					$o.previewWrapper.find( $o.paywallRemovalModal ).remove();

					// Get the template for confirmation popup and add it.
					const template = wp.template( 'revgen-remove-paywall' );
					$o.previewWrapper.append( template );

					$o.body.addClass( 'modal-blur' );
					$o.purchaseOverlay.css( {
						filter: 'blur(5px)',
						'pointer-events': 'none',
					} );

					$( $o.paywallRemove ).off( 'click' );
					$( $o.paywallCancelRemove ).off( 'click' );

					$( $o.paywallRemove ).on( 'click', () => {
						$( $o.paywallRemovalModal ).hide();
						complete( true );
					} );
					$( $o.paywallCancelRemove ).on( 'click', () => {
						$( $o.paywallRemovalModal ).hide();
						complete( false );
					} );
				} );
			};

			/**
			 * Show the confirmation box for saved entity update.
			 *
			 * @param {string} optionType Option type.
			 */
			const showPurchaseOptionUpdateWarning = async function(
				optionType
			) {
				const confirm = await createEntityUpdateConfirmation(
					optionType
				);
				$o.previewWrapper
					.find( $o.purchaseOptionWarningWrapper )
					.remove();
				$o.body.removeClass( 'modal-blur' );
				$o.purchaseOverlay.css( {
					filter: 'unset',
					'pointer-events': 'unset',
				} );

				// Grey out the paywall actions and change position.
				$o.actionsWrapper.css( {
					'background-color': '#fff',
				} );
				$o.actionButtons.css( { opacity: '1' } );
				$o.searchContentWrapper.css( { 'background-color': '#fff' } );
				return confirm;
			};

			/**
			 * Create a confirmation modal with warning before saved entity is updated.
			 *
			 * @param {string} optionType Option type.
			 */
			const createEntityUpdateConfirmation = function( optionType ) {
				return new Promise( ( complete ) => {
					$o.previewWrapper
						.find( $o.purchaseOptionWarningWrapper )
						.remove();

					// Get the template for confirmation popup and add it.
					const template = wp.template(
						'revgen-purchase-option-update'
					);
					$o.previewWrapper.append( template );
					const updateWarning = $(
						$o.purchaseOptionWarningWrapper
					).find( $o.purchaseOptionWarningMessage );
					if ( updateWarning.length ) {
						if ( 'timepass' === optionType ) {
							updateWarning
								.empty()
								.text(
									__(
										'The changes you have made will impact this time pass offer on all paywalls across your entire site.',
										'revenue-generator'
									)
								);
						} else if ( 'subscription' === optionType ) {
							updateWarning
								.empty()
								.text(
									__(
										'The changes you have made will impact this subscription offer on all paywalls across your entire site.',
										'revenue-generator'
									)
								);
						}
					}

					$o.body.addClass( 'modal-blur' );
					$o.purchaseOverlay.css( {
						filter: 'blur(5px)',
						'pointer-events': 'none',
					} );

					// Grey out the paywall actions and change position.
					$o.actionsWrapper.css( {
						'background-color': '#a9a9a9',
					} );
					$o.actionButtons.css( { opacity: '0.5' } );

					$o.searchContentWrapper.css( {
						'background-color': '#a9a9a9',
					} );

					$( $o.purchaseOperationContinue ).off( 'click' );
					$( $o.purchaseOperationCancel ).off( 'click' );

					$( $o.purchaseOperationContinue ).on( 'click', () => {
						$( $o.purchaseOptionWarningWrapper ).hide();
						complete( true );
					} );
					$( $o.purchaseOperationCancel ).on( 'click', () => {
						$( $o.purchaseOptionWarningWrapper ).hide();
						complete( false );
					} );
				} );
			};

			/**
			 * Remove purchase option from DB.
			 *
			 * @param {string}  type        Type of purchase option being removed.
			 * @param {number}  id          Id of the purchase option.
			 * @param {boolean} showMessage Should the message be shown for removal..
			 */
			const removePurchaseOption = function(
				type,
				id,
				showMessage = true
			) {
				const paywall = $( $o.purchaseOptionItems );
				const paywallId = paywall.attr( 'data-paywall-id' );

				// Create form data.
				const formData = {
					action: 'rg_remove_purchase_option',
					type,
					id,
					paywall_id: paywallId,
					security: revenueGeneratorGlobalOptions.rg_paywall_nonce,
				};

				// Delete the option.
				$.ajax( {
					url: revenueGeneratorGlobalOptions.ajaxUrl,
					method: 'POST',
					data: formData,
					dataType: 'json',
				} ).done( function( r ) {
					if ( true === showMessage ) {
						$o.snackBar.showSnackbar( r.msg, 1500 );
					}
				} );
			};

			/**
			 * Update purchase options order.
			 */
			const reorderPurchaseItems = function() {
				// Get all purchase options.
				const purchaseOptions = $( $o.purchaseOptionItems );
				// Sort options by order, single purchase, time passes, subscriptions.
				if ( purchaseOptions.length ) {
					// Add temporary lpc pricing attribute, for sorting.
					purchaseOptions
						.children( $o.purchaseOptionItem )
						.each( function() {
							const priceItem = $( this ).find(
								$o.purchaseOptionItemPrice
							);
							const currentPrice = priceItem.text().trim();
							const connectorPricing = (
								currentPrice * 100
							).toFixed( 0 );
							$( this ).attr(
								'data-lpc-pricing',
								connectorPricing
							);
						} );

					// Get all options, if available.
					const individualOption = purchaseOptions.find(
						"[data-purchase-type='individual']"
					);
					const timePassOptions = purchaseOptions.find(
						"[data-purchase-type='timepass']"
					);
					const subscriptionOptions = purchaseOptions.find(
						"[data-purchase-type='subscription']"
					);

					// Move individual option to the top of the list.
					if ( individualOption.length ) {
						purchaseOptions.prepend( individualOption );
					}

					// Add time passes after individual option else add to top.
					if ( timePassOptions.length ) {
						// Sort the time passes internally.
						timePassOptions.sort( function( a, b ) {
							return (
								+$( a ).attr( 'data-lpc-pricing' ) -
								+$( b ).attr( 'data-lpc-pricing' )
							);
						} );

						// Remove options and add sorted options.
						purchaseOptions
							.find( "[data-purchase-type='timepass']" )
							.remove();

						if ( individualOption.length ) {
							purchaseOptions
								.find( individualOption )
								.after( timePassOptions );
						} else {
							purchaseOptions.prepend( timePassOptions );
						}
					}

					// Add subscriptions to the end.
					if ( subscriptionOptions.length ) {
						// Sort the subscriptions internally.
						subscriptionOptions.sort( function( a, b ) {
							return (
								+$( a ).data( 'lpc-pricing' ) -
								+$( b ).data( 'lpc-pricing' )
							);
						} );

						// Remove options and add sorted options.
						purchaseOptions
							.find( "[data-purchase-type='subscription']" )
							.remove();

						// Append sorted subscriptions to the purchase options.
						purchaseOptions.append( subscriptionOptions );
					}

					/**
					 * Loop through all purchase options and update the order.
					 */
					purchaseOptions
						.children( $o.purchaseOptionItem )
						.each( function( i ) {
							const order = i + 1;
							$( this ).attr( 'data-order', order );
						} );
				}
			};

			/**
			 * Validate the purchase item revenue model.
			 *
			 * @param {string} price         Price of the item.
			 * @param {Object} purchaseItem  Purchase option.
			 */
			const validateRevenue = function( price, purchaseItem ) {
				const purchaseManager = $( purchaseItem ).find(
					'.rg-purchase-overlay-option-manager'
				);
				const revenueWrapper = purchaseManager.find(
					$o.purchaseRevenueWrapper
				);
				const pricingTypeWrapper = purchaseManager.find(
					$o.individualPricingWrapper
				);
				const entityType = $( purchaseItem ).attr(
					'data-purchase-type'
				);

				// Set pricing type to static for manual change of price.
				$( purchaseItem ).attr( 'data-pricing-type', 'static' );
				pricingTypeWrapper
					.find( $o.individualPricingSelection )
					.prop( 'checked', false );

				// Set pricing type based on value, and update manager UI accordingly.
				if (
					price >=
					revenueGeneratorGlobalOptions.currency.sis_only_limit
				) {
					$( purchaseItem )
						.find( $o.purchaseOptionItemPrice )
						.attr( 'data-pay-model', 'sis' );
					revenueWrapper
						.find( $o.purchaseRevenueSelection )
						.prop( 'checked', false );
					if ( 'subscription' !== entityType ) {
						$( purchaseItem ).trigger( 'mouseenter' );
						$( purchaseItem )
							.find( $o.editOption )
							.trigger( 'click' );
					}
				} else if (
					( price <= revenueGeneratorGlobalOptions.currency.ppu_min ||
						price >
							revenueGeneratorGlobalOptions.currency.ppu_min ) &&
					price < revenueGeneratorGlobalOptions.currency.sis_min
				) {
					$( purchaseItem )
						.find( $o.purchaseOptionItemPrice )
						.attr( 'data-pay-model', 'ppu' );
					revenueWrapper
						.find( $o.purchaseRevenueSelection )
						.prop( 'checked', true );
					if ( 'subscription' !== entityType ) {
						$( purchaseItem ).trigger( 'mouseenter' );
						$( purchaseItem )
							.find( $o.editOption )
							.trigger( 'click' );
					}
				}
			};

			/**
			 * Validate the purchase item revenue model on revenue change.
			 *
			 * @param {Object} purchaseItem  Purchase option.
			 * @param {boolean} revenueType  Purchase option revenue type.
			 */
			const validatePricingRevenue = function(
				purchaseItem,
				revenueType
			) {
				const priceItem = $( purchaseItem ).find(
					$o.purchaseOptionItemPrice
				);
				const price = parseFloat( priceItem.text().trim() );
				const optionType = $( purchaseItem ).attr(
					'data-purchase-type'
				);
				const currencyLimits = revenueGeneratorGlobalOptions.currency;
				let validatedPrice = validatePrice( price );

				// If merchant selected pay now.
				if (
					false === revenueType &&
					price <= parseFloat( currencyLimits.ppu_only_limit )
				) {
					validatedPrice = validatePrice(
						currencyLimits.sis_min,
						'subscription' === optionType
					);
					$o.snackBar.showSnackbar(
						__(
							'Pay Now is only available for prices set to $1.99 or higher.',
							'revenue-generator'
						),
						2500
					);

					if ( 'individual' === optionType ) {
						const dynamicStar = $( $o.purchaseItemPriceIcon );
						dynamicStar.css( { display: 'none' } );
						priceItem.text( validatedPrice );
					} else {
						priceItem.empty().text( validatedPrice );
					}
				} else if (
					true === revenueType &&
					price > parseFloat( currencyLimits.ppu_max )
				) {
					validatedPrice = validatePrice(
						currencyLimits.ppu_max,
						'subscription' === optionType
					);
					$o.snackBar.showSnackbar(
						__(
							'Pay Later is only available for prices set less than $5.',
							'revenue-generator'
						),
						2500
					);

					if ( 'individual' === optionType ) {
						const dynamicStar = $( $o.purchaseItemPriceIcon );
						dynamicStar.css( { display: 'none' } );
						priceItem.text( validatedPrice );
					} else {
						priceItem.empty().text( validatedPrice );
					}
				}
			};

			/**
			 * Get validated price.
			 *
			 * @param {string}  price                   Purchase option price.
			 * @param {boolean} subscriptionValidation  Is current item subscription.
			 *
			 * @return {string} return validated price.
			 */
			const validatePrice = function( price, subscriptionValidation ) {
				if ( typeof price !== 'number' ) {
					// strip non-number characters
					price = price.replace( /[^0-9\,\.]/g, '' );

					// convert price to proper float value
					price = parseFloat( price.replace( ',', '.' ) ).toFixed(
						2
					);
				}

				// prevent non-number prices
				if ( isNaN( price ) ) {
					price = 0;
				}

				// prevent negative prices
				price = Math.abs( price );

				if ( subscriptionValidation ) {
					if (
						price < revenueGeneratorGlobalOptions.currency.sis_min
					) {
						price = revenueGeneratorGlobalOptions.currency.sis_min;
					} else if (
						price > revenueGeneratorGlobalOptions.currency.sis_max
					) {
						price = revenueGeneratorGlobalOptions.currency.sis_max;
					}
				} else {
					// correct prices outside the allowed range of 0.05 - 149.99
					if (
						price > revenueGeneratorGlobalOptions.currency.sis_max
					) {
						price = revenueGeneratorGlobalOptions.currency.sis_max;
					}

					if (
						price > 0 &&
						price < revenueGeneratorGlobalOptions.currency.ppu_min
					) {
						price = revenueGeneratorGlobalOptions.currency.ppu_min;
					}
				}

				// format price with two digits
				price = price.toFixed( 2 );

				// localize price
				if (
					revenueGeneratorGlobalOptions.locale.indexOf( 'de_DE' ) !==
					-1
				) {
					price = price.replace( '.', ',' );
				}

				return price;
			};

			/**
			 * Add currency modal.
			 */
			const showCurrencySelectionModal = function() {
				$o.previewWrapper.find( $o.currencyOverlay ).remove();
				// Get the template for currency popup and add it.
				const template = wp.template(
					'revgen-purchase-currency-overlay'
				);
				$o.previewWrapper.append( template );
				$o.body.addClass( 'modal-blur' );
				$o.purchaseOverlay.css( {
					filter: 'blur(5px)',
					'pointer-events': 'none',
				} );
			};

			/**
			 * Update the paywall.
			 *
			 * @param {string} ajaxURL  AJAX URL.
			 * @param {Object} formData Form data to be submitted.
			 */
			const updatePaywall = function( ajaxURL, formData ) {
				$.ajax( {
					url: ajaxURL,
					method: 'POST',
					data: formData,
					dataType: 'json',
				} ).done( function( r ) {
					hideLoader();
					$o.snackBar.showSnackbar( r.msg, 1500 );

					const purchaseOptions = $( $o.purchaseOptionItems );

					// Set main paywall id.
					purchaseOptions.attr( 'data-paywall-id', r.paywall_id );

					const individualOption = purchaseOptions.find(
						"[data-purchase-type='individual']"
					);
					if ( individualOption.length ) {
						individualOption.attr(
							'data-paywall-id',
							r.paywall_id
						);
					}

					const timePassOptions = purchaseOptions.find(
						"[data-purchase-type='timepass']"
					);
					if ( timePassOptions.length ) {
						// Add returned ids to appropriate purchase option.
						timePassOptions.each( function() {
							const timePassUID = $( this ).attr( 'data-uid' );
							$( this ).attr(
								'data-tlp-id',
								r.time_passes[ timePassUID ]
							);
						} );
					}

					const subscriptionOptions = purchaseOptions.find(
						"[data-purchase-type='subscription']"
					);
					if ( subscriptionOptions.length ) {
						// Add returned ids to appropriate purchase option.
						subscriptionOptions.each( function() {
							const subscriptionUID = $( this ).attr(
								'data-uid'
							);
							$( this ).attr(
								'data-sub-id',
								r.subscriptions[ subscriptionUID ]
							);
						} );
					}

					if ( r.redirect_to && false === $o.isPublish ) {
						window.location.href = r.redirect_to;
					}
				} );
			};

			/**
			 * Create a unique identifier.
			 *
			 * From https://stackoverflow.com/a/2117523/4368718 - uuidv4().
			 */
			const createUniqueID = function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
					/[xy]/g,
					function( c ) {
						const r = ( Math.random() * 16 ) | 0, // eslint-disable-line no-bitwise
							v = c === 'x' ? r : ( r & 0x3 ) | 0x8; // eslint-disable-line no-bitwise
						return v.toString( 16 );
					}
				);
			};

			/**
			 * Create options markup based on period selection.
			 *
			 * @param {string} period   Type of period, i.e Year, Month, Day, Hour.
			 * @param {Object} $wrapper Select wrapper.
			 */
			const changeDurationOptions = function( period, $wrapper ) {
				const options = [];
				let limit = 24;

				// change duration options.
				if ( period === 'y' ) {
					limit = 1;
				} else if ( period === 'm' ) {
					limit = 12;
				}

				for ( let i = 1; i <= limit; i++ ) {
					const option = $( '<option/>', {
						value: i,
					} );
					option.text( i );
					options.push( option );
				}

				$( $wrapper )
					.find( 'option' )
					.remove()
					.end()
					.append( options );
			};

			/**
			 * Adds paywall.
			 */
			const addPaywall = function() {
				if ( $o.postContent ) {
					// Blur the paid content out.
					$o.postContent.addClass( 'blur-content' );

					// Get the template for purchase overlay along with data.
					const template = wp.template( 'revgen-purchase-overlay' );

					// Send the data to our new template function, get the HTML markup back.
					$o.purchaseOverlay.append( template );
					$o.purchaseOverlay.show();
				}
			};

			// Initialize all required events.
			const initializePage = function() {
				bindEvents();
				addPaywall();
			};
			initializePage();
		}

		revenueGeneratorPaywallPreview();
	} );
} )( jQuery ); // eslint-disable-line no-undef
