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
				<h3 class="rev-gen-contribution-main--box-header" contenteditable="true"><?php esc_html_e( 'Support the Author', 'revenue-generator' ); ?></h3>
				<p class="rev-gen-contribution-main--box-description" contenteditable="true"><?php esc_html_e( 'Pick your contribution below:' ); ?></p>
				<div class="rev-gen-contribution-main--box-donation-wrapper">
					<div class="rev-gen-contribution-main--box-donation">
						<span class="rev-gen-contribution-main--box-donation-currency"><?php esc_html_e( '$', 'revenue-generator' ); ?></span>
						<span class="rev-gen-contribution-main--box-donation-amount" contenteditable="true"><?php esc_html_e( '0.50', 'revenue-generator' ); ?></span>
					</div>
					<div class="rev-gen-contribution-main--box-donation">
						<span class="rev-gen-contribution-main--box-donation-currency"><?php esc_html_e( '$', 'revenue-generator' ); ?></span>
						<span class="rev-gen-contribution-main--box-donation-amount" contenteditable="true"><?php esc_html_e( '1.00', 'revenue-generator' ); ?></span>
					</div>
					<div class="rev-gen-contribution-main--box-donation">
						<span class="rev-gen-contribution-main--box-donation-currency"><?php esc_html_e( '$', 'revenue-generator' ); ?></span>
						<span class="rev-gen-contribution-main--box-donation-amount" contenteditable="true"><?php esc_html_e( '5.00', 'revenue-generator' ); ?></span>
					</div>
					<div class="rev-gen-contribution-main--box-donation"">
						<span class="rev-gen-contribution-main--box-donation-currency"><?php esc_html_e( '$', 'revenue-generator' ); ?></span>
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
				<button class="rev-gen-contribution-main-generate-button">
					<?php esc_html_e( 'Generate and copy code', 'revenue-generator' ); ?>
				</button>
			</div>
		</div>
		<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
	</div>	
</div>
<!-- Template for Campaign Name modal -->
<script type="text/template" id="tmpl-revgen-info-campaignName">
	<div class="rev-gen-contribution-main-info-modal rev-gen-preview-main-info-modal campaign-name-info-modal">
		<h4 class="rev-gen-preview-main-info-modal-title rev-gen-settings-main-info-modal-title"><?php esc_html_e( 'Campaign Name', 'revenue-generator' ); ?></h4>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php esc_html_e( "Enter the name you would like to appear on your customers' invoice. We recommend including your organization's name as well as something to remind them of this specific contribution.", 'revenue-generator' ); ?>
		</p>
	</div>
</script>
<!-- Template for Thank you modal -->
<script type="text/template" id="tmpl-revgen-info-thankYouPage">
	<div class="rev-gen-contribution-main-info-modal rev-gen-preview-main-info-modal thankyoupage-info-modal">
		<h4 class="rev-gen-preview-main-info-modal-title rev-gen-settings-main-info-modal-title"><?php esc_html_e( 'Thank You Page', 'revenue-generator' ); ?></h4>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php esc_html_e( 'After your customer has contributed, we can redirect them to a page of your choice (for example, a dedicated "thank you" page on your website). If no thank you page is provided, they will be redirected to the page which initiated their contribution.', 'revenue-generator' ); ?>
		</p>
	</div>
</script>
<?php View::render_footer_backend(); ?>
