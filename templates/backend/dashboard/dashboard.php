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
		<div class="rev-gen-dashboard-content">
			<?php if ( ! empty( $paywalls ) ) :
				foreach ( $paywalls as $paywall ) {
					$paywall_id        = $paywall['id'];
					$paywall_title     = $paywall['name'];
					$paywall_updated   = $paywall['updated'];
					$paywall_published = $paywall['published_on'];
					?>
					<div class="rev-gen-dashboard-content-paywall">
						<div class="rev-gen-dashboard-content-paywall-preview" data-paywall-id="<?php echo esc_attr( $paywall_id ); ?>">
						</div>
						<div class="rev-gen-dashboard-content-paywall-info">
							<b><?php echo esc_html( $paywall_title ); ?></b>
							<p><?php echo esc_html( $paywall_updated ); ?></p>
							<?php echo wp_kses_post( $paywall_published ); ?>
						</div>
					</div>
				<?php } else: ?>
				<p><?php esc_html_e( 'No paywall exists!', 'revenue-generator' ); ?></p>
			<?php endif; ?>
		</div>
	</div>
	<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
</div>
<?php View::render_footer_backend(); ?>
