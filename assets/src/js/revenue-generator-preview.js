/* globals jQuery, Backbone, Shepherd, ResizeObserver, Event, _ */
import { shepherdSettings } from './utils/shepherd-settings';

( ( $, _ ) => {
	$( function() {
		const ContributionView = Backbone.View.extend( {
			el: '.rev-gen-contribution',

			events: {
				'keyup [contenteditable]': 'onEditableContentChange',
			},

			initialize() {
				const self = this;

				this.bindEvents();

				$( window ).load( function() {
					self.initializeTour();
				} );
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

			initializeTour() {
				this.tour = this.createTour();
				this.addTourSteps();
				this.tour.start();

				window.addEventListener( 'tour-complete', function() {
					const event = new Event( 'tour-start' );
					window.parent.dispatchEvent( event );
				} );
			},

			addTourSteps() {
				const self = this;

				const buttons = shepherdSettings.buttons;

				_( buttons ).each( function( button, key ) {
					buttons[ key ].action = self.tour[ button.action ];
				} );

				_( shepherdSettings.contribution.steps.preview ).each( function(
					step
				) {
					const props = step.shepherdProps;
					const buttonsProp = [];

					props.buttons.forEach( ( item ) => {
						buttonsProp.push( buttons[ item ] );
					} );

					props.buttons = buttonsProp;

					self.tour.addStep( props );
				} );
			},

			createTour() {
				const tour = new Shepherd.Tour( {
					defaultStepOptions: {
						classes: 'rev-gen-tutorial-card',
						scrollTo: { behavior: 'smooth', block: 'center' },
					},
				} );

				return tour;
			},
		} );

		new ContributionView();
	} );
} )( jQuery, _ );
