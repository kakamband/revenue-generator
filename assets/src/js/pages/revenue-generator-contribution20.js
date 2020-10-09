/* global revenueGeneratorGlobalOptions, Shepherd, rgGlobal, Backbone, RevGenContributionData */
/**
 * JS to handle plugin settings screen interactions.
 */

/**
 * Internal dependencies.
 */
import '../utils';
import { __, sprintf } from '@wordpress/i18n';
import { RevGenModal } from '../utils/rev-gen-modal';

const options = revenueGeneratorGlobalOptions;

window.RevGenApp = {
	vars: {},
	views: {},
};

( ( $, Backbone ) => {
	$( function() {
		const $o = {
			loader: $( '.laterpay-loader-wrapper' ),
		};

		const MainView = Backbone.View.extend( {
			el: '#contribution-builder-app',

			events: {
				'keyup [data-bind]': 'onInputChange',
				'change [data-bind]': 'onInputChange',
				'focusout [data-validate]': 'onValidatedFieldFocusOut',
				'submit form': 'onFormSubmit',
			},

			initialize() {
				this.doing_ajax = false;
				this.originalData = this.model.toJSON();

				this.$o = {
					snackBar: $( '#rg_js_SnackBar', this.$el ),
					submitButton: $( 'input[type=submit]', this.$el ),
					helperMessage: $(
						'.rg-contribution-builder__helper-message',
						this.$el
					),
				};

				this.initializeTour();

				this.listenTo( this.model, 'change', this.onModelChange );
			},

			initializeTour() {
				if (
					0 ===
					parseInt( options.globalOptions.contribution_tutorial_done )
				) {
					const tour = initializeTour();
					addTourSteps( tour );
					startWelcomeTour( tour );
				}
			},

			onInputChange( e ) {
				const $input = $( e.target );
				const attr = $input.attr( 'data-bind' );
				const value = $input.val();

				this.model.set( attr, value );
			},

			onModelChange( model ) {
				if (
					JSON.stringify( model.toJSON() ) !==
					JSON.stringify( this.originalData )
				) {
					this.enableSubmit();
				} else {
					this.disableSubmit();
				}
			},

			enableSubmit() {
				this.$o.submitButton.removeAttr( 'disabled' );
			},

			disableSubmit() {
				this.$o.submitButton.attr( {
					disabled: 'disabled',
				} );
			},

			isFormValid() {
				let isValid = true;

				$( '[data-bind]', this.$el ).each( function() {
					const $this = $( this );

					if ( $this.hasAttr( 'required' ) && ! $this.val() ) {
						isValid = false;
					}
				} );

				return isValid;
			},

			onValidatedFieldFocusOut( e ) {
				const $input = $( e.target );
				const validation = $input.data( 'validation' );
				const value = $input.val();
				const isRequired = $input.attr( 'required' );

				if ( validation ) {
					const isValid = this.validateInput( validation, value );

					if ( ! isValid ) {
						$input.addClass( 'error' );
					} else {
						$input.removeClass( 'error' );
					}
				}

				if ( ! value && isRequired ) {
					$input.addClass( 'error' );
				} else {
					$input.removeClass( 'error' );
				}
			},

			validateInput( validationType, value ) {
				if ( ! validationType || ! value ) {
					return;
				}

				let isValid = false;

				switch ( validationType ) {
					case 'url':
						const test = value.match(
							/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
						);

						isValid = test !== null;

						break;
				}

				return isValid;
			},

			onFormSubmit( e ) {
				/**
				 * @todo
				 *
				 * - Submit button text
				 * - Contribution amounts
				 * - Tracking
				 */
				e.preventDefault();

				if ( ! this.isFormValid() ) {
					return false;
				}

				// Check for non-verified merchant.
				if (
					0 === parseInt( options.globalOptions.is_merchant_verified )
				) {
					showAccountActivationModal();

					return false;
				}

				if ( ! this.doing_ajax ) {
					const self = this;

					this.doing_ajax = true;

					showLoader();

					const formData = JSON.stringify( this.model.toJSON() );

					$.ajax( {
						url: options.ajaxUrl,
						method: 'POST',
						data: formData,
						dataType: 'json',
					} ).done( function( r ) {
						self.$o.snackBar.showSnackbar( r.msg, 1500 );

						if ( r.success ) {
							copyToClipboard( r.code );

							self.$o.submitButton.text( r.button_text );
							self.disableSubmit();

							self.$o.helperMessage.show();

							const eventAction = 'New ShortCode	';
							const eventCategory = 'LP RevGen Contributions';
							const merchantId = getMerchantId();
							const eventLabel =
								merchantId + ' - ' + formData.heading;
							//const amounts = $o.contributionAmounts;
							//amounts.each( function() {
							//	const price = $( this )
							//		.text()
							//		.trim();
							//	if ( 'custom' === price ) {
							//		return true;
							//	}
							//	eventLabel += ' - ' + price;
							//} );

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

						self.doing_ajax = false;

						hideLoader();
					} );
				}
			},
		} );

		const PreviewView = Backbone.View.extend( {
			el: '#contribution-builder-preview',

			events: {},

			initialize() {},
		} );

		const initApp = function() {
			const model = new Backbone.Model( RevGenContributionData );

			window.RevGenApp.views.app = new MainView( {
				model,
			} );

			window.RevGenApp.views.preview = new PreviewView( {
				model,
			} );
		};

		initApp();

		const getMerchantId = function() {
			let merchantId = options.merchant_id;

			if ( ! merchantId ) {
				merchantId = window.RevGenApp.vars.merchant_id;
			}

			return merchantId;
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

			const tutorialEventCategory = 'LP RevGen Contributions Tutorial';
			const tutorialEventLabelContinue = 'Continue';
			const tutorialEventLabelComplete = 'Complete';

			// Add tutorial step for main search.
			const step1 = tour
				.addStep( {
					id: 'rg-contribution-header-description',
					text: __( 'Click to edit', 'revenue-generator' ),
					attachTo: {
						element: '#rev-gen-contribution-main-header-section',
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
				.on( 'before-hide', function() {
					const optionClasses = step1.options.classes;
					step1.options.classes = optionClasses.replace(
						'fade-in',
						'fade-out'
					);
					step1.updateStepOptions( step1.options );
				} )
				.on( 'hide', function() {
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
				.on( 'before-hide', function() {
					const optionClasses = step2.options.classes;
					step2.options.classes = optionClasses.replace(
						'fade-in',
						'fade-out'
					);
					step2.updateStepOptions( step2.options );
				} )
				.on( 'hide', function() {
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
				.on( 'before-hide', function() {
					const optionClasses = step3.options.classes;
					step3.options.classes = optionClasses.replace(
						'fade-in',
						'fade-out'
					);
					step3.updateStepOptions( step3.options );
				} )
				.on( 'hide', function() {
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
				.on( 'before-hide', function() {
					const optionClasses = step4.options.classes;
					step4.options.classes = optionClasses.replace(
						'fade-in',
						'fade-out'
					);
					step4.updateStepOptions( step4.options );
				} )
				.on( 'hide', function() {
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
						element: '.rev-gen-contribution-main-generate-button',
						on: 'right',
					},
					arrow: true,
					classes: 'fade-in',
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
				} )
				.on( 'before-hide', function() {
					const optionClasses = step5.options.classes;
					step5.options.classes = optionClasses.replace(
						'fade-in',
						'fade-out'
					);
					step5.updateStepOptions( step5.options );
				} )
				.on( 'hide', function() {
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
						const closeEvent = new Event( 'rev-gen-modal-close' );
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
					const merchantID = $( '#rev-gen-merchant-id', $el ).val();
					const merchantKey = $( '#rev-gen-api-key', $el ).val();
					const $tryAgain = $( '#rg_js_restartVerification', $el );

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
						window.RevGenApp.vars.merchant_id = merchantID;
						el.dispatchEvent( closeEvent );
					} else {
						$el.removeClass( 'loading' ).addClass( 'modal-error' );
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
		const verifyAccountCredentials = function( merchantId, merchantKey ) {
			if ( ! $o.requestSent ) {
				$o.requestSent = true;

				// Create form data.
				const formData = {
					action: 'rg_verify_account_credentials',
					merchant_id: merchantId,
					merchant_key: merchantKey,
					security: revenueGeneratorGlobalOptions.rg_paywall_nonce,
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
					revenueGeneratorGlobalOptions.merchant_id = r.merchant_id;

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
		 * Show the loader.
		 */
		const showLoader = function() {
			$o.loader.css( {
				display: 'flex',
			} );
		};

		/**
		 * Hide the loader.
		 */
		const hideLoader = function() {
			$o.loader.hide();
		};
	} );
} )( jQuery, Backbone ); // eslint-disable-line no-undef
