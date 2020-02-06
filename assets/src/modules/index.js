/**
 * External dependencies
 */
import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import Layout from './layout';

domReady( function() {
	const mainApp = document.getElementById( 'lp_rev_gen_root' );
	if ( mainApp ) {
		render( <Layout />, mainApp );
	}
} );

