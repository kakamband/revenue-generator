<?php
/**
 * Revenue Generator admin dashboard screen.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\Post_Types\Paywall;
use LaterPay\Revenue_Generator\Inc\View;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file.
	exit;
}
?>

<div class="rev-gen-layout-wrapper">
	<div class="rev-gen-dashboard-main">
		<div class="rev-gen-dashboard-bar">
			<div class="rev-gen-dashboard-bar--item rev-gen-dashboard-bar--filter">
				<label for="rg_js_filterPaywalls"><?php esc_html_e( 'Sort By', 'revenue-generator' ); ?></label>
				<select id="rg_js_filterPaywalls">
					<option <?php selected( strtolower( $current_sort_order ), 'desc', true ); ?> value="desc"><?php esc_attr_e( 'Newest First', 'revenue-generator' ); ?></option>
					<option <?php selected( strtolower( $current_sort_order ), 'asc', true ); ?> value="asc"><?php esc_attr_e( 'Oldest First', 'revenue-generator' ); ?></option>
					<option <?php selected( strtolower( $current_sort_order ), 'priority', true ); ?> value="priority"><?php esc_attr_e( 'Priority', 'revenue-generator' ); ?></option>
				</select>
			</div>
			<div class="rev-gen-dashboard-bar--item rev-gen-dashboard-bar--search">
				<input placeholder="<?php esc_attr_e( 'Search Paywalls', 'revenue-generator' ); ?>" type="text" id="rg_js_searchPaywall">
				<i class="dashicons dashicons-search"></i>
				<div class="rev-gen-dashboard-bar--search-results"></div>
			</div>
			<div class="rev-gen-dashboard-bar--item rev-gen-dashboard-bar--actions">
				<a href="<?php echo esc_url( $new_paywall_url ); ?>" id="rg_js_newPaywall" class="rg-button"><?php esc_html_e( 'New Paywall', 'revenue-generator' ); ?></a>
			</div>
		</div>
		<div class="rev-gen-dashboard-content">
			<?php
			if ( ! empty( $paywalls ) ) :
				foreach ( $paywalls as $paywall ) {
					$paywall_id        = $paywall['id'];
					$paywall_title     = $paywall['name'];
					$paywall_updated   = $paywall['updated'];
					$paywall_published = $paywall['published_on'];
					?>
					<div class="rev-gen-dashboard-content-paywall" data-paywall-id="<?php echo esc_attr( $paywall_id ); ?>">
						<?php Paywall::generate_paywall_mini_preview( $paywall_id ); ?>
						<div class="rev-gen-dashboard-content-paywall-info">
							<span contenteditable="true" class="rev-gen-dashboard-paywall-name"><?php echo esc_html( $paywall_title ); ?></span>
							<p><?php echo wp_kses_post( $paywall_published ); ?></p>
							<p class="rev-gen-dashboard-content-paywall-info-updated"><?php echo esc_html( $paywall_updated ); ?></p>
						</div>
					</div>
				<?php } else : ?>
				<div class="rev-gen-dashboard-content-nopaywall">
					<div class="rev-gen-dashboard-content-nopaywall--title">
						<?php
						printf(
							wp_kses(
								__( 'It’s pretty empty here, <br /> let’s create your first Paywall.', 'revenue-generator' ),
								[
									'br' => [],
								]
							)
						);
						?>
					</div>
					<div class="rev-gen-dashboard-content-nopaywall--create-paywall">
						<a href="<?php echo esc_url( $new_paywall_url ); ?>" class="rev-gen-dashboard-content-nopaywall--create-paywall--button"><?php esc_html_e( 'Create your first Paywall', 'revenue-generator' ); ?></a>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
	<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
	<div class="rev-gen-start-tutorial" id="rg_js_RestartTutorial"><?php esc_html_e( 'Tutorial', 'revenue-generator' ); ?></div>
</div>
<?php View::render_footer_backend(); ?>
