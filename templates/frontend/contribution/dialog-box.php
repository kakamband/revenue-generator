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

<?php if ( 'single' === $type ) { ?>
	<div class="rg-dialog-single-button-wrapper">
		<div class="rg-button-wrapper">
			<div class="rg-button">
				<div class="rg-cart"></div>
				<?php
				$amount = $currency_symbol . View::format_number( floatval( $payment_config['amount'] / 100 ), 2 );
				if ( 'ppu' === $payment_config['revenue'] ) {
					$button_text = sprintf( '%s %s %s', __( 'Contribute', 'revenue-generator' ), $amount, __( 'now, Pay Later', 'revenue-generator' ) );
				} else {
					$button_text = sprintf( '%s %s %s', __( 'Contribute', 'revenue-generator' ), $amount, __( 'now', 'revenue-generator' ) );
				}
				?>
				<div class="rg-link rg-link-single" data-amount="<?php echo esc_attr( $payment_config['amount'] ); ?>" data-url="<?php echo esc_url( $payment_config['url'] ); ?>">
					<?php echo esc_html( $button_text ); ?>
				</div>
			</div>
		</div>
	</div>
<?php } else { ?>
	<div class="rev-gen-contribution rev-gen-contribution--box is-style-wide<?php echo esc_attr( $amp_class ); ?>" id="<?php echo esc_attr( $html_id ); ?>">
			<div class="rev-gen-contribution__inner">
				<h2 class="rev-gen-contribution__title"<?php echo ( $is_preview ) ? ' contenteditable="true" data-bind="dialog_header"' : ''; ?>><?php echo esc_html( $dialog_header ); ?></h2>
				<div class="rev-gen-contribution__description rev-gen-contribution-tooltip-right"<?php echo ( $is_preview ) ? ' contenteditable="true" data-bind="dialog_description"' : ''; ?>><?php echo esc_html( $dialog_description ); ?></div>
				<?php include REVENUE_GENERATOR_PLUGIN_DIR . '/templates/frontend/contribution/partial-donate.php'; ?>
				<?php include REVENUE_GENERATOR_PLUGIN_DIR . '/templates/frontend/contribution/partial-custom.php'; ?>
				<div class="rev-gen-contribution__tip rev-gen-hidden">
					<?php esc_html_e( 'Contribute Now, Pay Later with your Tab', 'revenue-generator' ); ?>
				</div>
				<div class="rev-gen-contribution__footer rev-gen-contribution-footer">
					<?php View::render_footer_backend(); ?>
				</div>
			</div>
	</div>
	<?php
}
