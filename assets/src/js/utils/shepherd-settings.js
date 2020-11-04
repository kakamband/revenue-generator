/* global Event */
import { __ } from '@wordpress/i18n';

export const shepherdSettings = {
	contribution: {
		steps: {
			preview: {
				type: {
					shepherdProps: {
						id: 'rg-tutorial-contribution-box',
						text:
							__(
								'This is a preview of your selected Contribution type.',
								'revenue-generator'
							) +
							'<br><br>' +
							__(
								'Click on text to edit it.',
								'revenue-generator'
							),
						attachTo: {
							element: '.rev-gen-contribution__inner',
							on: 'bottom',
						},
						buttons: [ 'skip', 'next' ],
					},
				},
				amount: {
					shepherdProps: {
						id: 'rg-tutorial-contribution-amount',
						text:
							__(
								'Click to edit each amount.',
								'revenue-generator'
							) +
							'<br><br>' +
							__(
								'Amounts less than $5 will default to pay later.',
								'revenue-generator'
							),
						attachTo: {
							element: '.rev-gen-contribution__donation',
							on: 'top',
						},
						buttons: [ 'skip', 'next' ],
						when: {
							destroy() {
								const event = new Event( 'tour-complete' );
								window.dispatchEvent( event );
							},
						},
					},
				},
			},
			builder: {
				name: {
					context: 'builder',
					shepherdProps: {
						id: 'rg-tutorial-campaign-name',
						text: __(
							'Enter the description that you would like to appear on your customer’s invoice.',
							'revenue-generator'
						),
						attachTo: {
							element: '#rg-contribution-campaign-name',
							on: 'top',
						},
						buttons: [ 'skip', 'next' ],
					},
				},
				submit: {
					context: 'builder',
					shepherdProps: {
						id: 'rg-tutorial-submit',
						text: __(
							'When you’re ready, click here to copy your customized shortcode.',
							'revenue-generator'
						),
						attachTo: {
							element: '#rg-contribution-submit',
							on: 'top',
						},
						buttons: [ 'skip', 'gotIt' ],
					},
				},
			},
		},
	},
	buttons: {
		skip: {
			text: __( 'Skip Tour', 'revenue-generator' ),
			action: 'complete',
			classes: 'shepherd-content-skip-tour',
		},
		next: {
			text: __( 'Next', 'revenue-generator' ),
			action: 'next',
			classes: 'shepherd-content-next-tour-element',
		},
		gotIt: {
			text: __( 'Got it!', 'revenue-generator' ),
			action: 'next',
			classes: 'shepherd-content-next-tour-element',
		},
	},
};
