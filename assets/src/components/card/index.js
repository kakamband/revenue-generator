/**
 * External dependencies
 */
import { Component } from '@wordpress/element';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Card Component.
 */
class Card extends Component {
	render() {
		const { cardTitle, cardIcon, handleClick } = this.props;
		return (
			<div className="rg-card" onClick={ handleClick }>
				{ cardIcon }
				<h5 className="rg-card--title">{ cardTitle }</h5>
			</div>
		);
	}
}

Card.propTypes = {
	className: PropTypes.string,
	cardTitle: PropTypes.string,
	handleClick: PropTypes.func,
	cardIcon: PropTypes.object,
};

export default Card;
