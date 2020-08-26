/* global revenueGeneratorGlobalOptions, Shepherd, rgGlobal */
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
import { NodePath } from '@babel/core';

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
				contributionGenerateButtonLabel: '#rg_contribution_generate',
				contributionHelpGenerate: '#rev-gen-contribution-help-generate',

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

				// Tour elements.
				exitTour: '.rev-gen-exit-tour',

				laterpayLoader: $( '.laterpay-loader-wrapper' ),
				rgLayoutWrapper: $( '.rev-gen-layout-wrapper' ),
				rgContributionWrapper: $( '.rev-gen-contribution-main' ),

				// Contribution Action Elements
				form: $(
					'.rev-gen-contribution-form'
				),
				contributionTitle: $(
					'.rev-gen-contribution-main--box-header'
				),
				contributionTitleInput: $(
					'[name="dialog_header"]'
				),
				contributionDescription: $(
					'.rev-gen-contribution-main--box-description'
				),
				contributionDescriptionInput: $(
					'[name="dialog_description"]'
				),
				contributionAmounts: $(
					'.rev-gen-contribution-main--box-donation-amount'
				),
				allAmountsInput: $(
					'[name="amounts"]'
				),

				contributionCampaignName: $( '#rg_contribution_title' ),
				contributionThankYouPage: $( '#rg_contribution_thankyou' ),
				saveButton: $(
					'.rev-gen-contribution-main-generate-button'
				),

				contributionCopyMessage: $(
					'.rev-gen-contribution-main-copy-message'
				),

				// Popup.
				snackBar: $( '#rg_js_SnackBar' ),

				emailSupportButton: $( '.rev-gen-email-support' ),
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
					if (
						$o.rgContributionWrapper.length > 0 &&
						0 ===
							parseInt(
								revenueGeneratorGlobalOptions.globalOptions
									.is_contribution_tutorial_completed
							)
					) {
						const tour = initializeTour();
						addTourSteps( tour );
						startWelcomeTour( tour );
					}
				} );

				$o.contributionTitle.on( 'keyup', function() {
					$o.contributionTitleInput.val( $o.contributionTitle.text() );
					$o.form.trigger( 'change' );
				} );

				$o.contributionDescription.on( 'keyup', function() {
					$o.contributionDescriptionInput.val( $o.contributionDescription.text() );
					$o.form.trigger( 'change' );
				} );

				$( 'input', $o.form ).on( 'keyup', function() {
					$o.form.trigger( 'change' );
				} );

				// Generate Contribution Code.
				$o.form.on( 'submit', function( e ) {
						e.preventDefault();

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

							// show loader.
							showLoader();

							const allAmountJson = getContributionAmounts();
							$o.allAmountsInput.val( allAmountJson );

							const formData = $o.form.serialize();

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
									$o.saveButton.text(
										r.button_text
									);
									$o.contributionCopyMessage.show();
									$o.saveButton.removeAttr(
										'style'
									);
									$o.saveButton.prop(
										'disabled',
										true
									);
									$o.body.removeClass( 'modal-blur' );
									$o.body
										.find( 'input' )
										.removeClass( 'input-blur' );
									let merchantId =
										revenueGeneratorGlobalOptions.merchant_id;
									if (
										! merchantId &&
										$( $o.accountActionId ).val()
									) {
										merchantId = $(
											$o.accountActionId
										).val();
									}

									const eventAction = 'New ShortCode	';
									const eventCategory =
										'LP RevGen Contributions';
									let eventLabel =
										merchantId + ' - ' + formData.heading;
									const amounts = $o.contributionAmounts;
									amounts.each( function() {
										const price = $( this )
											.text()
											.trim();
										if ( 'custom' === price ) {
											return true;
										}
										eventLabel += ' - ' + price;
									} );

									rgGlobal.sendLPGAEvent(
										eventAction,
										eventCategory,
										eventLabel,
										0,
										true
									);
								}
								// Release request lock.
								$o.requestSent = false;

								// Hide Loader.
								hideLoader();
							} );

							return false;
						}
					} );

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

					$o.form.trigger( 'change' );
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
				//$( $o.contributionDashboardList ).on( 'click', function() {
				//	const contributionCode = $( this )
				//		.find( $o.contributionDashboardCode )
				//		.val();
				//	copyToClipboard( contributionCode );
				//	$o.snackBar.showSnackbar(
				//		revenueGeneratorGlobalOptions.rg_code_copy_msg,
				//		1500
				//	);
				//} );

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
						$( $o.contributionBox ).css(
							'background-color',
							'darkgray'
						);

						// Highlight selected info modal parent based on type.
						if ( 'campaignName' === modalType ) {
							$( $o.contributionCampaignNameLabel )
								.find( 'input' )
								.removeClass( 'input-blur' );

							$( $o.contributionGenerateButtonLabel ).removeAttr(
								'style'
							);

							$( $o.contributionThankYouPageLabel ).removeAttr(
								'style'
							);
							$( $o.contributionCampaignNameLabel ).css(
								'background-color',
								'#fff'
							);
						} else if ( 'shortcode' === modalType ) {
							$( $o.contributionGenerateButtonLabel )
								.find( 'input' )
								.removeClass( 'input-blur' );
							$o.saveButton.removeAttr( 'style' );
							$( $o.contributionGenerateButtonLabel ).css(
								'background-color',
								'#fff'
							);
							$o.saveButton.css( 'color', '#fff' );
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
							$( $o.contributionGenerateButtonLabel ).removeAttr(
								'style'
							);
						}

						let eventLabel = '';

						if ( 'campaignName' === modalType ) {
							eventLabel = 'Campaign name';
						} else if ( 'thankYouPage' === modalType ) {
							eventLabel = 'Thank you page';
						} else if ( 'shortcode' === modalType ) {
							eventLabel = 'Generate Shortcode';
						}

						// Send GA Event.
						const eventCategory = 'LP RevGen Contributions';
						const eventAction = 'Help';
						rgGlobal.sendLPGAEvent(
							eventAction,
							eventCategory,
							eventLabel,
							0,
							true
						);
					}
				} );

				/**
				 * Close Popup by clicking on wrapper.
				 */
				$o.rgLayoutWrapper.on( 'click', function() {
					if (
						$( $o.contributionHelpModal ) &&
						$( $o.contributionHelpModal ).length > 0
					) {
						// This may seem duplicate but modal is inside wrapper and needed to avoid call stack.
						$( $o.contributionHelpModal ).remove();
						$o.body.removeClass( 'modal-blur' );
						$( $o.contributionCampaignNameLabel ).css(
							'background-color',
							'inherit'
						);
						$( $o.contributionBox ).css(
							'background-color',
							'#fff'
						);
						$( $o.contributionThankYouPageLabel ).css(
							'background-color',
							'inherit'
						);
						$( $o.contributionGenerateButtonLabel ).css(
							'background-color',
							'inherit'
						);

						$o.body.find( 'input' ).removeClass( 'input-blur' );
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
					$( $o.contributionThankYouPageLabel ).css(
						'background-color',
						'inherit'
					);
					$( $o.contributionGenerateButtonLabel ).css(
						'background-color',
						'inherit'
					);
					$o.body.find( 'input' ).removeClass( 'input-blur' );
				} );

				$o.form.on( 'change', function() {
					// validate fields.
					const isValid = validateAllfields();

					if ( 'valid' === isValid ) {
						$o.saveButton.css(
							'background-color',
							'#1d1d1d'
						);
						$o.saveButton.css( 'color', '#ffffff' );
						$o.saveButton.text(
							__( 'Generate and copy code', 'revenue-generator' )
						);
						$o.saveButton.prop( 'disabled', false );
					}
				} );

				$( $o.contributionHelpGenerate ).on( 'click', function() {
					// Send GA Event.
					const eventCategory = 'LP RevGen Contributions';
					const eventAction = 'Help';
					const eventLabel = 'Generate code';
					rgGlobal.sendLPGAEvent(
						eventAction,
						eventCategory,
						eventLabel,
						0
					);
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

				const tutorialEventCategory =
					'LP RevGen Contributions Tutorial';
				const tutorialEventLabelContinue = 'Continue';
				const tutorialEventLabelComplete = 'Complete';

				// Add tutorial step for main search.
				tour.addStep( {
					id: 'rg-contribution-header-description',
					text: __( 'Click to edit', 'revenue-generator' ),
					attachTo: {
						element: '#rev-gen-contribution-main-header-section',
						on: 'top',
					},
					arrow: true,
					classes: 'rev-gen-tutorial-contribution-title',
					buttons: [ skipTourButton, nextButton ],
					when: {
						hide() {
							rgGlobal.sendLPGAEvent(
								'1 - Text Edit',
								tutorialEventCategory,
								tutorialEventLabelContinue,
								0,
								true
							);
						},
					},
				} );

				// Add tutorial step for editing header title
				tour.addStep( {
					id: 'rg-contribution-amount-first',
					text: __(
						'Click to edit each amount',
						'revenue-generator'
					),
					attachTo: {
						element:
							'.rev-gen-contribution-main--box-donation:first-child',
						on: 'top',
					},
					arrow: true,
					classes: 'rev-gen-tutorial-contribution-title',
					buttons: [ nextButton ],
					when: {
						hide() {
							rgGlobal.sendLPGAEvent(
								'2 - Amount Edit',
								tutorialEventCategory,
								tutorialEventLabelContinue,
								0,
								true
							);
						},
					},
				} );

				// Add tutorial step for option item.
				tour.addStep( {
					id: 'rg-contribution-amount-second',
					text: sprintf(
						__(
							'Amounts less than $5 will default to %1$s pay later %2$s',
							'revenue-generator'
						),
						'<a target="_blank" href="https://www.laterpay.net/academy/getting-started-with-laterpay-the-difference-between-pay-now-pay-later">',
						'</a>'
					),
					attachTo: {
						element:
							'.rev-gen-contribution-main--box-donation:nth-child(2)',
						on: 'top',
					},
					arrow: true,
					classes: 'rev-gen-tutorial-contribution-title',
					buttons: [ nextButton ],
					when: {
						hide() {
							rgGlobal.sendLPGAEvent(
								'3 - PN v PL',
								tutorialEventCategory,
								tutorialEventLabelContinue,
								0,
								true
							);
						},
					},
				} );

				// Add tutorial step for option item edit button.
				tour.addStep( {
					id: 'rg-contribution-campaign-name',
					text: __(
						"Enter the description that you would like to appear on your customer's invoice",
						'revenue-generator'
					),
					attachTo: {
						element: '#rg_contribution_campaign_name',
						on: 'top',
					},
					arrow: true,
					classes: 'rev-gen-tutorial-contribution-title',
					buttons: [ nextButton ],
					when: {
						hide() {
							rgGlobal.sendLPGAEvent(
								'4 - Campaign Name',
								tutorialEventCategory,
								tutorialEventLabelContinue,
								0,
								true
							);
						},
					},
				} );

				// Add tutorial step for paywall actions publish.
				tour.addStep( {
					id: 'rg-contribution-generate-button',
					text: sprintf(
						__(
							'When you’re ready, click here to copy your customized %1$s shortcode %2$s',
							'revenue-generator'
						),
						'<a target="_blank" href="https://wordpress.com/support/shortcodes/">',
						'</a>'
					),
					attachTo: {
						element: '.rev-gen-contribution-main-generate-button',
						on: 'right',
					},
					arrow: true,
					buttons: [
						{
							text: __( 'Complete', 'revenue-generator' ),
							action: tour.next,
							classes: 'shepherd-content-complete-tour-element',
						},
					],
					when: {
						hide() {
							rgGlobal.sendLPGAEvent(
								'5 - Generate Code',
								tutorialEventCategory,
								tutorialEventLabelComplete,
								0,
								true
							);
						},
					},
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
				$o.body.find( 'input' ).addClass( 'input-blur' );
				$o.body
					.find( '*[contenteditable="true"]' )
					.removeAttr( 'contenteditable' );
				$( $o.contributionBox ).css( 'background-color', 'darkgray' );
				$o.rgContributionWrapper.css( {
					'pointer-events': 'none',
				} );

				$o.emailSupportButton.hide();

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
					$o.body.find( 'input' ).removeClass( 'input-blur' );
					$( $o.contributionBox ).css( 'background-color', '#fff' );

					$o.rgContributionWrapper.css( {
						'pointer-events': 'unset',
					} );

					// Hide exit tour button.
					$( $o.exitTour ).remove();

					$o.emailSupportButton.hide();

					// Enable arrow events.
					$( document ).unbind( 'keydown', disableArrowKeys );

					const currentStep = Shepherd.activeTour.getCurrentStep();
					let tutorialEventAction = '';
					let tutorialEventLabel = 'Exit Tour';

					switch ( currentStep.id ) {
						case 'rg-contribution-header-description':
							tutorialEventAction = '1 - Text Edit';
							break;
						case 'rg-contribution-amount-first':
							tutorialEventAction = '2 - Amount Edit';
							break;
						case 'rg-contribution-amount-second':
							tutorialEventAction = '3 - PN v PL';
							break;
						case 'rg-contribution-campaign-name':
							tutorialEventAction = '4 - Campaign Name';
							break;
						case 'rg-contribution-generate-button':
							tutorialEventAction = '5 - Generate Code';
							tutorialEventLabel = 'Complete';
							break;
					}

					const tutorialEventCategory =
						'LP RevGen Contributions Tutorial';

					// Send GA exit event.
					rgGlobal.sendLPGAEvent(
						tutorialEventAction,
						tutorialEventCategory,
						tutorialEventLabel,
						0,
						true
					);

					setTimeout( function() {
						// Complete the tour, and update plugin option.
						completeTheTour();
					}, 500 );
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
					config_key: 'is_contribution_tutorial_completed',
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
						location.reload();
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

				const minPrice = parseFloat( 0.0 );
				const maxPrice = parseFloat( 1000.0 );

				// Validate maximum amount.
				if (
					parseFloat( price ) < minPrice ||
					isNaN( parseFloat( price ) )
				) {
					price = minPrice;
				} else if ( parseFloat( price ) > maxPrice ) {
					price = maxPrice;
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
