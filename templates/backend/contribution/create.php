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
		<div class="rev-gen-contribution-main">
			<h2 class="rev-gen-contribution-main--header"><?php esc_html_e( 'Create your Contribution box', 'revenue-generator' ); ?></h2>
			<div class="rev-gen-contribution-main--box">
				<div id="rev-gen-contribution-main-header-section">
					<h3 class="rev-gen-contribution-main--box-header" contenteditable="true"><?php esc_html_e( 'Support the Author', 'revenue-generator' ); ?></h3>
					<p class="rev-gen-contribution-main--box-description" contenteditable="true"><?php esc_html_e( 'Pick your contribution below:' ); ?></p>
				</div>
				<div class="rev-gen-contribution-main--box-donation-wrapper">
					<div class="rev-gen-contribution-main--box-donation">
						<span class="rev-gen-contribution-main--box-donation-currency"><?php echo esc_html( $currency_symbol ); ?></span>
						<span class="rev-gen-contribution-main--box-donation-amount" contenteditable="true"><?php esc_html_e( '0.50', 'revenue-generator' ); ?></span>
					</div>
					<div class="rev-gen-contribution-main--box-donation">
						<span class="rev-gen-contribution-main--box-donation-currency"><?php echo esc_html( $currency_symbol ); ?></span>
						<span class="rev-gen-contribution-main--box-donation-amount" contenteditable="true"><?php esc_html_e( '1.00', 'revenue-generator' ); ?></span>
					</div>
					<div class="rev-gen-contribution-main--box-donation">
						<span class="rev-gen-contribution-main--box-donation-currency"><?php echo esc_html( $currency_symbol ); ?></span>
						<span class="rev-gen-contribution-main--box-donation-amount" contenteditable="true"><?php esc_html_e( '5.00', 'revenue-generator' ); ?></span>
					</div>
					<div class="rev-gen-contribution-main--box-donation">
						<span class="rev-gen-contribution-main--box-donation-currency"><?php echo esc_html( $currency_symbol ); ?></span>
						<span class="rev-gen-contribution-main--box-donation-amount"><?php esc_html_e( 'custom', 'revenue-generator' ); ?></span>
					</div>
				</div>
				<div class="rev-gen-contribution-main--box-footer-logo">
					<?php View::render_footer_backend(); ?>
				</div>
			</div>	
			<div class="rev-gen-contribution-main-inputs-wrapper">
				<label id="rg_contribution_campaign_name"  class="rev-gen-contribution-main-input-label">
					<?php esc_html_e( 'Campaign name', 'revenue-generator' ); ?>
					<input type="text" class="rev-gen-contribution-main-input" id="rg_contribution_title" />
					<button data-info-for="campaignName" id="rev-gen-contribution-help-campaign-name" class="rev-gen-settings-main-option-info rev-gen-contribution-main--help">
						<img src="<?php echo esc_url( $action_icons['option_info'] ); ?>">
					</button>
				</label>
				<label id="rg_contribution_thankyou_label" class="rev-gen-contribution-main-input-label">
					<?php esc_html_e( 'Thank you Page (optional)', 'revenue-generator' ); ?>
					<input type="text" class="rev-gen-contribution-main-input" id="rg_contribution_thankyou" />
					<button data-info-for="thankYouPage" id="rev-gen-contribution-help-thank-you" class="rev-gen-settings-main-option-info rev-gen-contribution-main--help">
						<img src="<?php echo esc_url( $action_icons['option_info'] ); ?>">
					</button>
				</label>
				<div id="rg_contribution_generate" class="rev-gen-contribution-main-button">
					<button class="rev-gen-contribution-main-generate-button">
						<?php esc_html_e( 'Generate and copy code', 'revenue-generator' ); ?>
					</button>
					<a target="_blank" href="https://wordpress.com/support/shortcodes/" id="rev-gen-contribution-help-generate" class="rev-gen-contribution-main--help-button">
						<img src="<?php echo esc_url( $action_icons['option_info'] ); ?>">
					</a>
				</div>	
				<p class="rev-gen-contribution-main-copy-message"><?php esc_html_e( 'To include the Contribution Box on your site, paste the code where you would like it to appear.', 'revenue-generator' ); ?></p>
			</div>
		</div>
		<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
		<div class="rev-gen-exit-tour"><?php esc_html_e( 'Exit Tour', 'revenue-generator' ); ?></div>
	</div>	
</div>
<?php View::render_footer_backend(); ?>
<!-- Template for Campaign Name modal -->
<script type="text/template" id="tmpl-revgen-info-campaignName">
	<div class="rev-gen-contribution-main-info-modal rev-gen-preview-main-info-modal campaign-name-info-modal">
	<span class="rev-gen-contribution-main-info-modal-cross"><img alt="<?php esc_attr_e( 'close', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['icon_close'] ); ?>" /></span>
		<h4 class="rev-gen-preview-main-info-modal-title rev-gen-settings-main-info-modal-title"><?php esc_html_e( 'Campaign Name', 'revenue-generator' ); ?></h4>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php esc_html_e( "Enter the name you would like to appear on your customers' invoice. We recommend including your organization's name as well as something to remind them of this specific contribution.", 'revenue-generator' ); ?>
		</p>
	</div>
