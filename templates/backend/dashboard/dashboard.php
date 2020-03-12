<?php
/**
 * Revenue Generator admin dashboard screen.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\View;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file
	exit;
}
?>

<div class="rev-gen-layout-wrapper">
	<div class="rev-gen-dashboard-main">
		<div class="rev-gen-dashboard-bar">
			<div class="rev-gen-dashboard-bar--item rev-gen-dashboard-bar--filter">
				<label for="rg_js_filterPaywalls"><?php esc_html_e( 'Sort By', 'revenue-generator' ); ?></label>
				<select id="rg_js_filterPaywalls">
					<option value="asc"><?php esc_attr_e( 'Newest First' ); ?></option>
					<option value="desc"><?php esc_attr_e( 'Oldest First' ); ?></option>
				</select>
			</div>
			<div class="rev-gen-dashboard-bar--item rev-gen-dashboard-bar--search">
				<input placeholder="<?php esc_attr_e( 'Search Paywalls', 'revenue-generator' ); ?>" type="text" id="rg_js_searchPaywall">
				<i class="dashicons dashicons-search"></i>
			</div>
			<div class="rev-gen-dashboard-bar--item rev-gen-dashboard-bar--actions">
				<a href="<?php echo esc_url( $new_paywall_url ); ?>" id="rg_js_newPaywall" class="rg-button"><?php esc_html_e( 'New Paywall', 'revenue-generator' ); ?></a>
			</div>
		</div>
		<div class="reve-gen-dashboard-content">
			<p style="color: red;text-align: center;font-size: 25px;">Work in Progress...</p>
		</div>
	</div>
	<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
</div>
<?php View::render_footer_backend(); ?>
