/**
 * Basic class for modals in Revenue Generator with callbacks for confirm and cancel actions.
 *
 * Usage:
 *
 * When creating a new instance, the constructor expects `options` object to be passed.
 *
 * - At the very minimum, this object should have a non-empty value for `id` key which is ID of the template
 * to be parsed by `wp.template` to generate final markup. See https://codex.wordpress.org/Javascript_Reference/wp.template
 * for details.
 *
 * - If needed, you can supply `onConfirm` and `onCancel` callbacks in `options` object to execute custom
 * code when modal is confirmed or cancelled.
 *
 * - `autoShow` parameter adds modal to DOM immediately and opens it when instance is created. When set to
 *   false, you can call `instance.show()` to manually show modal at a later time.
 *
 * Example minimal usage:
 *
 * ```
 * let modal = new RevGenModal( {
 *   id: 'my-template-id'
 * } );
 * ```
 */
class RevGenModal {
	/**
	 * Constructor
	 *
	 * @param {Object} options - Additional options.
	 */
	constructor( options ) {
		/** @type {Object} */
		const defaultOptions = {
			id: '',
			onConfirm: () => {
				// noop
			},
			onCancel: () => {
				// noop
			},
			autoShow: true,
		};

		/** @type {Object} */
		this.options = {
			...defaultOptions,
			...options,
		};

		// Call init method to set up modal.
		this.init();
	}

	/**
	 * Init method.
	 */
	init() {
		// Open modal if autoShow param is `true`.
		if ( this.options.autoShow ) {
			this.show();
		}
	}

	/**
	 * Parses modal template through globally accessible `wp.template` and appends
	 * it to `<body>`. Stores reference to the appended modal into `this.el`.
	 *
	 * Calls `bindEvents` method to bind events on modal action buttons.
	 */
	show() {
		if ( ! this.options.id ) {
			return;
		}

		const body = document.querySelector( 'body' );
		const template = wp.template( this.options.id );

		// Insert modal to the end of <body>.
		body.insertAdjacentHTML( 'beforeend', template() );

		// Store reference to the modal.
		this.el = document.getElementById( this.options.id );

		this.bindEvents();
	}

	/**
	 * Removes modal from DOM.
	 */
	hide() {
		document.querySelector( '.rev-gen-modal-overlay' ).remove();
		this.el.remove();
	}

	/**
	 * Binds events on modal's action buttons.
	 */
	bindEvents() {
		this.el
			.querySelector( '#rg_js_modal_confirm' )
			.addEventListener( 'click', this.onConfirm.bind( this ) );
		this.el
			.querySelector( '#rg_js_modal_cancel' )
			.addEventListener( 'click', this.onCancel.bind( this ) );
	}

	/**
	 * Callback when `confirm` button is clicked.
	 *
	 * - Calls `onConfirm` callback function as defined in options passed to the instance.
	 * - Closes modal.
	 */
	onConfirm() {
		this.options.onConfirm();

		this.hide();
	}

	/**
	 * Callback when `cancel` button is clicked.
	 *
	 * - Calls `onCancel` callback function as defined in options passed to the instance.
	 * - Closes modal.
	 */
	onCancel() {
		this.options.onCancel();

		this.hide();
	}
}

export { RevGenModal };