</script>
<!-- Template for Thank you modal -->
<script type="text/template" id="tmpl-revgen-info-thankYouPage">
	<div class="rev-gen-contribution-main-info-modal rev-gen-preview-main-info-modal thankyoupage-info-modal">
	<span class="rev-gen-contribution-main-info-modal-cross"><img alt="<?php esc_attr_e( 'close', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['icon_close'] ); ?>" /></span>
		<h4 class="rev-gen-preview-main-info-modal-title rev-gen-settings-main-info-modal-title"><?php esc_html_e( 'Thank You Page', 'revenue-generator' ); ?></h4>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php esc_html_e( 'After your customer has contributed, we can redirect them to a page of your choice (for example, a dedicated "thank you" page on your website). If no thank you page is provided, they will be redirected to the page which initiated their contribution.', 'revenue-generator' ); ?>
		</p>
	</div>
</script>
<!-- Template for account activation modal. -->
<script type="text/template" id="tmpl-revgen-account-activation-modal">
	<div class="rev-gen-preview-main-account-modal">
		<span class="rev-gen-preview-main-account-modal-cross"><img alt="<?php esc_attr_e( 'close', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['icon_close'] ); ?>" /></span>
		<?php if ( false === $is_merchant_verified ) : ?>
			<div class="rev-gen-preview-main-account-modal-action">
				<h4 class="rev-gen-preview-main-account-modal-action-title"><?php esc_html_e( 'You’re almost done!', 'revenue-generator' ); ?></h4>
				<span class="rev-gen-preview-main-account-modal-action-info"><?php esc_html_e( 'To make sure you get your revenues, we need you to connect your LaterPay account.', 'revenue-generator' ); ?></span>
				<div class="rev-gen-preview-main-account-modal-actions">
					<button id="rg_js_connectAccount" class="rev-gen-preview-main-account-modal-actions-dark">
						<?php esc_html_e( 'Connect Account', 'revenue-generator' ); ?>
					</button>
					<button id="rg_js_signUp" class="rev-gen-preview-main-account-modal-actions-light">
						<?php esc_html_e( 'Signup', 'revenue-generator' ); ?>
					</button>
					<a href="https://support.laterpay.net/what-is-laterpay/" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Learn more', 'revenue-generator' ); ?></a>
				</div>
			</div>
			<div class="rev-gen-preview-main-account-modal-fields">
				<h5 class="rev-gen-preview-main-account-modal-fields-title"><?php esc_html_e( 'Connect your account to activate paywall', 'revenue-generator' ); ?></h5>
				<p class="rev-gen-preview-main-account-modal-credentials-info">
					<?php esc_html_e( 'Unsure where to find this information?', 'revenue-generator' ); ?>
					<a target="_blank" rel="noopener noreferrer" href="https://support.laterpay.net/what-is-my-laterpay-merchant-id-api-key-and-where-can-i-find-them">
						<?php esc_html_e( 'Click here.', 'revenue-generator' ); ?>
					</a>
				</p>
				<input class="rev-gen-preview-main-account-modal-fields-merchant-id" type="text" placeholder="<?php esc_attr_e( 'Merchant ID', 'revenue-generator' ); ?>" maxlength="22" />
				<input class="rev-gen-preview-main-account-modal-fields-merchant-key" type="text" placeholder="<?php esc_attr_e( 'API Key', 'revenue-generator' ); ?>" maxlength="32" />
				<div class="rev-gen-preview-main-account-modal-actions">
					<button disabled="disabled" id="rg_js_verifyAccount" class="rev-gen-preview-main-account-modal-actions-dark">
						<?php esc_html_e( 'Connect Account', 'revenue-generator' ); ?>
					</button>
					<p>
						<?php esc_html_e( 'Don’t have an account?', 'revenue-generator' ); ?>
						<a id="rg_js_activateSignup" href="#"><?php esc_html_e( 'Signup', 'revenue-generator' ); ?></a>
					</p>
				</div>
				<span class="rev-gen-preview-main-account-modal-fields-loader"></span>
			</div>
			<div class="rev-gen-preview-main-account-modal-error">
				<h4 class="rev-gen-preview-main-account-modal-error-title"><?php esc_html_e( 'Sorry, something went wrong.', 'revenue-generator' ); ?></h4>
				<span class="rev-gen-preview-main-account-modal-error-warning">!</span>
				<div class="rev-gen-preview-main-account-modal-error-message">
					<?php
					echo wp_kses(
						sprintf(
							/* translators: %1$s static anchor id to handle signup link %2$s statuc anchor id to handle re verification. */
							__(
								'It looks like you need to create a LaterPay account. Please <a id="%1$s" href="#">sign up here</a>, <a id="%2$s" href="#">try again</a>, or contact <a href="mailto:integration@laterpay.net">integration@laterpay.net</a> if you’re still experiencing difficulties.',
								'revenue-generator'
							),
							'rg_js_warningSignup',
							'rg_js_restartVerification'
						),
						[
							'a' => [
								'id'   => [],
								'href' => [],
							],
						]
					);
					?>
				</div>
			</div>
		<?php endif; ?>
		<div class="rev-gen-preview-main-account-modal-success">
			<h4 class="rev-gen-preview-main-account-modal-success-title"></h4>
			<div class="rev-gen-preview-main-account-modal-success-message"></div>
			<div class="rev-gen-preview-main-account-modal-warning-message">
				<?php
				echo wp_kses(
					__(
						'Now that you have more than one contributions, you can copy code from dashboard and paste in post or page. <a href="mailto:wordpress@laterpay.net">Contact us</a> if you have any questions or feedback.',
						'revenue-generator'
					),
					[
						'a' => [
							'href' => [],
						],
					]
				);
				?>
			</div>
			<div class="rev-gen-preview-main-account-modal-success-actions">
				<a href="<?php echo esc_url( $contributions_dashboard_url ); ?>"><?php esc_html_e( 'Go to the Contribution Dashboard', 'revenue-generator' ); ?></a>
			</div>
		</div>
	</div>
</script>

