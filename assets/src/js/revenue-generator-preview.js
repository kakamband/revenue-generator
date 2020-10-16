/* globals jQuery, Backbone */
( ( $ ) => {
	$( function() {
		const ContributionView = Backbone.View.extend( {
			el: '.rev-gen-contribution',

			events: {
				'keyup [contenteditable]': 'onEditableContentChange',
			},

			initialize() {},

			onEditableContentChange( e ) {
				const $el = $( e.target );
				const attr = $el.data( 'bind' );
				let value = $el.text();

				if ( 'amounts' === attr ) {
					value = this.getAllAmounts();
				}

				window.parent.handlePreviewUpdate( attr, value );
			},

			getAllAmounts() {
				const amounts = $( '[data-bind="amounts"]', this.$el );

				if ( ! amounts.length ) {
					return;
				}

				const validatedValue = [];

				amounts.each( ( i, el ) => {
					const $el = $( el );
					const price = $el.text().trim();

					validatedValue.push( price );
				} );

				return validatedValue;
			},
		} );

		new ContributionView();
	} );
} )( jQuery );
