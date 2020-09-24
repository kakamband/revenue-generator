/* global rgVars */

/**
 * JS to handle plugin Contribution Dailog.
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
		function revenueGeneratorContributionDailog() {
			// Welcome screen elements.
			const $o = {
				body: $( 'body' ),

				// Contribution Element.
				rgAmountTip: '.rg-amount-tip',

				// Action element.
				rg_preset_buttons: '.rev-gen-contribution-main--box-donation',
				rg_contribution_amounts:
					'.rev-gen-contribution-main--box-donation-wrapper',
				rg_customAmountButton: '.rev-gen-contribution-main-custom',

				rg_custom_amount: $( '.rg-custom-amount-input' ),
				rg_custom_amount_wrapper: $( '.rg-custom-amount-wrapper' ),
				rg_custom_amout_goBack: $( '.rg-custom-amount-goback' ),
				rg_singleContribution: $( '.rg-link-single' ),

				snackBar: $( '#rg_js_SnackBar' ),
			};

			// Binding events for contribution dialog.
			const bindContributionEvents = function() {
				// Event handler for clicking on the amounts in contribution dialog.
				$( $o.rg_preset_buttons ).on( 'mouseover', function() {
					const revenueType = $( this ).data( 'revenue' );

					if ( 'ppu' === revenueType ) {
						$( $o.rgAmountTip ).css( 'visibility', 'visible' );
					} else {
						$( $o.rgAmountTip ).css( 'visibility', 'hidden' );
					}
				} );

				/**
				 * Removes tip message on mouseout.
				 */
				$( $o.rg_preset_buttons ).on( 'mouseout', function() {
					$( $o.rgAmountTip ).css( 'visibility', 'hidden' );
				} );

				/**
				 * Open up Contribution Payment URL.
				 */
				$( $o.rg_preset_buttons )
					.not( $o.rg_customAmountButton )
					.on( 'click', function() {
						const contributionURL = $( this ).data( 'href' );
						window.open( contributionURL );
					} );

				// Handle custom amount input.
				$o.rg_custom_amount.on(
					'change',
					debounce( function() {
						const validatedPrice = validatePrice( $( this ).val() );
						$( this ).val( validatedPrice );

						// Get Price amount.
						const lpAmount = Math.round( $( this ).val() * 100 );

						// Compare price amount.
						if ( lpAmount <= 199 ) {
							$( $o.rgAmountTip ).css( 'visibility', 'visible' );
						} else {
							$( $o.rgAmountTip ).css( 'visibility', 'hidden' );
						}
					}, 800 )
				);

				// Handle multiple contribution button click.
				$( '.rg-custom-amount-send' ).on( 'click', function() {
					let payurl = '';

					const customAmount = $o.rg_custom_amount.val() * 100;
					if ( customAmount > 199 ) {
						payurl =
							$o.rg_custom_amount_wrapper.data( 'sis-url' ) +
							'&custom_pricing=' +
							rgVars.default_currency +
							customAmount;
					} else {
						payurl =
							$o.rg_custom_amount_wrapper.data( 'ppu-url' ) +
							'&custom_pricing=' +
							rgVars.default_currency +
							customAmount;
					}
					// Open payment url in new tab.
					window.open( payurl );
				} );

				/**
				 * Handles custom button click.
				 */
				$( $o.rg_customAmountButton ).on( 'click', function() {
					$( $o.rg_contribution_amounts ).fadeOut(
						'slow',
						function() {
							$o.rg_custom_amount_wrapper.show();
							$o.rg_custom_amount_wrapper
								.removeClass( 'slide-out' )
								.addClass( 'slide-in' );
						}
					);
				} );

				/**
				 * Handles back button event on custom amount box.
				 */
				$o.rg_custom_amout_goBack.on( 'click', function() {
					$o.rg_custom_amount_wrapper
						.removeClass( 'slide-in' )
						.addClass( 'slide-out' );
					setTimeout( function() {
						$o.rg_custom_amount_wrapper.hide();
						$( $o.rg_contribution_amounts ).fadeIn( 'slow' );
					}, 1900 );
				} );

				// Handle multiple contribution button click.
				$o.rg_singleContribution.on( 'click', function() {
					window.open(
						$( this ).data( 'url' ) +
							'&custom_pricing=' +
							rgVars.default_currency +
							$( this ).data( 'amount' )
					);
				} );
			};

			// Validate custom input price.
			const validatePrice = function( price ) {
				// strip non-number characters
				price = price.toString().replace( /[^0-9\,\.]/g, '' );

				// convert price to proper float value
				if ( typeof price === 'string' && price.indexOf( ',' ) > -1 ) {
					price = parseFloat( price.replace( ',', '.' ) ).toFixed(
						2
					);
				} else {
					price = parseFloat( price ).toFixed( 2 );
				}

				// prevent non-number prices
				if ( isNaN( price ) ) {
					price = 0.05;
				}

				// prevent negative prices
				price = Math.abs( price );

				// correct prices outside the allowed range of 0.05 - 1000.00
				if ( price > 1000.0 ) {
					price = 1000.0;
				} else if ( price < 0.05 ) {
					price = 0.05;
				}

				// format price with two digits
				price = price.toFixed( 2 );

				return price;
			};

			// Initialize all required events.
			const initializePage = function() {
				bindContributionEvents();
			};
			initializePage();
		}

		revenueGeneratorContributionDailog();
	} );
} )( jQuery ); // eslint-disable-line no-undef
