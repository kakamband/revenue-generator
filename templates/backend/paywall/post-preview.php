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
?>

<div class="rev-gen-layout-wrapper">
	<div class="rev-gen-preview-main">
		<div class="rev-gen-preview-main--search">
			<?php if ( ! empty( $rg_preview_post['title'] ) ) : ?>
				<label for="rg_js_searchContent" ><?php esc_html_e( 'Previewing' );?>:</label>
			<?php endif; ?>
			<input type="text" id="rg_js_searchContent" placeholder="<?php esc_attr_e( 'search for the page or post you\'d like to preview here', 'revenue-generator' );?>" value="<?php echo esc_attr( $rg_preview_post['title'] ); ?>" />
			<i class="dashicons dashicons-search"></i>
		</div>
		<div id="rg_js_postPreviewWrapper" data-post-id="<?php echo esc_attr( $rg_preview_post['ID'] ); ?>" class="rev-gen-preview-main--post">
			<h4 class="rev-gen-preview-main--post--title"><?php echo esc_html(  $rg_preview_post['title'] ); ?></h4>
			<?php if( ! empty( $rg_preview_post['excerpt'] ) ) : ?>
			<p class="rev-gen-preview-main--post--excerpt"><?php echo esc_html(  $rg_preview_post['excerpt'] ); ?></p>
			<?php endif; ?>
			<div id="rg_js_postPreviewContent" class="rev-gen-preview-main--post--content">
				<?php echo wp_kses_post( $rg_preview_post['post_content'] ); ?>
			</div>
		</div>
	</div>
	<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
</div>
