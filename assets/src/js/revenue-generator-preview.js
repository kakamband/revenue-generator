/* globals jQuery, Backbone */
( ( $ ) => {
	$( function() {
		const ContributionView = Backbone.View.extend( {
			el: '.rev-gen-contribution-main',

			events: {
				'keyup [contenteditable]': 'onEditableContentChange',
			},

			initialize() {},

			onEditableContentChange( e ) {
				const $el = $( e.target );
				const attr = $el.data( 'bind' );
				let value = $el.text();

				if ( 'all_amounts' === attr ) {
					value = this.getAllAmounts();
				}

				window.parent.handlePreviewUpdate( attr, value );
			},

			getAllAmounts() {
				const amounts = $( '[data-bind="all_amounts"]', this.$el );

				if ( ! amounts.length ) {
					return;
				}

				const validatedValue = [];

				amounts.each( ( i, el ) => {
					const $el = $( el );
					let price = $el.text().trim();

					if ( 'custom' === price ) {
						return true;
					}

					const obj = {};

					if ( 0.0 < parseFloat( price ) ) {
						price = price * 100;
						obj.price = price;
					}

					obj.revenue = 199 < price ? 'sis' : 'ppu';
					obj.is_selected = 0 === i;

					validatedValue.push( obj );
				} );

				return JSON.stringify( validatedValue );
			},
		} );

		new ContributionView();
	} );
} )( jQuery );
