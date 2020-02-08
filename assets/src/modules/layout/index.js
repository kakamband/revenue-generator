/**
 * External dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import Welcome from '../welcome';
import '../../store';

class Layout extends Component {
	render() {
		return <Welcome />;
	}
}

export default Layout;
