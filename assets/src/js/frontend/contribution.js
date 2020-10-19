/* global rgVars */
export default class RevGenContribution {
	constructor( el ) {
		this.el = el;
		this.$o = {
			donateBox: el.querySelector( '.rev-gen-contribution__donate' ),
			customBox: {
				el: el.querySelector( '.rev-gen-contribution__custom' ),
				input: el.querySelector( '.rev-gen-contribution-custom input' ),
				backButton: el.querySelector(
					'.rev-gen-contribution-custom__back'
				),
				send: el.querySelector( '.rev-gen-contribution-custom__send' ),
			},
			amounts: el.getElementsByClassName(
				'rev-gen-contribution__donation'
			),
			customAmount: el.querySelector(
				'.rev-gen-contribution__donation--custom'
			),
			tip: el.querySelector( '.rev-gen-contribution__tip' ),
		};

		this.bindEvents();
	}

	bindEvents() {
		for ( const amount of this.$o.amounts ) {
			const link = amount.querySelector( 'a' );

			link.addEventListener( 'mouseover', () => {
				const type = amount.dataset.revenue;

				if ( 'ppu' === type ) {
					this.$o.tip.classList.remove( 'rev-gen-hidden' );
				} else {
					this.$o.tip.classList.add( 'rev-gen-hidden' );
				}
			} );

			link.addEventListener( 'mouseout', () => {
				this.$o.tip.classList.add( 'rev-gen-hidden' );
			} );
		}

		this.$o.customAmount.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			this.$o.donateBox.classList.add( 'rev-gen-hidden' );
			this.$o.customBox.el.classList.remove( 'rev-gen-hidden' );
			this.$o.customBox.el.removeAttribute( 'hidden' );
			this.$o.customBox.input.focus();
		} );

		this.$o.customBox.backButton.addEventListener( 'click', () => {
			this.$o.customBox.el.classList.add( 'rev-gen-hidden' );
			this.$o.customBox.el.setAttribute( 'hidden', '' );
			this.$o.donateBox.classList.remove( 'rev-gen-hidden' );
		} );

		this.$o.customBox.input.addEventListener( 'change', () => {
			this.validateAmount();

			if ( 199 >= this.getCustomAmount( true ) ) {
				this.$o.tip.classList.remove( 'rev-gen-hidden' );
			} else {
				this.$o.tip.classList.add( 'rev-gen-hidden' );
			}
		} );

		this.$o.customBox.input.addEventListener( 'keyup', () => {
			if ( 199 >= this.getCustomAmount( true ) ) {
				this.$o.tip.classList.remove( 'rev-gen-hidden' );
			} else {
				this.$o.tip.classList.add( 'rev-gen-hidden' );
			}
		} );

		this.$o.customBox.send.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			this.validateAmount();

			const url = this.getCustomAmountURL();
			window.open( url );
		} );
	}

	validateAmount() {
		let amount = this.$o.customBox.input.value;

		amount = amount.toString().replace( /[^0-9\,\.]/g, '' );

		// convert price to proper float value
		if ( typeof amount === 'string' && amount.indexOf( ',' ) > -1 ) {
			amount = parseFloat( amount.replace( ',', '.' ) ).toFixed( 2 );
		} else {
			amount = parseFloat( amount ).toFixed( 2 );
		}

		// prevent non-number prices
		if ( isNaN( amount ) ) {
			amount = 0.05;
		}

		// prevent negative prices
		amount = Math.abs( amount );

		// correct prices outside the allowed range of 0.05 - 1000.00
		if ( amount > 1000.0 ) {
			amount = 1000.0;
		} else if ( amount < 0.05 ) {
			amount = 0.05;
		}

		// format price with two digits
		amount = amount.toFixed( 2 );

		this.$o.customBox.input.value = amount;

		return amount;
	}

	getCustomAmount( giveMeInt ) {
		let amount = this.$o.customBox.input.value;

		if ( giveMeInt ) {
			amount = amount * 100;
		}

		return amount;
	}

	getCustomAmountURL() {
		let url = '';
		const amount = this.getCustomAmount( true );

		if ( 199 < amount ) {
			url =
				this.$o.customBox.el.dataset.sisUrl +
				'&custom_pricing=' +
				rgVars.default_currency +
				amount;
		} else {
			url =
				this.$o.customBox.el.dataset.ppuUrl +
				'&custom_pricing=' +
				rgVars.default_currency +
				amount;
		}

		return url;
	}
}

document.addEventListener( 'DOMContentLoaded', () => {
	const contributions = document.getElementsByClassName(
		'rev-gen-contribution'
	);

	for ( const item of contributions ) {
		new RevGenContribution( item );
	}
} );
