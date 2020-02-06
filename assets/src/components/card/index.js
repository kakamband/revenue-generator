/**
 * External dependencies
 */
import {Component} from '@wordpress/element';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Card Component.
 */
class Card extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { cardTitle, cardIcon } = this.props;
		return (
			<div className="rg-card">
				{ cardIcon }
				<h5 className="rg-card--title">{cardTitle}</h5>
			</div>
		);
	}
}

Card.propTypes = {
	className: PropTypes.string,
	cardTitle: PropTypes.string,
	cardIcon: PropTypes.object,
};

export default Card;
