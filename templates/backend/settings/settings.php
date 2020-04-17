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

<div class="rev-gen-layout-wrapper">
	<div class="rev-gen-settings-main">
		<h3 class="rev-gen-settings-main--header"><?php esc_html_e( 'Settings', 'revenue-generator' ); ?></h3>
		<div class="rev-gen-settings-main--publish-settings">
			<!--Add Publish setting.-->
		</div>
	</div>
	<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
</div>
<?php View::render_footer_backend(); ?>
