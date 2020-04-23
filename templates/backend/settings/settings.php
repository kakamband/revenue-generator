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
				<table class="form-table">
					<tr>
						<td>
							<?php esc_html_e( 'Analytics', 'revenue-generator' ); ?>
						</td>
						<td>
						</td>
						<td>
							<?php esc_html_e( 'Google Analytics “UA-ID”', 'revenue-generator' ); ?>
						</td>
					</tr>
					<tr>
						<td>
							<?php esc_html_e( 'Google Analytics', 'revenue-generator' ); ?>
						</td>
						<td>
							<label for="rgGAUserStatus">
								<input id="rgGAUserStatus" type="checkbox" value="1" <?php checked( $settings_options['rg_ga_personal_enabled_status'], '1', true ); ?> class="rev-gen-settings-main-ga-user-status rg-settings-ga-status" value="1" />
							<?php esc_html_e( 'Enabled', 'revenue-generator' ); ?>
							</label>
						</td>
						<td>
							<input type="text" class="rev-gen-settings-main-ga-code-user" autocomplete="off" value="<?php echo esc_attr( $settings_options['rg_personal_ga_ua_id'] ); ?>" />
						</td>
					</tr>
					<tr>
						<td>
							<?php esc_html_e( 'LaterPay Google Analytics', 'revenue-generator' ); ?>
						</td>
						<td>
							<label for="rgGALaterPayStatus">
								<input id="rgGALaterPayStatus" type="checkbox" value="1" <?php checked( $settings_options['rg_ga_enabled_status'], '1', true ); ?> class="rev-gen-settings-main-ga-laterpay-status rg-settings-ga-status" value="1" />
							<?php esc_html_e( 'Enabled', 'revenue-generator' ); ?>
							</label>
						</td>
						<td>
							<input type="text" readonly="readonly" class="rev-gen-settings-main-ga-code-laterpay" autocomplete="off" value="<?php echo esc_attr( $settings_options['rg_laterpay_ga_ua_id'] ); ?>" />
						</td>
					</tr>
				</table>

			</div>
		</div>
		<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
	</div>
</div>	
<?php View::render_footer_backend(); ?>
