/**
 * External dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import Welcome from '../welcome';

const { revenueGenerator } = window;

// No preview image if preview doesn't exist.
const globalOptions = revenueGenerator.globalOptions;

class Layout extends Component {
	render() {
		const isSetupDone = !! globalOptions.average_post_publish_count.length;
		return <Welcome isSetupDone={ isSetupDone } />;
	}
}

export default Layout;
