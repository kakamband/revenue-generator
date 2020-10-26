<?php
/**
 * Revenue Generator Contribution Short code Screen.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\View;
use \LaterPay\Revenue_Generator\Inc\Post_Types\Contribution_Preview;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file.
	exit;
}
?>

<div class="rev-gen-contribution rev-gen-contribution--button is-style-wide<?php echo ( $is_amp ) ? ' is-amp' : ''; ?>" id="<?php echo esc_attr( $html_id ); ?>">
	<div class="rev-gen-contribution__inner">
		<button class="rev-gen-contribution__button"<?php echo ( $is_preview ) ? ' contenteditable="true" data-bind="dialog_header"' : ''; ?>><?php echo esc_html( $dialog_header ); ?></button>
		<div class="rev-gen-contribution__footer rev-gen-contribution-footer">
			<?php include REVENUE_GENERATOR_PLUGIN_DIR . '/templates/frontend/contribution/partial-footer.php'; ?>
		</div>
	</div>
</div>
