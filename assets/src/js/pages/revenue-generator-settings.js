/* global revenueGeneratorGlobalOptions */
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

				// Settings Action items.
				laterpayLoader: $( '.laterpay-loader-wrapper' ),

				settingsPerMonth: $( '.rev-gen-settings-main-post-per-month' ),

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
			};

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
			};

			/**
			 * Adds Invalid Border.
			 *
			 * @param {string} element
			 * @return {void}
			 */
			const invalidBorder = function( element ) {
				$( element ).css( 'border-color', '#ff1939' );
			};

			// Initialize all required events.
			const initializePage = function() {
				bindEvents();
			};
			initializePage();
		}

		revenueGeneratorSettings();
	} );
} )( jQuery ); // eslint-disable-line no-undef
