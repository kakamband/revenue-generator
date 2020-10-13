/* global revenueGeneratorGlobalOptions, Shepherd, rgGlobal */
/**
 * JS to handle plugin settings screen interactions.
 */

/**
 * Internal dependencies.
 */
import '../utils';
import { __, sprintf } from '@wordpress/i18n';
import { RevGenModal } from '../utils/rev-gen-modal';

( function( $ ) {
	$( function() {
		function revenueGeneratorContributions() {
			// Settings screen elements.
			const $o = {
				body: $( 'body' ),
				requestSent: false,

				// Contribution Elements.
				contributionBox: $( '.rev-gen-contribution-main--box' ),
				contributionRequiredField:
					'h3[contenteditable], p[contenteditable], #rg_contribution_title',

				// Contribution Help.
				contributionHelpButton: '.rev-gen-contribution-main--help',
				contributionHelpModal: '.rev-gen-contribution-main-info-modal',
				contributionModalClose:
					'.rev-gen-contribution-main-info-modal-cross',
				contributionCampaignNameLabel: $(
					'#rg_contribution_campaign_name'
				),
				contributionThankYouPageLabel: $(
					'#rg_contribution_thankyou_label'
				),
				contributionGenerateButtonLabel: $(
					'#rg_contribution_generate'
				),
				contributionHelpGenerate: $(
					'#rev-gen-contribution-help-generate'
				),

				// Dashboard elements.
				contributionDashboardShortcodeLink: $(
					'.rev-gen-dashboard__link--copy-shortcode'
				),
				contributionDashboardCode:
					'.rev-gen-dashboard-content-contribution-code',

				helpGAModal: '.rev-gen-settings-main-info-modal',

				// Account Activation Modal.
				activationModal: '.rev-gen-preview-main-account-modal',
				accountActionId: '#rev-gen-merchant-id',
				accountActionKey: '#rev-gen-api-key',

				// Tour elements.
				exitTour: '.rev-gen-exit-tour',

				laterpayLoader: $( '.laterpay-loader-wrapper' ),
				rgLayoutWrapper: $( '.rev-gen-layout-wrapper' ),
				rgContributionWrapper: $( '.rev-gen-contribution-main' ),

				// Contribution Action Elements
				form: $( '.rev-gen-contribution-form' ),
				contributionTitle: $(
					'.rev-gen-contribution-main--box-header'
				),
				contributionTitleInput: $( '[name="dialog_header"]' ),
				contributionDescription: $(
					'.rev-gen-contribution-main--box-description'
				),
				contributionDescriptionInput: $(
					'[name="dialog_description"]'
				),
				contributionAmounts: $(
					'.rev-gen-contribution-main--box-donation-amount'
				),
				allAmountsInput: $( '[name="amounts"]' ),
				saveButton: $( '.rev-gen-contribution-main-generate-button' ),

				contributionCampaignName: $( '#rg_contribution_title' ),
				contributionThankYouPage: $( '#rg_contribution_thankyou' ),
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

			const onModalClose = function() {
				$( $o.contributionHelpModal ).remove();
				$( '[data-has-help]' ).removeClass( 'highlighted' );
				$o.contributionBox.removeClass( 'faded' );
				$o.body.removeClass( 'modal-blur' );
				$o.body.find( 'input' ).removeClass( 'input-blur' );
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
					$o.contributionTitleInput.val(
						$o.contributionTitle.text()
					);
					$o.form.trigger( 'change' );
				} );

				$o.contributionDescription.on( 'keyup', function() {
					$o.contributionDescriptionInput.val(
						$o.contributionDescription.text()
					);
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
								$o.saveButton.text( r.button_text );
								$o.saveButton.removeClass( 'enabled' );
								$o.saveButton.prop( 'disabled', true );
								$o.contributionCopyMessage.show();
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
									merchantId = $( $o.accountActionId ).val();
								}

								const eventAction = 'New ShortCode	';
								const eventCategory = 'LP RevGen Contributions';
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

								if ( window.location.href !== r.edit_link ) {
									setTimeout( function() {
										window.location.href = r.edit_link;
									}, 1500 );
								}
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
				$o.contributionDashboardShortcodeLink.on( 'click', function(
					e
				) {
					e.preventDefault();

					const contributionCode = $( this ).attr( 'data-shortcode' );
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

					let eventLabel = '';

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
						$o.contributionBox.addClass( 'faded' );

						// Highlight selected info modal parent based on type.
						switch ( modalType ) {
							case 'campaignName':
								eventLabel = 'Campaign name';

								$(
									'input',
									$o.contributionCampaignNameLabel
								).removeClass( 'input-blur' );
								$o.contributionGenerateButtonLabel.removeClass(
									'highlighted'
								);
								$o.contributionThankYouPageLabel.removeClass(
									'highlighted'
								);
								$o.contributionCampaignNameLabel.addClass(
									'highlighted'
								);

								break;

							case 'shortcode':
								eventLabel = 'Generate Shortcode';

								$(
									'input',
									$o.contributionGenerateButtonLabel
								).removeClass( 'input-blur' );
								$o.contributionGenerateButtonLabel.addClass(
									'highlighted'
								);

								break;

							case 'thankYouPage':
								eventLabel = 'Thank you page';

								$(
									'input',
									$o.contributionThankYouPageLabel
								).removeClass( 'input-blur' );
								$o.contributionCampaignNameLabel.removeClass(
									'highlighted'
								);
								$o.contributionGenerateButtonLabel.removeClass(
									'highlighted'
								);
								$o.contributionThankYouPageLabel.addClass(
									'highlighted'
								);

								break;
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
						onModalClose();
					}
				} );

				/**
				 * Hide the existing help popup.
				 */
				$o.body.on( 'click', $o.contributionModalClose, function() {
					onModalClose();
				} );

				$o.form.on( 'change', function() {
					// validate fields.
					const isValid = validateAllfields();

					if ( 'valid' === isValid ) {
						$o.saveButton
							.addClass( 'enabled' )
							.prop( 'disabled', false );
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
						scrollTo: true,
						scrollToHandler: ( e ) => {
							$( 'html, body' ).animate(
								{
									scrollTop:
										$( e ).offset().top -
										$( window ).height() / 2 -
										$( e ).height(),
								},
								1000
							);
						},
					},
				} );
			};

			/**
			 * Show the loader.
			 */
			const showLoader = function() {
				$o.laterpayLoader.css( {
					display: 'flex',
				} );
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
				const step1 = tour
					.addStep( {
						id: 'rg-contribution-header-description',
						text: __( 'Click to edit', 'revenue-generator' ),
						attachTo: {
							element:
								'#rev-gen-contribution-main-header-section',
							on: 'top',
						},
						arrow: true,
						classes: 'rev-gen-tutorial-contribution-title fade-in',
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
					} )
					.on( 'before-hide', () => {
						const optionClasses = step1.options.classes;
						step1.options.classes = optionClasses.replace(
							'fade-in',
							'fade-out'
						);
						step1.updateStepOptions( step1.options );
					} )
					.on( 'hide', () => {
						$( step1.el ).removeAttr( 'hidden' );
						setTimeout( function() {
							$( step1.el ).attr( 'hidden', '' );
						}, 700 );
					} );

				// Add tutorial step for editing header title
				const step2 = tour
					.addStep( {
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
						classes: 'rev-gen-tutorial-contribution-title fade-in',
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
					} )
					.on( 'before-hide', () => {
						const optionClasses = step2.options.classes;
						step2.options.classes = optionClasses.replace(
							'fade-in',
							'fade-out'
						);
						step2.updateStepOptions( step2.options );
					} )
					.on( 'hide', () => {
						$( step2.el ).removeAttr( 'hidden' );
						setTimeout( function() {
							$( step2.el ).attr( 'hidden', '' );
						}, 700 );
					} );

				// Add tutorial step for option item.
				const step3 = tour
					.addStep( {
						id: 'rg-contribution-amount-second',
						text: sprintf(
							/* translators: %1$s laterpay.net link tag, %2$s laterpay.net link closing tag */
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
						classes: 'rev-gen-tutorial-contribution-title fade-in',
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
					} )
					.on( 'before-hide', () => {
						const optionClasses = step3.options.classes;
						step3.options.classes = optionClasses.replace(
							'fade-in',
							'fade-out'
						);
						step3.updateStepOptions( step3.options );
					} )
					.on( 'hide', () => {
						$( step3.el ).removeAttr( 'hidden' );
						setTimeout( function() {
							$( step3.el ).attr( 'hidden', '' );
						}, 700 );
					} );

				// Add tutorial step for option item edit button.
				const step4 = tour
					.addStep( {
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
						classes: 'rev-gen-tutorial-contribution-title fade-in',
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
					} )
					.on( 'before-hide', () => {
						const optionClasses = step4.options.classes;
						step4.options.classes = optionClasses.replace(
							'fade-in',
							'fade-out'
						);
						step4.updateStepOptions( step4.options );
					} )
					.on( 'hide', () => {
						$( step4.el ).removeAttr( 'hidden' );
						setTimeout( function() {
							$( step4.el ).attr( 'hidden', '' );
						}, 700 );
					} );

				// Add tutorial step for paywall actions publish.
				const step5 = tour
					.addStep( {
						id: 'rg-contribution-generate-button',
						text: sprintf(
							/* translators: %1$s WP.org shortcodes support page opening link tag, %2$s WP.org shortcodes support page closing link tag */
							__(
								'When you’re ready, click here to copy your customized %1$s shortcode %2$s',
								'revenue-generator'
							),
							'<a target="_blank" href="https://wordpress.com/support/shortcodes/">',
							'</a>'
						),
						attachTo: {
							element:
								'.rev-gen-contribution-main-generate-button',
							on: 'right',
						},
						arrow: true,
						classes: 'fade-in',
						buttons: [
							{
								text: __( 'Complete', 'revenue-generator' ),
								action: tour.next,
								classes:
									'shepherd-content-complete-tour-element',
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
					} )
					.on( 'before-hide', () => {
						const optionClasses = step5.options.classes;
						step5.options.classes = optionClasses.replace(
							'fade-in',
							'fade-out'
						);
						step5.updateStepOptions( step5.options );
					} )
					.on( 'hide', () => {
						$( step5.el ).removeAttr( 'hidden' );
						setTimeout( function() {
							$( step5.el ).attr( 'hidden', '' );
						}, 700 );
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
				$o.contributionBox.addClass( 'faded' );
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
					$o.contributionBox.removeClass( 'faded' );

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
						window.location.reload();
					}
				} );
			};

			const showAccountActivationModal = function() {
				new RevGenModal( {
					id: 'rg-modal-account-activation',
					keepOpen: true,
					templateData: {},
					onConfirm: () => {
						showAccountModal();
					},
					onCancel: ( e, el ) => {
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
							/* global Event */
							const closeEvent = new Event(
								'rev-gen-modal-close'
							);
							el.dispatchEvent( closeEvent );
							showAccountModal();
						}
						// Send GA Event.
						const eventCategory = 'LP RevGen Account';
						const eventLabel = 'Signup';
						const eventAction = 'Connect Account';
						rgGlobal.sendLPGAEvent(
							eventAction,
							eventCategory,
							eventLabel,
							0,
							true
						);
					},
				} );
			};

			const showAccountModal = function() {
				new RevGenModal( {
					id: 'rg-modal-connect-account',
					keepOpen: true,
					templateData: {},
					onConfirm: async ( e, el ) => {
						const closeEvent = new Event( 'rev-gen-modal-close' );
						const $el = $( el );
						const merchantID = $(
							'#rev-gen-merchant-id',
							$el
						).val();
						const merchantKey = $( '#rev-gen-api-key', $el ).val();
						const $tryAgain = $(
							'#rg_js_restartVerification',
							$el
						);

						$el.addClass( 'loading' );

						const verify = verifyAccountCredentials(
							merchantID,
							merchantKey
						);

						$tryAgain.on( 'click', function() {
							el.dispatchEvent( closeEvent );
							showAccountModal();
						} );

						if ( verify ) {
							$el.removeClass( 'loading' );
							el.dispatchEvent( closeEvent );
						} else {
							$el.removeClass( 'loading' ).addClass(
								'modal-error'
							);
						}
					},
				} );
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

					let eventLabel = '';
					let success = false;

					// Validate merchant details.
					$.ajax( {
						url: revenueGeneratorGlobalOptions.ajaxUrl,
						method: 'POST',
						async: false,
						data: formData,
						dataType: 'json',
					} ).done( function( r ) {
						$o.requestSent = false;

						// set connecting merchant ID.
						revenueGeneratorGlobalOptions.merchant_id =
							r.merchant_id;

						if ( true === r.success ) {
							$o.isPublish = true;
							showLoader();

							setTimeout( function() {
								// Explicitly change loclized data.
								revenueGeneratorGlobalOptions.globalOptions.is_merchant_verified =
									'1';
								hideLoader();
								// Display message about Credentails.
								$o.snackBar.showSnackbar( r.msg, 1500 );
							}, 2000 );
							eventLabel = 'Success';

							success = true;
						} else {
							// If there is error show Modal Error.
							$o.isPublish = true;
							eventLabel = 'Failure - ' + r.msg;

							success = false;
						}

						// Send GA Event.
						const eventCategory = 'LP RevGen Account';
						const eventAction = 'Connect Account';
						rgGlobal.sendLPGAEvent(
							eventAction,
							eventCategory,
							eventLabel,
							0,
							true
						);
					} );

					return success;
				}
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
