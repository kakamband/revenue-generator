/* global revenueGeneratorGlobalOptions tippy */
/**
 * JS to handle plugin settings screen interactions.
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
		function revenueGeneratorContributions() {
			// Settings screen elements.
			const $o = {
				body: $( 'body' ),
				requestSent: false,

				// Contribution Elements.
				contributionBox: '.rev-gen-contribution-main--box',
				contributionRequiredField:
					'h3[contenteditable], p[contenteditable], #rg_contribution_title',

				// Contribution Help.
				contributionHelpButton: '.rev-gen-contribution-main--help',
				contributionHelpModal: '.rev-gen-contribution-main-info-modal',
				contributionModalClose:
					'.rev-gen-contribution-main-info-modal-cross',
				contributionCampaignNameLabel: '#rg_contribution_campaign_name',
				contributionThankYouPageLabel:
					'#rg_contribution_thankyou_label',

				// Dashboard elements.
				contributionDashboardList:
					'.rev-gen-dashboard-content-contribution',
				contributionDashboardCode:
					'.rev-gen-dashboard-content-contribution-code',

				helpGAModal: '.rev-gen-settings-main-info-modal',

				// Account Activation Modal.
				activationModal: '.rev-gen-preview-main-account-modal',
				accountActionId:
					'.rev-gen-preview-main-account-modal-fields-merchant-id',
				accountActionKey:
					'.rev-gen-preview-main-account-modal-fields-merchant-key',

				laterpayLoader: $( '.laterpay-loader-wrapper' ),
				rgLayoutWrapper: $( '.rev-gen-layout-wrapper' ),
				rgContributionWrapper: $( '.rev-gen-contribution-main' ),

				// Contribution Action Elements
				contributionTitle: $(
					'.rev-gen-contribution-main--box-header'
				),
				contributionDescription: $(
					'.rev-gen-contribution-main--box-description'
				),
				contributionAmounts: $(
					'.rev-gen-contribution-main--box-donation-amount'
				),

				contributionCampaignName: $( '#rg_contribution_title' ),
				contributionThankYouPage: $( '#rg_contribution_thankyou' ),
				contributionGnerateCode: $(
					'.rev-gen-contribution-main-generate-button'
				),

				contributionCopyMessage: $(
					'.rev-gen-contribution-main-copy-message'
				),

				// Popup.
				snackBar: $( '#rg_js_SnackBar' ),
			};

			// Initialize all required events.
			const initializePage = function() {
				bindEvents();
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function() {
			    
				/**
				 * When the page has loaded, load the post content.
				 */
				$( document ).ready( function() {
					
					if ( $o.rgContributionWrapper.length > 0 && 0 === parseInt( revenueGeneratorGlobalOptions.globalOptions.is_contribution_tutorial_completed ) ) {
						const tour = initializeTour();
						addTourSteps( tour );
						startWelcomeTour( tour );
					}
				} );
				
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
				       $o.rgContributionWrapper.css( {
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


				// Generate Contribution Code.
				$o.contributionGnerateCode.on(
					'click',
					debounce( function( e ) {
						// validate fields.
						const isValid = validateAllfields();

						if ( 'invalid' === isValid ) {
							e.preventDefault();
							return false;
						}

						// Check for non verfied merchant.
						if (
							0 ===
							parseInt(
								revenueGeneratorGlobalOptions.globalOptions
									.is_merchant_verified
							)
						) {
							showAccountActivationModal();
							e.preventDefault();
							return false;
						}

						// check Lock.
						if ( ! $o.requestSent ) {
							// Add lock.
							$o.requestSent = true;
							const allAmountJson = getContributionAmounts();

							const formData = {
								action: 'rg_contribution_shortcode_generator',
								heading: $o.contributionTitle.text().trim(),
								description: $o.contributionDescription
									.text()
									.trim(),
								amounts: allAmountJson,
								title: $o.contributionCampaignName.val(),
								thank_you: $o.contributionThankYouPage.val(),
								security:
									revenueGeneratorGlobalOptions.rg_contribution_nonce,
							};

							// Update the title.
							$.ajax( {
								url: revenueGeneratorGlobalOptions.ajaxUrl,
								method: 'POST',
								data: formData,
								dataType: 'json',
							} ).done( function( r ) {
								$o.snackBar.showSnackbar( r.msg, 1500 );

								if ( r.success ) {
									copyToClipboard( r.code );
									$o.contributionGnerateCode.text(
										r.button_text
									);
									$o.contributionCopyMessage.show();
									$o.contributionGnerateCode.removeAttr(
										'style'
									);
									$o.contributionGnerateCode.prop(
										'disabled',
										true
									);
									$o.body.removeClass( 'modal-blur' );
									$o.body
										.find( 'input' )
										.removeClass( 'input-blur' );
								}
								// Release request lock.
								$o.requestSent = false;
							} );
						}
					}, 500 )
				);

				// Validate URL.
				$o.contributionThankYouPage.on( 'focusout', function() {
					const url = $( this ).val();
					// Check only if there is some input in the field.
					if ( '' !== url ) {
						if ( ! isValidURL( url ) ) {
							invalidBorder( $( this ) );
						}
					}
				} );

				// Validate Amounts.
				$o.contributionAmounts.on( 'focusout', function() {
					const amount = $( this )
						.text()
						.trim();
					const validAmount = validatePrice( amount );
					$( this ).text( validAmount );
				} );

				// Validated Heading and Description.
				$( $o.contributionRequiredField ).on( 'focusout', function() {
					const val = $( this ).is( 'input' )
						? $( this ).val()
						: $( this )
								.text()
								.trim();
					if ( ! val ) {
						invalidBorder( $( this ) );
					}
				} );

				// Copy Contribution code on Dashboard.
				$( $o.contributionDashboardList ).on( 'click', function() {
					const contributionCode = $( this )
						.find( $o.contributionDashboardCode )
						.val();
					copyToClipboard( contributionCode );
					$o.snackBar.showSnackbar(
						revenueGeneratorGlobalOptions.rg_code_copy_msg,
						1500
					);
				} );

				/**
				 * Handle tooltip button events for info modals.
				 */
				$o.body.on( 'click', $o.contributionHelpButton, function() {
					const infoButton = $( this );
					const modalType = infoButton.attr( 'data-info-for' );
					const existingModal = $o.rgContributionWrapper.find(
						$o.contributionHelpModal
					);

					// Remove any existing modal.
					if ( existingModal.length ) {
						$o.body.removeClass( 'modal-blur' );
						$o.body.find( 'input' ).removeClass( 'input-blur' );
						existingModal.remove();
					} else {
						const template = wp.template(
							`revgen-info-${ modalType }`
						);
						$o.rgContributionWrapper.append( template );

						// Change background color and highlight the clicked parent.
						$o.body.addClass( 'modal-blur' );
						$o.body.find( 'input' ).addClass( 'input-blur' );
						// Highlight selected info modal parent based on type.
						if ( 'campaignName' === modalType ) {
							$( $o.contributionCampaignNameLabel )
								.find( 'input' )
								.removeClass( 'input-blur' );
							$( $o.contributionThankYouPageLabel ).removeAttr(
								'style'
							);
							$( $o.contributionCampaignNameLabel ).css(
								'background-color',
								'#fff'
							);
						} else {
							$( $o.contributionThankYouPageLabel )
								.find( 'input' )
								.removeClass( 'input-blur' );
							$( $o.contributionCampaignNameLabel ).removeAttr(
								'style'
							);
							$( $o.contributionThankYouPageLabel ).css(
								'background-color',
								'#fff'
							);
						}
					}
				} );

				/**
				 * Hide the existing help popup.
				 */
				$o.body.on( 'click', $o.contributionModalClose, function() {
					$( $o.contributionHelpModal ).remove();
					$o.body.removeClass( 'modal-blur' );
					$( $o.contributionCampaignNameLabel ).css(
						'background-color',
						'inherit'
					);
					$( $o.contributionThankYouPageLabel ).css(
						'background-color',
						'inherit'
					);
					$o.body.find( 'input' ).removeClass( 'input-blur' );
				} );

				$o.contributionCampaignName.on( 'focusout', function() {
					// validate fields.
					const isValid = validateAllfields();

					if ( 'valid' === isValid ) {
						$o.contributionGnerateCode.css(
							'background-color',
							'#1d1d1d'
						);
					}
				} );
			};

			/**
			 * Display account activation modal for new merchant.
			 */
			const showAccountActivationModal = function() {
				$o.rgContributionWrapper.find( $o.activationModal ).remove();

				// Get the template for account verification.
				const template = wp.template(
					'revgen-account-activation-modal'
				);
				$o.rgContributionWrapper.append( template );

				// Blur out the background.
				$o.body.addClass( 'modal-blur' );
				$( $o.contributionBox ).addClass( 'modal-blur' );
				$o.body
					.find( 'input' )
					.not( $o.accountActionId + ',' + $o.accountActionKey )
					.addClass( 'input-blur' );
			};

			/**
			 * Check if provided URL is valid or not.
			 *
			 * @param {string} url URL to validate
			 * @return {boolean} true or false.
			 */
			const isValidURL = function( url ) {
				const res = url.match(
					/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
				); // jshint ignore:line
				return res !== null;
			};

			/**
			 * Copy provided text to clipboard.
			 *
			 * @param {string} codeText Code to be copied.
			 * @return {void}
			 */
			const copyToClipboard = function( codeText ) {
				const $temp = $( '<input>' );
				$o.body.append( $temp );
				$temp.val( codeText ).select();
				document.execCommand( 'copy' );
				$temp.remove();
			};

			/**
			 * Adds Invalid Border.
			 *
			 * @param {string} element
			 * @return {void}
			 */
			const invalidBorder = function( element ) {
				$( element ).css( 'border', '1px solid #ff1939' );
				setTimeout( function() {
					$( element ).removeAttr( 'style' );
				}, 5000 );
			};

			/**
			 * Validate all fields and hightlight invalid field.
			 *
			 * @return {void}
			 */
			const validateAllfields = function() {
				let checker = 'valid';
				$( $o.contributionRequiredField ).each( function() {
					const val = $( this ).is( 'input' )
						? $( this ).val()
						: $( this )
								.text()
								.trim();

					const currentElId = $( this ).attr( 'id' );
					if (
						'rg_contribution_thankyou' === String( currentElId )
					) {
						if ( ! isValidURL( val ) ) {
							invalidBorder( $( this ) );
							checker = 'invalid';
						}
					} else if ( ! val ) {
						invalidBorder( $( this ) );
						checker = 'invalid';
					}
				} );
				return checker;
			};

			/**
			 * Get validated price.
			 *
			 * @param {string}  price Purchase option price.
			 *
			 * @return {string} return validated price.
			 */
			const validatePrice = function( price ) {
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
			 * Get All amounts return json string.
			 *
			 * @return {string} all amounts in string.
			 */
			const getContributionAmounts = function() {
				// Get all amount elements.
				const amounts = $o.contributionAmounts;

				// New Amount array.
				const amtarr = [];
				if ( amounts.length > 0 ) {
					amounts.each( function( i ) {
						// Get value.
						let price = $( this )
							.text()
							.trim();
						if ( 'custom' === price ) {
							return true;
						}

						const obj = {};
						// Only add if price is greater than 0.00
						if ( parseFloat( price ) > 0.0 ) {
							price = price * 100;
							obj.price = price;
						}

						// check if price is less than 1.99
						if ( price > 199 ) {
							obj.revenue = 'sis';
						} else {
							obj.revenue = 'ppu';
						}
						if ( 0 === i ) {
							obj.is_selected = true;
						} else {
							obj.is_selected = false;
						}
						// Push value in array.
						amtarr.push( obj );
					} );
				}

				// Create Json string and return.
				return JSON.stringify( amtarr );
			};

			initializePage();
		}
		revenueGeneratorContributions();
	} );
} )( jQuery ); // eslint-disable-line no-undef
