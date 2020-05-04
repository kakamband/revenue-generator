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
				rgAmountSelected: '.rg-amount-preset-button-selected',
				rgAmountTip: '.rg-amount-tip',

				// Action element.
				rg_preset_buttons: '.rg-amount-preset-button',
				rg_custom_amount: $( '.rg-custom-amount-input' ),
				rg_custom_amount_wrapper: $( '.rg-custom-input-wrapper' ),
				rg_singleContribution: $( '.rg-link-single' ),

				snackBar: $( '#rg_js_SnackBar' ),
			};

			// Binding events for contribution dialog.
			const bindContributionEvents = function() {
				// On ready.
				$( document ).ready( function() {
					if ( $( $o.rgAmountSelected ).length > 0 ) {
						const revenueType = $( $o.rgAmountSelected ).data(
							'revenue'
						);

						if ( 'ppu' === revenueType ) {
							$( $o.rgAmountTip ).css( 'visibility', 'visible' );
						} else {
							$( $o.rgAmountTip ).css( 'visibility', 'hidden' );
						}
					}
				} );

				// Event handler for clicking on the amounts in contribution dialog.
				$( $o.rg_preset_buttons ).on( 'click', function() {
					$( this )
						.parents( '.rg-amount-presets' )
						.find( '.rg-amount-preset-button' )
						.removeClass( 'rg-amount-preset-button-selected' );
					$( this ).addClass( 'rg-amount-preset-button-selected' );

					const revenueType = $( this ).data( 'revenue' );

					if ( 'ppu' === revenueType ) {
						$( $o.rgAmountTip ).css( 'visibility', 'visible' );
					} else {
						$( $o.rgAmountTip ).css( 'visibility', 'hidden' );
					}
				} );

				// Handle custom amount input.
				$o.rg_custom_amount.on(
					'change',
					debounce( function() {
						$( this )
							.parents( '.rg-body-wrapper' )
							.find( '.rg-amount-preset-button' )
							.removeClass( 'rg-amount-preset-button-selected' );
						const validatedPrice = validatePrice( $( this ).val() );
						$( this ).val( validatedPrice );

						// Get Price amount.
						const lpAmount = Math.round( $( this ).val() * 100 );

						// Compare price amount.
						if ( lpAmount > 199 ) {
							$( $o.rgAmountTip ).css( 'visibility', 'visible' );
						} else {
							$( $o.rgAmountTip ).css( 'visibility', 'hidden' );
						}
					}, 800 )
				);

				// Handle multiple contribution button click.
				$( '.rg-contribution-button' ).on( 'click', function() {
					const currentAmount = $( this )
						.parents( '.rg-body-wrapper' )
						.find( '.rg-amount-preset-button-selected' );
					let payurl = '';

					if ( currentAmount.length ) {
						payurl = currentAmount.data( 'url' );
					} else {
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
					}
					// Open payment url in new tab.
					window.open( payurl );
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
