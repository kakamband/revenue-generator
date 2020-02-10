/* global revenueGeneratorGlobalOptions */

/**
 * JS to handle plugin welcome screen interactions.
 *
 * @package revenue-generator
 */

/**
 * Internal dependencies.
 */
import '../utils';

( function( $ ) {
	$( function() {
		function revenueGeneratorWelcome() {
			// Welcome screen elements.
			const $o = {
				body: $( 'body' ),

				// Welcome screen wrapper.
				welcomeScreenWrapper: $( '.welcome-screen-wrapper' ),

				// Cards.
				lowPostCard: $( '#rg_js_lowPostCard' ),
				highPostCard: $( '#rg_js_highPostCard' ),

				snackBar: $( '#rg_js_SnackBar' ),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function() {
				$o.lowPostCard.on( 'click', function() {
					storePostPublishCount( 'low' );
				} );

				$o.highPostCard.on( 'click', function() {
					storePostPublishCount( 'high' );
				} );
			};

			/*
			 * Update and store merchant selection for post publish rate.
			 */
			const storePostPublishCount = function( type = 'low' ) {
				const formData = {
					action: 'rg_update_global_config',
					config_key: 'average_post_publish_count',
					config_value: type,
					security:
						revenueGeneratorGlobalOptions.rg_global_config_nonce,
				};
				updateGlobalConfig(
					revenueGeneratorGlobalOptions.ajaxUrl,
					formData
				);
			};

			/**
			 * Update the global config with provided value.
			 *
			 * @param {string} ajaxURL  AJAX URL.
			 * @param {Object} formData Form data to be submitted.
			 */
			const updateGlobalConfig = function( ajaxURL, formData ) {
				$.ajax( {
					url: ajaxURL,
					method: 'POST',
					data: formData,
					dataType: 'json',
				} ).done( function( r ) {
					$o.snackBar.showSnackbar( r.msg, 1500 );
					$o.welcomeScreenWrapper.fadeOut( 1500, function() {
						window.location.reload();
					} );
				} );
			};

			// Initialize all required events.
			const initializePage = function() {
				bindEvents();
			};
			initializePage();
		}

		revenueGeneratorWelcome();
	} );
} )( jQuery ); // eslint-disable-line no-undef
