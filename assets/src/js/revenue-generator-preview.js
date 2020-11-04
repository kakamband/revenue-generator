/* globals jQuery, Backbone, ResizeObserver */
( ( $ ) => {
	$( function() {
		const ContributionView = Backbone.View.extend( {
			el: '.rev-gen-contribution',

			events: {
				'keyup [contenteditable]': 'onEditableContentChange',
			},

			initialize() {
				this.bindEvents();
			},

			onEditableContentChange( e ) {
				e.stopPropagation();

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

			bindEvents() {
				const observer = new ResizeObserver( ( els ) => {
					els.forEach( ( el ) => {
						const breakpoints = el.target.dataset.breakpoints
							? JSON.parse( el.target.dataset.breakpoints )
							: '';

						if ( ! breakpoints ) {
							return;
						}

						Object.keys( breakpoints ).forEach( ( breakpoint ) => {
							const minWidth = breakpoints[ breakpoint ];
							const className = 'size-' + breakpoint;

							if ( el.contentRect.width >= minWidth ) {
								el.target.classList.add( className );
							} else {
								el.target.classList.remove( className );
							}
						} );
					} );
				} );

				observer.observe( this.$el[ 0 ] );
			},
		} );

		new ContributionView();
	} );
} )( jQuery );
