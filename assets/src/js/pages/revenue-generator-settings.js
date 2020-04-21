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

				// Settings Action items.
				settingsPerMonth: $( '.rev-gen-settings-post-per-month' ),
				laterpayLoader: $( '.laterpay-loader-wrapper' ),

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

							// Display Loader.
							showLoader();

							const perMonth = $( this ).val();

							// Create form Data.
							const formData = {
								action: 'rg_update_global_config',
								config_key: 'average_post_publish_count',
								config_value: perMonth,
								security:
									revenueGeneratorGlobalOptions.rg_global_config_nonce,
							};

							// Update Global Configurations.
							updateGloablConfig( formData );

							// Release request lock.
							$o.requestSent = false;

							// Hide Loader.
							hideLoader();
						}
					}, 500 )
				);
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
					$o.snackBar.showSnackbar( r.msg, 1500 );

					$o.body.css( {
						overflow: 'auto',
						height: 'auto',
					} );

					$( $o.paywallContent ).removeClass( 'blury' );
				} );
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
