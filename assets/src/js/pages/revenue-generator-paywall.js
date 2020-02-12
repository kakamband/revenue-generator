/**
 * JS to handle plugin paywall preview screen interactions.
 *
 * @package revenue-generator
 */

/**
 * Internal dependencies.
 */
import '../utils';

( function( $ ) {
	$( function() {
		function revenueGeneratorPaywallPreview() {
			// Paywall screen elements.
			const $o = {
				body: $( 'body' ),

				// Preview wrapper.
				previewWrapper: $( '.rev-gen-preview-main' ),

				postPreviewWrapper: $( '#rg_js_postPreviewWrapper' ),

				// Search elements.
				searchContent: $( '#rg_js_searchContent' ),

				snackBar: $( '#rg_js_SnackBar' ),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function() {
				// When merchant types in the search box blur out the rest of the area.
				$o.searchContent.on( 'focus', function() {
					$o.postPreviewWrapper.addClass( 'blury' );
					$( 'html, body' ).animate( { scrollTop: 0 }, 'slow' );
					$o.body.css( {
						overflow: 'hidden',
						height: '100%',
					} );
				} );

				// Revert back to original state once the focus is no more on search box.
				$o.searchContent.on( 'focusout', function() {
					$o.body.css( {
						overflow: 'auto',
						height: 'auto',
					} );
					$o.postPreviewWrapper.removeClass( 'blury' );
				} );
			};

			// Initialize all required events.
			const initializePage = function() {
				bindEvents();
			};
			initializePage();
		}

		revenueGeneratorPaywallPreview();
	} );
} )( jQuery ); // eslint-disable-line no-undef
