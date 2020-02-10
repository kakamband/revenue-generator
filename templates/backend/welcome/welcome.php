<?php
/**
 * Revenue Generator admin welcome screen.
 *
 * @package revenue-generator
 */

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file
	exit;
}
?>

<div class="rev-gen-layout_wrapper">
	<div class="welcome-screen-wrapper">
		<div class="welcome-screen">
			<h1 class="welcome-screen--heading"><?php esc_html_e( 'Welcome to Revenue Generator', 'revenue-generator' ); ?></h1>
			<p class="welcome-screen--sub-heading"><?php esc_html_e( 'Selling single articles, time passes, and subscriptions have never been easier.', 'revenue-generator' ); ?></p>
			<p class="welcome-screen__description"><?php esc_html_e( 'Your readers and viewers already love your content - LaterPay\'s revenue generator makes it easy for them to support you. Sell individual pieces of content, timed access to your site, or recurring subscriptions - at any price point.Instead of requiring upfront registration and payment, we defer this process until customer purchases combined reach a $5 threshold. Earn money from all of your users, not just subscribers.', 'revenue-generator' ); ?></p>
		</div>
		<div class="welcome-screen-question">
			<h4 class="welcome-screen-question--sub-heading"><?php esc_html_e( 'Want to see how LaterPay would work on your own site?', 'revenue-generator' ); ?></h4>
			<p class="welcome-screen-question--description"><?php esc_html_e( 'Below, you can take a tour of the features we offer and see a step-by-step demonstration of how to set up your own flexible paywall.', 'revenue-generator' ); ?></p>
		</div>
		<div class="welcome-screen-publish-questionnaire">
			<p class="welcome-screen-publish-questionnaire--heading"><?php esc_html_e( 'How often do you publish premium content?', 'revenue-generator' ); ?></p>
		</div>
		<div class="welcome-screen-wrapper--card">
			<div id="rg_js_lowPostCard" class="rg-card">
				<img class="rg-card--icon" alt="<?php esc_attr_e( 'Fewer posts icon' ); ?>" src="<?php echo esc_url( $low_count_icon ); ?>">
				<h5 class="rg-card--title"><?php esc_html_e( 'Fewer than 10 posts per month', 'revenue-generator' ); ?></h5>
			</div>
			<div id="rg_js_highPostCard" class="rg-card">
				<img class="rg-card--icon" alt="<?php esc_attr_e( 'More posts icon' ); ?>" src="<?php echo esc_url( $high_count_icon ); ?>">
				<h5 class="rg-card--title"><?php esc_html_e( 'More than 10 posts per month', 'revenue-generator' ); ?></h5>
			</div>
		</div>
	</div>
	<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
</div>
