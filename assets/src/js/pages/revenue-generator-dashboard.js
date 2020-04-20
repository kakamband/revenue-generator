/* global revenueGeneratorGlobalOptions */
/**
 * JS to handle plugin dashboard screen interactions.
 *
 * @package revenue-generator
 */

/**
 * Internal dependencies.
 */
import '../utils';

( function( $ ) {
	$( function() {
		function revenueGeneratorDashboard() {
			// Dashboard screen elements.
			const $o = {
				body: $( 'body' ),
				requestSent: false,

				// Paywall listing area elements.
				paywallContent: '.rev-gen-dashboard-content',
				paywallPreview: '.rev-gen-dashboard-content-paywall-preview',
				paywallContentWrapper: '.rev-gen-dashboard-content-paywall',
				// Dashboard bar action items.
				newPaywall: $( '#rg_js_newPaywall' ),
				sortPaywalls: $( '#rg_js_filterPaywalls' ),
				searchPaywall: $( '#rg_js_searchPaywall' ),
				editPayWallName: $( '.rev-gen-dashboard-paywall-name' ),
				laterpayLoader: $( '.laterpay-loader-wrapper' ),

				// Dashboard footer area.
				restartTour: $( '#rg_js_RestartTutorial' ),

				snackBar: $( '#rg_js_SnackBar' ),
			};

			/**
			 * Bind all element events.
			 */
			const bindEvents = function() {
				/**
				 * Handle the next button events of the tour and update preview accordingly.
				 */
				$o.body.on( 'click', $o.paywallPreview, function() {
					const paywallId = $( this )
						.closest( $o.paywallContentWrapper )
						.attr( 'data-paywall-id' );
					if ( paywallId ) {
						window.location.href =
							revenueGeneratorGlobalOptions.paywallPageBase +
							'&current_paywall=' +
							paywallId;
					}
				} );

				/**
				 * Restart the tour from dashboard.
				 */
				$o.restartTour.on( 'click', function() {
					// Create form data.
					const formData = {
						action: 'rg_restart_tour',
						restart_tour: '1',
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
						if ( true === r.success ) {
							window.location = $o.newPaywall.attr( 'href' );
						}
					} );
				} );

				/**
				 * Handle paywall sorting dropdown.
				 */
				$o.sortPaywalls.on( 'change', function() {
					const sortBy = $( this ).val();
					// Create form data.
					const formData = {
						action: 'rg_set_paywall_order',
						rg_current_url: window.location.href,
						rg_sort_order: sortBy,
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
						if ( true === r.success && r.redirect_to ) {
							window.location.href = r.redirect_to;
						}
					} );
				} );

				/**
				 * When merchant starts to type in the search box blur out the paywall list area.
				 */
				$o.searchPaywall.on( 'focus', function() {
					$( $o.paywallContent ).addClass( 'blury' );
					$o.body.css( {
						overflow: 'hidden',
						height: '100%',
					} );
					const searchPaywallTerm = $( this )
						.val()
						.trim();
					if ( searchPaywallTerm.length ) {
						$o.searchPaywall.trigger( 'change' );
					}
				} );

				/**
				 * Revert back to original state once the focus is no more on search box.
				 */
				$o.searchPaywall.on( 'focusout', function() {
					$o.body.css( {
						overflow: 'auto',
						height: 'auto',
					} );
					$( $o.paywallContent ).removeClass( 'blury' );
				} );

				/**
				 * Revert back to original state if merchant clicks on paywall list area.
				 */
				$( $o.paywallContent ).on( 'click', function() {
					$o.body.css( {
						overflow: 'auto',
						height: 'auto',
					} );
					$( $o.paywallContent ).removeClass( 'blury' );
				} );

				/**
				 * Handle Search input on enter.
				 */
				$o.searchPaywall.on( 'keyup', function( event ) {
					// Check for enter key.
					if ( event.keyCode === 13 ) {
						showLoader();
						const searchPaywallTerm = $( this )
							.val()
							.trim();
						searchPaywall( searchPaywallTerm );
					}
				} );

				/**
				 * Handle the paywall title update.
				 */
				$o.editPayWallName.on( 'focusout', function() {
					if ( ! $o.requestSent ) {
						// Prevent duplicate requests.
						$o.requestSent = true;

						$( $o.paywallContent ).addClass( 'blury' );
						$o.body.css( {
							overflow: 'hidden',
							height: '100%',
						} );

						// Create form data.
						const formData = {
							action: 'rg_set_paywall_name',
							new_paywall_name: $( this )
								.text()
								.trim(),
							paywall_id: $( this )
								.closest( $o.paywallContentWrapper )
								.attr( 'data-paywall-id' ),
							security:
								revenueGeneratorGlobalOptions.rg_paywall_nonce,
						};

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

							// Release request lock.
							$o.requestSent = false;
						} );
					}
				} );
			};

			/**
			 * Show the loader.
			 */
			const showLoader = function() {
				$o.laterpayLoader.css( { display: 'flex' } );
			};

			/**
			 * Search paywall based on merchants search term.
			 *
			 * @param {string} searchTerm The part of name being searched for.
			 */
			const searchPaywall = function( searchTerm ) {
				// prevent duplicate requests.
				if ( ! $o.requestSent ) {
					$o.requestSent = true;

					// Has something input.
					if ( searchTerm.length ) {
						// Search and display resultset.
						// Create form data.
						const formData = {
							action: 'rg_search_paywall',
							rg_current_url: window.location.href,
							search_term: searchTerm,
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
							if ( true === r.success && r.redirect_to ) {
								window.location.href = r.redirect_to;
							}
						} );
					} else {
						const url = new URL( window.location.href );
						const params = url.searchParams;

						// Delete the search_term parameter.
						params.delete( 'search_term' );
						url.search = params.toString();
						const dashboardURL = url.toString();

						// redirects to dashboard url.
						window.location.href = dashboardURL;
					}
				}
			};

			// Initialize all required events.
			const initializePage = function() {
				bindEvents();
			};
			initializePage();
		}

		revenueGeneratorDashboard();
	} );
} )( jQuery ); // eslint-disable-line no-undef
