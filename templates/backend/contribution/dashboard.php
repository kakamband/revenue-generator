<?php
/**
 * Revenue Generator Contribution dashboard screen.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\Post_Types\Contribution;
use LaterPay\Revenue_Generator\Inc\View;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file.
	exit;
}
?>

<div class="rev-gen-layout-wrapper">
	<div class="laterpay-loader-wrapper">
		<img alt="<?php esc_attr_e( 'LaterPay Logo', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['lp_icon'] ); ?>" />
	</div>
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
				<input placeholder="<?php esc_attr_e( 'Search Contribution', 'revenue-generator' ); ?>" type="text" id="rg_js_searchPaywall" value="<?php echo esc_attr( $search_term ); ?>">
				<i class="rev-gen-dashboard-bar--search-icon"></i>
			</div>
			<div class="rev-gen-dashboard-bar--item rev-gen-dashboard-bar--actions">
				<a href="<?php echo esc_url( $new_contribution_url ); ?>" id="rg_js_newPaywall" class="rg-button"><?php esc_html_e( 'New Contribution', 'revenue-generator' ); ?></a>
			</div>
		</div>
		<div class="rev-gen-dashboard-content rev-gen-dashboard-content-contribution-wrapper">
			<?php
			if ( ! empty( $contributions ) ) :
				foreach ( $contributions as $contribution ) {
					$contribution_id      = $contribution['id'];
					$contribution_title   = $contribution['name'];
					$contribution_updated = $contribution['updated'];

					?>
					<div class="rev-gen-dashboard-content-contribution" data-contribution-id="<?php echo esc_attr( $contribution_id ); ?>">
						<div class="rev-gen-dashboard-content-contribution--box">
							<h4 class="rev-gen-dashboard-content-contribution--box-header">
								<?php echo esc_html( $contribution['dialog_header'] ); ?>
							</h4>
							<p class="rev-gen-dashboard-content-contribution--box-description">
								<?php echo esc_html( $contribution['description'] ); ?>
							</p>
							<div class="rev-gen-dashboard-content-contribution--box-donation-wrapper">
								<?php
								if ( ! empty( $contribution['all_amounts'] ) ) {
									foreach ( $contribution['all_amounts'] as $key => $amount ) {
										?>
									<div class="rev-gen-dashboard-content-contribution--box-donation">
										<span class="rev-gen-dashboard-content-contribution--box-donation-currency">
											<?php esc_html_e( '$', 'revenue-generator' ); ?>
										</span>
										<span class="rev-gen-dashboard-content-contribution--box-donation-amount">
											<?php echo esc_html( View::format_number( $amount, 2 ) ); ?>
										</span>
									</div>
										<?php
									}
								}
								?>
								<div class="rev-gen-dashboard-content-contribution--box-donation">
									<span class="rev-gen-dashboard-content-contribution--box-donation-currency">
										<?php esc_html_e( '$', 'revenue-generator' ); ?>
									</span>
									<span class="rev-gen-dashboard-content-contribution--box-donation-amount">
										<?php esc_html_e( 'custom', 'revenue-generator' ); ?>
									</span>
								</div>
							</div>
						</div>
						<div class="rev-gen-dashboard-content-contribution--info">
							<h3 class="rev-gen-dashboard-content-contribution--info-title">
								<?php echo esc_html( $contribution_title ); ?>
							</h3>
							<div class="rev-gen-dashboard-content-contribution--info-url">
								<?php echo esc_html( $contribution['thank_you'] ); ?>
							</div>
							<div class="rev-gen-dashboard-content-contribution--info-updated">
								<?php echo esc_html( $contribution_updated ); ?>
							</div>
							<input type="hidden" value="<?php echo esc_attr( $contribution['code'] ); ?>" class="rev-gen-dashboard-content-contribution-code" />
						</div>
					</div>
			<?php } else : ?>
			<div class="rev-gen-dashboard-content-nopaywall">
				<div class="rev-gen-dashboard-content-nopaywall--title">
					<?php
					$empty_contribution_button_text = ( ! empty( $search_term ) ) ? __( 'Create a new Contribution', 'revenue-generator' ) : __( 'Create your first Paywall', 'revenue-generator' );
					$empty_contribution_message     = ( ! empty( $search_term ) ) ? __( 'No Contribution matched your search, <br /> try again or', 'revenue-generator' ) : __( 'It’s pretty empty here, <br /> let’s create your first Contribution.', 'revenue-generator' );

					printf(
						wp_kses(
							$empty_contribution_message,
							[
								'br' => [],
							]
						)
					);
					?>
				</div>
				<div class="rev-gen-dashboard-content-nopaywall--create-paywall">
					<a href="<?php echo esc_url( $new_contribution_url ); ?>" class="rev-gen-dashboard-content-nopaywall--create-paywall--button"><?php echo esc_html( $empty_contribution_button_text ); ?></a>
				</div>
			</div>	
			<?php endif; ?>	
		</div>
		<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
	</div>
</div>
<?php View::render_footer_backend(); ?>
