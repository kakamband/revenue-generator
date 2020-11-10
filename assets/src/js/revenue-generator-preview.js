/* globals Backbone, ResizeObserver, Event */
import { RevGenTour, tourSettings } from './utils/tour';

const options = window.parent.revenueGeneratorGlobalOptions;

const ContributionView = Backbone.View.extend( {
	el: '.rev-gen-contribution',

	events: {
		'keyup [contenteditable]': 'onEditableContentChange',
	},

	initialize() {
		const self = this;

		this.bindEvents();

		if (
			0 ===
			parseInt( options.globalOptions.is_contribution_tutorial_completed )
		) {
			window.addEventListener( 'load', () => {
				self.initializeTour();
			} );
		}
	},

	onEditableContentChange( e ) {
		e.stopPropagation();

		const el = e.target;
		const attr = el.dataset.bind;
		let value = el.innerText;

		if ( 'amounts' === attr ) {
			value = this.getAllAmounts();
		}

		window.parent.handlePreviewUpdate( attr, value );
	},

	getAllAmounts() {
		const amounts = document.querySelectorAll( '[data-bind="amounts"]' );

		if ( ! amounts.length ) {
			return;
		}

		const validatedValue = [];

		amounts.forEach( ( el ) => {
			const price = el.innerText.trim();

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
		this.tour = new RevGenTour( {
			steps: tourSettings.contribution.steps.preview,
			onStart: () => {
				window.parent.updateTourProgress();
			},
			onStepHide: ( step ) => {
				if ( step.options.tracking ) {
					window.parent.trackTourStep( step );
				}

				window.parent.updateTourProgress();
			},
			onComplete: () => {
				const event = new Event( 'rg-tour-start' );
				window.parent.dispatchEvent( event );
			},
		} );
	},
} );

window.addEventListener( 'DOMContentLoaded', () => {
	new ContributionView();
} );
