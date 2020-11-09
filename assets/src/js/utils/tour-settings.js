import { __, sprintf } from '@wordpress/i18n';

export const tourSettings = {
	contribution: {
		steps: {
			preview: {
				type: {
					id: 'rg-tutorial-contribution-box',
					text:
						__(
							'This is a preview of your selected Contribution type.',
							'revenue-generator'
						) +
						'<br><br>' +
						__( 'Click on text to edit it.', 'revenue-generator' ),
					attachTo: {
						element: '.rev-gen-contribution__inner',
						on: 'bottom',
					},
					buttons: [ 'skip', 'next' ],
					classes: 'fade-in',
					tracking: {
						category: 'LP RevGen Contributions Tutorial',
						event: '1 - Text Edit',
						action: 'Continue',
					},
				},
				amount: {
					id: 'rg-tutorial-contribution-amount',
					text:
						__(
							'Click to edit each amount.',
							'revenue-generator'
						) +
						'<br><br>' +
						sprintf(
							/* translators: %1$s laterpay.net link tag, %2$s laterpay.net link closing tag */
							__(
								'Amounts less than $5 will default to %1$spay later%2$s.',
								'revenue-generator'
							),
							'<a target="_blank" href="https://www.laterpay.net/academy/getting-started-with-laterpay-the-difference-between-pay-now-pay-later">',
							'</a>'
						),
					attachTo: {
						element: '.rev-gen-contribution__donation',
						on: 'top',
					},
					buttons: [ 'skip', 'next' ],
					classes: 'fade-in',
					tracking: {
						category: 'LP RevGen Contributions Tutorial',
						event: '2 - Amount Edit',
						action: 'Continue',
					},
				},
			},
			builder: {
				name: {
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
					classes: 'fade-in',
					tracking: {
						category: 'LP RevGen Contributions Tutorial',
						event: '3 - Campaign Name',
						action: 'Continue',
					},
				},
				submit: {
					id: 'rg-tutorial-submit',
					text: sprintf(
						/* translators: %1$s wordpress.com documentation link opening tag, %2$s link closing tag */
						__(
							'When you’re ready, click here to copy your customized %1$sshortcode%2$s.',
							'revenue-generator'
						),
						'<a target="_blank" href="https://wordpress.com/support/shortcodes/">',
						'</a>'
					),
					attachTo: {
						element: '#rg-contribution-submit',
						on: 'top',
					},
					buttons: [ 'skip', 'gotIt' ],
					classes: 'fade-in',
					tracking: {
						category: 'LP RevGen Contributions Tutorial',
						event: '4 - Generate Code',
						action: 'Complete',
					},
				},
			},
		},
	},
	buttons: {
		skip: {
			text: __( 'Skip Tour', 'revenue-generator' ),
			action: 'cancel',
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
