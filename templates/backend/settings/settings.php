<?php
/**
 * Revenue Generator admin settings screen.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\View;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file.
	exit;
}
?>
<div class="wrap">
	<div class="rev-gen-layout-wrapper">
		<div class="laterpay-loader-wrapper">
			<img alt="<?php esc_attr_e( 'LaterPay Logo', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['lp_icon'] ); ?>" />
		</div>
		<div class="rev-gen-settings-main">
			<h3 class="rev-gen-settings-main--header"><?php esc_html_e( 'Settings', 'revenue-generator' ); ?></h3>
			<div class="rev-gen-settings-main--publish-settings">
				<table class="form-table">
					<tr>
						<th>
							<?php esc_html_e( 'Posts per month', 'revenue-generator' ); ?>
						</th>
						<td>
							<label>
								<input type="radio" class="rev-gen-settings-main-post-per-month" <?php checked( $global_options['average_post_publish_count'], 'low', true ); ?> name="rg_global_options[average_post_publish_count]" value="low" />
								<?php esc_html_e( 'Fewer than 10', 'revenue-generator' ); ?>
							</label>
							<label>
								<input type="radio" class="rev-gen-settings-main-post-per-month" <?php checked( $global_options['average_post_publish_count'], 'high', true ); ?> name="rg_global_options[average_post_publish_count]" value="high" />
								<?php esc_html_e( 'More than 10', 'revenue-generator' ); ?>
							</label>
						</td>
					</tr>
					<tr>
						<th>
							<?php esc_html_e( 'Merchant ID', 'revenue-generator' ); ?>
						</th>
						<td>
							<input type="text" autocomplete="off" name="lp_rg_merchant_credentials[merchant_id]" class="rev-gen-settings-main-merchant-id" value="<?php echo esc_attr( $merchant_credentials['merchant_id'] ); ?>" size="50" />
						</td>
					</tr>
					<tr>
						<th>
							<?php esc_html_e( 'API Key', 'revenue-generator' ); ?>
						</th>
						<td>
							<input type="text" autocomplete="off" name="lp_rg_merchant_credentials['merchant_key']" class="rev-gen-settings-main-merchant-key" value="<?php echo esc_attr( $merchant_credentials['merchant_key'] ); ?>" size="50" />
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
	</div>
</div>	
<?php View::render_footer_backend(); ?>
