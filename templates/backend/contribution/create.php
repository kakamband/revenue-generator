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
			<img alt="<?php esc_attr_e( 'Laterpay Logo', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['lp_icon'] ); ?>" />
		</div>
		<div class="rg-contribution-builder">
			<section class="rg-contribution-builder__left">
				<form class="rg-contribution-builder__form" id="rg_js_form">
					<h1 class="rg-contribution-builder__title"><?php esc_html_e( 'Create Your Contribution', 'revenue-generator' ); ?></h1>

					<section class="rg-contribution-builder__layout-select rg-contribution-layout-select">
						<h3 class="rg-contribution-layout-select__title"><?php esc_html_e( 'Select contribution type', 'revenue-generator' ); ?></h3>

						<div class="rg-contribution-layout-select__options">
							<label class="rg-contribution-layout-type">
								<input type="radio" class="rg-visuallyhidden" name="layout_type">
								<div class="rg-contribution-layout-type__preview">
									<div class="rg-contribution-layout-type__box"></div>
									<?php esc_html_e( 'Box', 'revenue-generator' ); ?>
								</div>
							</label>
							<label class="rg-contribution-layout-type">
								<input type="radio"  class="rg-visuallyhidden" name="layout_type">
								<div class="rg-contribution-layout-type__preview">
									<div class="rg-contribution-layout-type__box rg-contribution-layout-type__box--pill"></div>
									<span class="rg-contribution-layout-type__label"><?php esc_html_e( 'Button', 'revenue-generator' ); ?></span>
								</div>
							</label>
							<label class="rg-contribution-layout-type">
								<input type="radio"  class="rg-visuallyhidden" name="layout_type">
								<div class="rg-contribution-layout-type__preview">
									<div class="rg-contribution-layout-type__box rg-contribution-layout-type__box--complex">
										<div class="rg-contribution-layout-type__inner"></div>
									</div>
									<?php esc_html_e( 'Bar', 'revenue-generator' ); ?>
								</div>
							</label>
						</div>
					</section>

					<section class="rg-contribution-builder-inputs">
						<div class="rg-contribution-builder__input-wrap">
							<input type="text" placeholder="<?php esc_html_e( 'Campaign Name', 'revenue-generator' ); ?>">
						</div>
						<div class="rg-contribution-builder__input-wrap">
							<input type="text" placeholder="<?php esc_html_e( 'Link to Thank You Page', 'revenue-generator' ); ?>">
						</div>
						<input type="submit" class="rev-gen__button" value="<?php esc_html_e( 'Save', 'revenue-generator' ); ?>">
					</section>
				</form>
			</section>
			<section class="rg-contribution-builder__preview">
				<iframe src="<?php echo esc_url( site_url() ); ?>" width="100%" height="100%">
			</section>
		</div>
	</div>
</div>
<?php View::render_footer_backend(); ?>
<!-- Template for ShortCode modal -->
<script type="text/template" id="tmpl-revgen-info-shortcode">
	<div class="rev-gen-contribution-main-info-modal rev-gen-preview-main-info-modal campaign-name-info-modal">
	<span class="rev-gen-contribution-main-info-modal-cross"><img alt="<?php esc_attr_e( 'close', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['icon_close'] ); ?>" /></span>
		<h4 class="rev-gen-preview-main-info-modal-title rev-gen-settings-main-info-modal-title"><?php esc_html_e( 'Contribution Shortcode', 'revenue-generator' ); ?></h4>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php
			echo wp_kses(
				__(
					'Once you have completed the information above, simply click "Generate and copy code." This will use the information you have provided to create a customized <a href="https://wordpress.com/support/shortcodes/" target="_blank">shortcode</a>. It will also copy this code to your clipboard so all that you need to do is navigate to where you would like this to appear on your site & paste it in pace.',
					'revenue-generator'
				),
				[
					'a' => [
						'href'   => [],
						'target' => [],
					],
				]
			);
			?>
		</p>
	</div>
</script>
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


<?php include( REVENUE_GENERATOR_PLUGIN_DIR . '/templates/backend/modal-account-activation.php' ); ?>
