/* global revenueGeneratorGlobalOptions rgGlobal*/
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

( function( $ ) {
	$( function() {
		function revenueGeneratorSettings() {
			// Settings screen elements.
			const $o = {
				body: $( 'body' ),
				requestSent: false,

				// Settings Elements
				settingsMerchantID: '.rev-gen-settings-main-merchant-id',
				settingsMerchantKey: '.rev-gen-settings-main-merchant-key',
				settingsMerchantInputs:
					'.rev-gen-settings-main-merchant-id, .rev-gen-settings-main-merchant-key',
				settingsUserRoles: '.rev-gen-settings-main-user-roles',

				rgDashboard: '.rev-gen-dashboard-main',

				// HelpModel
				helpGAButton: '.rev-gen-settings-main-option-info',
				helpGAModal: '.rev-gen-settings-main-info-modal',

				// The hightlight rows
				rgGALaterpayRow: '.rg-laterpay-row',
				rgGAUserRow: '.rg-user-row',

				// Settings Action items.
				laterpayLoader: $( '.laterpay-loader-wrapper' ),
				rgLayoutWrapper: $( '.rev-gen-layout-wrapper' ),

				settingsWrapper: $( '.rev-gen-settings-main' ),
				settingsGAUserStatus: $( '.rg-settings-ga-status' ),
				settingsPerMonth: $( '.rev-gen-settings-main-post-per-month' ),
				settingsGAUserID: $( '.rev-gen-settings-main-ga-code-user' ),

				// Popup.
				snackBar: $( '#rg_js_SnackBar' ),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function() {
				/**
				 * Handle Settings Post Per Page radio button switch.
				 */
				$o.settingsPerMonth.on(
					'change',
					debounce( function() {
						// check Lock
						if ( ! $o.requestSent ) {
							// Add lock.
							$o.requestSent = true;

							const perMonth = $( this ).val();

							// Create form Data.
							const formData = {
								action: 'rg_update_global_config',
								config_key: 'average_post_publish_count',
								config_value: perMonth,
								security:
									revenueGeneratorGlobalOptions.rg_global_config_nonce,
							};

							// Display Loader.
							showLoader();
							// Update Global Configurations.
							updateGloablConfig( formData );

							// Release request lock.
							$o.requestSent = false;
						}
					}, 500 )
				);

				/**
				 * Validate and Store Merchant Credentials.
				 */
				$( $o.settingsMerchantInputs ).on(
					'focusout',
					debounce( function() {
						if ( ! $o.requestSent ) {
							const merchantID = $( $o.settingsMerchantID ).val();
							const merchantKey = $(
								$o.settingsMerchantKey
							).val();

							if ( merchantID.length && merchantKey.length ) {
								const formData = {
									action: 'rg_verify_account_credentials',
									merchant_id: merchantID,
									merchant_key: merchantKey,
									security:
										revenueGeneratorGlobalOptions.rg_paywall_nonce,
								};

								showLoader();

								// Validate Merchant Credentials.
								validateMerchant( formData );
							}
						}
					}, 500 )
				);

				/**
				 * Stores GA Perfrence.
				 */
				$o.settingsGAUserStatus.on(
					'click',
					debounce( function() {
						// check Lock
						if ( ! $o.requestSent ) {
							// Add lock.
							$o.requestSent = true;

							let gaUserStatus = 0;
							if ( $( this ).is( ':checked' ) ) {
								gaUserStatus = $( this ).val();
							}

							// get Config type.
							const gaUserStatusType = $( this ).attr( 'id' );

							let gaConfigKey;
							if ( 'rgGAUserStatus' === gaUserStatusType ) {
								gaConfigKey = 'rg_ga_personal_enabled_status';
							} else if (
								'rgGALaterPayStatus' === gaUserStatusType
							) {
								gaConfigKey = 'rg_ga_enabled_status';
							}

							// Create form Data.
							const formData = {
								action: 'rg_update_settings_options',
								config_key: gaConfigKey,
								config_value: gaUserStatus,
								security:
									revenueGeneratorGlobalOptions.rg_setting_nonce,
							};

							// Display Loader.
							showLoader();
							// Update Global Configurations.
							updateGloablConfig( formData );

							// Release request lock.
							$o.requestSent = false;
						}
					}, 500 )
				);
			};

			/**
			 * Stores Users GA id.
			 */
			$o.settingsGAUserID.on(
				'focusout',
				debounce( function() {
					// check Lock
					if ( ! $o.requestSent ) {
						// Add lock.
						$o.requestSent = true;

						const gaPersonlID = $( this ).val();

						// Create form Data.
						const formData = {
							action: 'rg_update_settings_options',
							config_key: 'rg_personal_ga_ua_id',
							config_value: gaPersonlID,
							security:
								revenueGeneratorGlobalOptions.rg_setting_nonce,
						};

						// Display Loader.
						showLoader();
						// Update Global Configurations.
						updateGloablConfig( formData );

						// Release request lock.
						$o.requestSent = false;
					}
				}, 500 )
			);

			/**
			 * Handle tooltip button events for info modals.
			 */
			$o.body.on( 'click', $o.helpGAButton, function() {
				const infoButton = $( this );
				const modalType = infoButton.attr( 'data-info-for' );
				const existingModal = $o.settingsWrapper.find( $o.helpGAModal );

				// Remove any existing modal.
				if ( existingModal.length ) {
					$o.body.removeClass( 'modal-blur' );
					$o.body.find( 'input' ).removeClass( 'input-blur' );
					existingModal.remove();
				} else {
					const template = wp.template(
						`revgen-info-${ modalType }`
					);
					$o.settingsWrapper.append( template );

					// Change background color and highlight the clicked parent.
					$o.body.addClass( 'modal-blur' );
					$o.body.find( 'input' ).addClass( 'input-blur' );
					// Highlight selected info modal parent based on type.
					if ( 'user' === modalType ) {
						$( $o.rgGAUserRow )
							.find( 'input' )
							.removeClass( 'input-blur' );
						$( $o.rgGALaterpayRow ).removeAttr( 'style' );
						$( $o.rgGAUserRow ).css( 'background-color', '#fff' );
					} else {
						$( $o.rgGALaterpayRow )
							.find( 'input' )
							.removeClass( 'input-blur' );
						$( $o.rgGAUserRow ).removeAttr( 'style' );
						$( $o.rgGALaterpayRow ).css(
							'background-color',
							'#fff'
						);
					}
				}
			} );

			/**
			 * Hide the existing help popup.
			 */
			$o.rgLayoutWrapper.on( 'click', function() {
				$( $o.helpGAModal ).remove();
				$o.body.removeClass( 'modal-blur' );
				$( $o.rgGAUserRow ).css( 'background-color', 'inherit' );
				$( $o.rgGALaterpayRow ).css( 'background-color', 'inherit' );
				$o.body.find( 'input' ).removeClass( 'input-blur' );
			} );

			/**
			 * Show the loader.
			 */
			const showLoader = function() {
				$o.laterpayLoader.css( 'display', 'flex' );
			};

			/**
			 * Hide the loader.
			 */
			const hideLoader = function() {
				$o.laterpayLoader.hide();
			};

			const validateMerchant = function( formData ) {
				// Check Validation.
				$.ajax( {
					url: revenueGeneratorGlobalOptions.ajaxUrl,
					method: 'POST',
					data: formData,
					dataType: 'json',
				} ).done( function( r ) {
					hideLoader();
					$o.snackBar.showSnackbar( r.msg, 1500 );

					// Release request lock.
					$o.requestSent = false;

					if ( true === r.success ) {
						validBorder( $o.settingsMerchantInputs );
					} else {
						invalidBorder( $o.settingsMerchantInputs );
					}
				} );
			};

			/**
			 * Updates global configuration and display message popup.
			 *
			 * @param {Object} formData Form Data.
			 * @return {void}
			 */
			const updateGloablConfig = function( formData ) {
				// Update the title.
				$.ajax( {
					url: revenueGeneratorGlobalOptions.ajaxUrl,
					method: 'POST',
					data: formData,
					dataType: 'json',
				} ).done( function( r ) {
					hideLoader();
					$o.snackBar.showSnackbar( r.msg, 1500 );
					// Release request lock.
					$o.requestSent = false;
				} );
			};

			/**
			 * Adds valid Border.
			 *
			 * @param {string} element
			 * @return {void}
			 */
			const validBorder = function( element ) {
				$( element ).css( 'border-color', '#19e4ac' );
				setTimeout( function() {
					$( element ).removeAttr( 'style' );
				}, 5000 );
			};

			/**
			 * Adds Invalid Border.
			 *
			 * @param {string} element
			 * @return {void}
			 */
			const invalidBorder = function( element ) {
				$( element ).css( 'border-color', '#ff1939' );
				setTimeout( function() {
					$( element ).removeAttr( 'style' );
				}, 5000 );
			};

			// Initialize all required events.
			const initializePage = function() {
				bindEvents();
				// Send GA Event on Dashboard load. (test event)
				if ( $( $o.rgDashboard ).length > 0 ) {
					const eventlabel = 'Revenue Generator Dashboard';
					const eventCategory = 'Revenue Generator Plugin';
					rgGlobal.sendLPGAEvent(
						'View Dashboard',
						eventCategory,
						eventlabel,
						0,
						true
					);
				}
			};

			/**
			 * Inject GA Script.
			 *
			 * @param {boolean} injectNow
			 * @return {Window} returns script loaded.
			 */
			const injectGAScript = function( injectNow ) {
				if ( true === injectNow ) {
					// This injector script is for GA have made minor modifications to fix linting issue.
					( function( i, s, o, g, r, a, m ) {
						i.GoogleAnalyticsObject = r;
						i[ r ] =
							i[ r ] ||
							function() {
								( i[ r ].q = i[ r ].q || [] ).push( arguments );
							};
						i[ r ].l = 1 * new Date();
						a = s.createElement( o );
						m = s.getElementsByTagName( o )[ 0 ];
						a.async = 1;
						a.src = g;
						m.parentNode.insertBefore( a, m );
					} )(
						window,
						document,
						'script',
						'https://www.google-analytics.com/analytics.js',
						'rgga'
					);
					return window[ window.GoogleAnalyticsObject || 'rgga' ];
				}
			};

			/**
			 * Send Event to Laterpay.
			 *
			 * @param {boolean} injectNow
			 * @param {string} eventlabel
			 * @param {string} eventAction
			 * @param {string} eventCategory
			 * @param {string} eventValue
			 * @param {string} eventInteraction
			 * @return {void}
			 */
			const sendParentEvent = function(
				injectNow,
				eventlabel,
				eventAction,
				eventCategory,
				eventValue,
				eventInteraction
			) {
				const rgga = injectGAScript( injectNow );
				if ( typeof rgga === 'function' ) {
					rgga(
						'create',
						revenueGeneratorGlobalOptions.rg_tracking_id,
						'auto',
						'rgParentTracker'
					);
					rgga( 'rgParentTracker.send', 'event', {
						eventCategory,
						eventAction,
						eventLabel: eventlabel,
						eventValue,
						nonInteraction: eventInteraction,
					} );
				}
			};

			/**
			 * Send event to User GA.
			 *
			 * @param {boolean} injectNow
			 * @param {string} eventlabel
			 * @param {string} eventAction
			 * @param {string} eventCategory
			 * @param {string} eventValue
			 * @param {string} eventInteraction
			 * @return {void}
			 */
			const sendUserEvent = function(
				injectNow,
				eventlabel,
				eventAction,
				eventCategory,
				eventValue,
				eventInteraction
			) {
				const rgga = injectGAScript( injectNow );
				if ( typeof rgga === 'function' ) {
					rgga(
						'create',
						revenueGeneratorGlobalOptions.rg_user_tracking_id,
						'auto',
						'rgUserTracker'
					);
					rgga( 'rgUserTracker.send', 'event', {
						eventCategory,
						eventAction,
						eventLabel: eventlabel,
						eventValue,
						nonInteraction: eventInteraction,
					} );
				}
			};

			/**
			 * Create a tracker and send event to GA.
			 *
			 * @param {string} gaTracker
			 * @param {string} trackingId
			 * @param {string} trackerName
			 * @param {string} eventAction
			 * @param {string} eventLabel
			 * @param {string} eventCategory
			 * @param {string} eventValue
			 * @param {string} eventInteraction
			 * @return {void}
			 */
			const createTrackerAndSendEvent = function(
				gaTracker,
				trackingId,
				trackerName,
				eventAction,
				eventLabel,
				eventCategory,
				eventValue,
				eventInteraction
			) {
				gaTracker( 'create', trackingId, 'auto', trackerName );
				gaTracker( trackerName + '.send', 'event', {
					eventCategory,
					eventAction,
					eventLabel,
					eventValue,
					nonInteraction: eventInteraction,
				} );
			};

			// Detect if GA is Enabled by MonsterInsights Plugin.
			const detectMonsterInsightsGA = function() {
				if (
					typeof window.mi_track_user === 'boolean' &&
					true === window.mi_trac_user
				) {
					return window[
						window.GoogleAnalyticsObject || '__gaTracker'
					];
				}
			};

			window.rgGlobal = {
				// Send GA Event conditionally.
				sendLPGAEvent(
					eventAction,
					eventCategory,
					eventLabel,
					eventValue,
					eventInteraction
				) {
					if ( 'undefined' === typeof eventInteraction ) {
						eventInteraction = false;
					}

					let sentUserEvent = false;
					const __gaTracker = detectMonsterInsightsGA();
					let trackers = '';
					const userUAID =
						revenueGeneratorGlobalOptions.rg_user_tracking_id;
					const rgUAID = revenueGeneratorGlobalOptions.rg_tracking_id;

					if ( userUAID.length > 0 && rgUAID.length > 0 ) {
						if ( typeof __gaTracker === 'function' ) {
							trackers = __gaTracker.getAll();
							trackers.forEach( function( tracker ) {
								if (
									userUAID === tracker.get( 'trackingId' )
								) {
									sentUserEvent = true;
									const trackerName = tracker.get( 'name' );
									__gaTracker(
										trackerName + '.send',
										'event',
										{
											eventCategory,
											eventAction,
											eventLabel,
											eventValue,
											nonInteraction: eventInteraction,
										}
									);
								}
							} );

							if ( true === sentUserEvent ) {
								createTrackerAndSendEvent(
									rgUAID,
									'rgParentTracker',
									eventAction,
									eventLabel,
									eventCategory,
									eventValue,
									eventInteraction
								);
							} else {
								createTrackerAndSendEvent(
									__gaTracker,
									rgUAID,
									'rgParentTracker',
									eventAction,
									eventLabel,
									eventCategory,
									eventValue,
									eventInteraction
								);
								createTrackerAndSendEvent(
									__gaTracker,
									userUAID,
									'rgUserTracker',
									eventAction,
									eventLabel,
									eventCategory,
									eventValue,
									eventInteraction
								);
							}
						} else {
							sendParentEvent(
								true,
								eventLabel,
								eventAction,
								eventCategory,
								eventValue,
								eventInteraction
							);
							sendUserEvent(
								true,
								eventLabel,
								eventAction,
								eventCategory,
								eventValue,
								eventInteraction
							);
						}
					} else if ( userUAID.length > 0 && rgUAID.length === 0 ) {
						if ( typeof __gaTracker === 'function' ) {
							trackers = __gaTracker.getAll();
							trackers.forEach( function( tracker ) {
								if (
									userUAID === tracker.get( 'trackingId' )
								) {
									sentUserEvent = true;
									const trackerName = tracker.get( 'name' );
									__gaTracker(
										trackerName + '.send',
										'event',
										{
											eventCategory,
											eventAction,
											eventLabel,
											eventValue,
											nonInteraction: eventInteraction,
										}
									);
								}
							} );

							if ( true !== sentUserEvent ) {
								sendUserEvent(
									true,
									eventLabel,
									eventAction,
									eventCategory,
									eventValue,
									eventInteraction
								);
							}
						} else {
							sendUserEvent(
								true,
								eventLabel,
								eventAction,
								eventCategory,
								eventValue,
								eventInteraction
							);
						}
					} else if ( userUAID.length === 0 && rgUAID.length > 0 ) {
						if ( typeof __gaTracker === 'function' ) {
							createTrackerAndSendEvent(
								__gaTracker,
								rgUAID,
								'rgParentTracker',
								eventAction,
								eventLabel,
								eventCategory,
								eventValue,
								eventInteraction
							);
						} else {
							sendParentEvent(
								true,
								eventLabel,
								eventAction,
								eventCategory,
								eventValue,
								eventInteraction
							);
						}
					}
				},
			};

			initializePage();
		}

		revenueGeneratorSettings();
	} );
} )( jQuery ); // eslint-disable-line no-undef
