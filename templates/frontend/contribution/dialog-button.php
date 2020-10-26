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

$is_preview = Contribution_Preview::SLUG === get_post_type();
$amp_class = ( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() ) ? ' is-amp' : '';
$html_id = "rev_gen_contribution_{$contribution_id}";
?>

<div class="rev-gen-contribution rev-gen-contribution--button is-style-wide<?php echo esc_attr( $amp_class ); ?>" id="<?php echo esc_attr( $html_id ); ?>">
	<div class="rev-gen-contribution__inner">
		<button class="rev-gen-contribution__button"<?php echo ( $is_preview ) ? ' contenteditable="true" data-bind="dialog_header"' : ''; ?>><?php echo esc_html( $dialog_header ); ?></button>
		<div class="rev-gen-contribution__footer rev-gen-contribution-footer">
			<?php include REVENUE_GENERATOR_PLUGIN_DIR . '/templates/frontend/contribution/partial-footer.php'; ?>
		</div>
	</div>
</div>
