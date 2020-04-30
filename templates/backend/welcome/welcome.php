<?php
/**
 * Revenue Generator admin welcome screen.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\View;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file.
	exit;
}
?>

<div class="rev-gen-layout-wrapper">
	<div class="welcome-screen-wrapper">
		<div class="welcome-screen-wrapper--main">
			<div class="welcome-screen">
				<h1 class="welcome-screen--heading"><?php esc_html_e( 'Welcome to Revenue Generator', 'revenue-generator' ); ?></h1>
				<p class="welcome-screen--sub-heading"><?php esc_html_e( 'Requesting Contributions, Selling single articles, time passes, and subscriptions have never been easier.', 'revenue-generator' ); ?></p>
				<p class="welcome-screen__description"><?php esc_html_e( 'Your readers and viewers already love your content - LaterPay\'s revenue generator makes it easy for them to support you. Sell individual pieces of content, timed access to your site, or recurring subscriptions - at any price point. Instead of requiring upfront registration and payment, we defer this process until customer purchases combined reach a $5 threshold. Earn money from all of your users, not just subscribers.', 'revenue-generator' ); ?></p>
			</div>
			<div class="welcome-screen-publish-questionnaire">
				<p class="welcome-screen-publish-questionnaire--heading"><?php esc_html_e( 'Would you like to start with Creating Contributions or a Paywall?', 'revenue-generator' ); ?></p>
			</div>
			<div class="welcome-screen-wrapper--card">
				<div id="rg_Contribution" class="rg-card">
					<img class="rg-card--icon" alt="<?php esc_attr_e( 'Create contribution icon', 'revenue-generator' ); ?>" src="<?php echo esc_url( $welcome_contribution_icon ); ?>">
					<h5 class="rg-card--title"><?php esc_html_e( 'Create Contribution', 'revenue-generator' ); ?></h5>
				</div>
				<div id="rg_Paywall" class="rg-card">
					<img class="rg-card--icon" alt="<?php esc_attr_e( 'Create Paywall icon', 'revenue-generator' ); ?>" src="<?php echo esc_url( $welcome_paywall_icon ); ?>">
					<h5 class="rg-card--title"><?php esc_html_e( 'Create Paywall', 'revenue-generator' ); ?></h5>
				</div>
			</div>
		</div>
		<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
	</div>
</div>
<?php View::render_footer_backend(); ?>
