<?php
/**
 * Revenue Generator post preivew screen with Paywall.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\View;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file
	exit;
}

// Create data for view.
$rg_teaser = empty( $rg_preview_post['excerpt'] ) ? $rg_preview_post['teaser'] : $rg_preview_post['excerpt'];
?>

<div class="rev-gen-layout-wrapper">
	<div class="rev-gen-preview-main">
		<div class="rev-gen-preview-main--search">
			<?php if ( ! empty( $rg_preview_post['title'] ) ) : ?>
				<label for="rg_js_searchContent"><?php esc_html_e( 'Previewing' ); ?>:</label>
			<?php endif; ?>
			<input type="text" id="rg_js_searchContent" placeholder="<?php esc_attr_e( 'search for the page or post you\'d like to preview here', 'revenue-generator' ); ?>" value="<?php echo esc_attr( $rg_preview_post['title'] ); ?>" />
			<i class="dashicons dashicons-search"></i>
		</div>
		<div id="rg_js_postPreviewWrapper" data-post-id="<?php echo esc_attr( $rg_preview_post['ID'] ); ?>" class="rev-gen-preview-main--post">
			<h4 class="rev-gen-preview-main--post--title"><?php echo esc_html( $rg_preview_post['title'] ); ?></h4>
			<?php if ( ! empty( $rg_teaser ) ) : ?>
				<p id="rg_js_postPreviewExcerpt" class="rev-gen-preview-main--post--excerpt"><?php echo wp_kses_post( $rg_teaser ) ?></p>
			<?php endif; ?>
			<div id="rg_js_postPreviewContent" class="rev-gen-preview-main--post--content">
				<?php echo wp_kses_post( $rg_preview_post['post_content'] ); ?>
			</div>
			<div class="rg-purchase-overlay" id="rg_js_purchaseOverly">
			</div>
		</div>
	</div>
	<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
</div>

<!-- Template for purchase overlay -->
<script type="text/template" id="tmpl-revgen-purchase-overlay">
	<div class="rg-purchase-overlay-title" contenteditable="true">
		<?php esc_html_e( 'Keep Reading', 'revenue-generator' ); ?>
	</div>
	<div class="rg-purchase-overlay-description" contenteditable="true">
		<?php echo esc_html( sprintf( 'Support %s to get access to this content and more.', esc_url( get_home_url() ) ) ); ?>
	</div>
	<div class="rg-purchase-overlay-purchase-options">
		<div class="rg-purchase-overlay-purchase-options-item">
			<div class="rg-purchase-overlay-purchase-options-item-info" data-purchase-type="individual">
				<div class="rg-purchase-overlay-purchase-options-item-info-duration" contenteditable="true">
					<?php esc_html_e( 'Access Article Now', 'revenue-generator' ); ?>
				</div>
				<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
					<?php esc_html_e( 'You\'ll only be charged once you\'ve reached $5.', 'revenue-generator' ); ?>
				</div>
			</div>
			<div class="rg-purchase-overlay-purchase-options-item-price">
				<span contenteditable="true">0.29</span>
			</div>
		</div>
		<div class="rg-purchase-overlay-purchase-options-item">
			<div class="rg-purchase-overlay-purchase-options-item-info">
				<div class="rg-purchase-overlay-purchase-options-item-info-duration">1 Month Pass</div>
				<div class="rg-purchase-overlay-purchase-options-item-info-description">Enjoy unlimited access to Cosmo.me for one month.</div>
			</div>
			<div class="rg-purchase-overlay-purchase-options-item-price">
				<span>4.99</span>
			</div>
		</div>
		<div class="rg-purchase-overlay-purchase-options-item">
			<div class="rg-purchase-overlay-purchase-options-item-info">
				<div class="rg-purchase-overlay-purchase-options-item-info-duration">1 Year Pass</div>
				<div class="rg-purchase-overlay-purchase-options-item-info-description">Enjoy unlimited access to Cosmo.me for one year.</div>
			</div>
			<div class="rg-purchase-overlay-purchase-options-item-price">
				<span>9.99</span>
			</div>
		</div>
	</div>
	<div class="rg-purchase-overlay-privacy">
		<p>
			By selecting an option above, I am confirming that I have read and agree to LaterPay's <a href="#">privacy policy</a> and <a href="#">terms of service</a>.
		</p>
	</div>
	<a class="rg-purchase-overlay-already-bought" href="#">I already bought this</a>
	<?php View::render_footer_backend(); ?>
</script>
