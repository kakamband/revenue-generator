/**
 * External dependencies.
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies.
 */
import './style.scss';
import { Card } from '../../components';
import { lowPublish, highPublish } from '../../components/card/icons';

/**
 * Welcome component.
 */
class Welcome extends Component {
	render() {
		// Get required information.
		const { isSetupDone, handleClick } = this.props;
		return (
			// Show welcome screen if initial post count setup is not done.
			! isSetupDone && (
				<div className="welcome-screen-wrapper">
					<div className="welcome-screen">
						<h1 className="welcome-screen--heading">
							{ __(
								'Welcome to Revenue Generator',
								'revenue-generator'
							) }
						</h1>
						<p className="welcome-screen--sub-heading">
							{ __(
								'Selling single articles, time passes, and subscriptions have never been easier.',
								'revenue-generator'
							) }
						</p>
						<p className="welcome-screen__description">
							{ __(
								"Your readers and viewers already love your content - LaterPay's revenue generator makes it easy for them to support you. Sell individual pieces of content, timed access to your site, or recurring subscriptions - at any price point.",
								'revenue-generator'
							) }
							{ __(
								'Instead of requiring upfront registration and payment, we defer this process until customer purchases combined reach a $5 threshold. Earn money from all of your users, not just subscribers.',
								'revenue-generator'
							) }
						</p>
					</div>
					<div className="welcome-screen-question">
						<h4 className="welcome-screen-question--sub-heading">
							{ __(
								'Want to see how LaterPay would work on your own site?',
								'revenue-generator'
							) }
						</h4>
						<p className="welcome-screen-question--description">
							{ __(
								'Below, you can take a tour of the features we offer and see a step-by-step demonstration of how to set up your own flexible paywall.',
								'revenue-generator'
							) }
						</p>
					</div>
					<div className="welcome-screen-publish-questionnaire">
						<p className="welcome-screen-publish-questionnaire--heading">
							{ __(
								'How often do you publish premium content?',
								'revenue-generator'
							) }
						</p>
					</div>
					<div className="welcome-screen-wrapper--card">
						<Card
							handleClick={ () => handleClick( 'low' ) }
							cardIcon={ lowPublish }
							cardTitle={ __(
								'Fewer than 10 posts per month',
								'revenue-generator'
							) }
						/>
						<Card
							handleClick={ () => handleClick( 'high' ) }
							cardIcon={ highPublish }
							cardTitle={ __(
								'More than 10 posts per month',
								'revenue-generator'
							) }
						/>
					</div>
				</div>
			)
		);
	}
}

Welcome.propTypes = {
	className: PropTypes.string,
	isSetupDone: PropTypes.bool,
};

Welcome.defaultProps = {
	isSetupDone: false,
};

export default compose( [
	withSelect( ( select ) => {
		return {
			isSetupDone: select(
				'laterpay-revenue-generator'
			).getGlobalOptionValue( 'average_post_publish_count' ).length
				? true
				: false,
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			handleClick: ( postPublishRate ) => {
				dispatch( 'laterpay-revenue-generator' ).setConfig(
					'average_post_publish_count',
					postPublishRate
				);
			},
		};
	} ),
] )( Welcome );
