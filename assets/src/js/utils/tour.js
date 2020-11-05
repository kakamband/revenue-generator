/* global Shepherd */
import { tourSettings } from './tour-settings';

class RevGenTour {
	constructor( options ) {
		const defaultOptions = {
			stepOptions: {
				classes: 'rev-gen-tutorial-card',
				scrollTo: { behavior: 'smooth', block: 'center' },
			},
			autoStart: true,
			context: '',
			steps: {},
			onStart: () => {},
			onProgress: () => {},
			onComplete: () => {},
		};

		this.options = {
			...defaultOptions,
			...options,
		};

		this.init();
	}

	init() {
		const self = this;

		this.tour = new Shepherd.Tour( {
			defaultStepOptions: self.options.stepOptions,
		} );

		this.addTourSteps();

		if ( this.options.autoStart ) {
			this.tour.start();
			this.options.onStart();
		}

		Shepherd.on( 'complete', () => {
			const currentStep = Shepherd.activeTour.getCurrentStep();

			self.options.onProgress( currentStep );
			self.options.onComplete();
		} );

		Shepherd.on( 'cancel', () => {
			const currentStep = Shepherd.activeTour.getCurrentStep();
			const trackingProps = currentStep.options.tracking;

			if ( 'Continue' === trackingProps.action ) {
				trackingProps.action = 'Exit Tour';
			}

			self.options.onProgress( currentStep );
		} );
	}

	addTourSteps() {
		const self = this;
		const steps = this.options.steps;
		const buttons = tourSettings.buttons;

		Object.keys( buttons ).forEach( function( key ) {
			const button = buttons[ key ];

			buttons[ key ].action = self.tour[ button.action ];
		} );

		Object.keys( steps ).forEach( function( key ) {
			const step = steps[ key ];
			const buttonsProp = [];

			step.buttons.forEach( ( item ) => {
				buttonsProp.push( buttons[ item ] );
			} );

			step.buttons = buttonsProp;

			const tourStep = self.tour
				.addStep( step )
				.on( 'before-hide', () => {
					const optionClasses = tourStep.options.classes;

					tourStep.options.classes = optionClasses.replace(
						'fade-in',
						'fade-out'
					);

					tourStep.updateStepOptions( tourStep.options );
				} )
				.on( 'hide', () => {
					if ( 'function' === typeof self.options.onProgress ) {
						self.options.onProgress( tourStep );
					}

					tourStep.el.removeAttribute( 'hidden' );

					setTimeout( () => {
						tourStep.el.setAttribute( 'hidden', '' );
					}, 700 );
				} );
		} );
	}
}

export { RevGenTour };
