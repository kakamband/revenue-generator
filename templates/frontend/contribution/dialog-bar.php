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

<div class="rev-gen-contribution rev-gen-contribution--bar is-style-wide<?php echo esc_attr( $amp_class ); ?>" id="<?php echo esc_attr( $html_id ); ?>">
	<div class="rev-gen-contribution__inner">
		<h2 class="rev-gen-contribution__title"<?php echo ( $is_preview ) ? ' contenteditable="true" data-bind="dialog_header"' : ''; ?>><?php echo esc_html( $dialog_header ); ?></h2>
		<div class="rev-gen-contribution__description"<?php echo ( $is_preview ) ? ' contenteditable="true" data-bind="dialog_description"' : ''; ?>><?php echo esc_html( $dialog_description ); ?></div>
		<div class="rev-gen-contribution__donate">
			<?php
			foreach ( $payment_config['amounts'] as $amount_info ) {
				if ( true === $amount_info['selected'] ) {
					$selected_button = true;
				} else {
					$selected_button = false;
				}
				$lp_amount = View::format_number( floatval( $amount_info['amount'] / 100 ), 2 );

				if ( ! $is_preview ) {
					$lp_amount = $currency_symbol . $lp_amount;
				}
				?>
				<div data-href="<?php echo esc_url( $amount_info['url'] ); ?>" data-revenue="<?php echo esc_attr( $amount_info['revenue'] ); ?>" data-campid="<?php echo esc_attr( $campaign_id ); ?>" class="rev-gen-contribution__donation">
					<?php if ( $is_preview ) : ?>
						<?php echo esc_html( $currency_symbol ); ?><span contenteditable="true" data-bind="amounts"><?php echo esc_html( $lp_amount ); ?></span>
					<?php else : ?>
						<a href="<?php echo esc_url( $amount_info['url'] ); ?>" target="_blank"><?php echo esc_html( $lp_amount ); ?></a>
					<?php endif; ?>
				</div>
				<?php
			}
			?>
			<div class="rev-gen-contribution__donation rev-gen-contribution__donation--custom" on="tap:amount-wrapper.toggleVisibility,donation-wrapper.toggleVisibility">
				<a href="#"><?php esc_html_e( 'Custom', 'revenue-generator' ); ?></a>
			</div>
		</div>
		<div class="rev-gen-contribution__custom rev-gen-contribution-custom rev-gen-hidden" id="amount-wrapper" data-ppu-url="<?php echo esc_url( $contribution_urls['ppu'] ); ?>" data-sis-url="<?php echo esc_url( $contribution_urls['sis'] ); ?>" hidden>
			<div class="rev-gen-contribution-custom__inner">
				<div class="rev-gen-contribution-custom__back">
					<img class="rev-gen-contribution-custom__back-arrow" src="<?php echo esc_url( $action_icons['back_arrow_icon'] ); ?>" />
				</div>
				<?php
				$default_amount = $currency_symbol . '20';

				$onblur = sprintf(
					'if ( "" === this.value ) { this.placeholder = %s; }',
					wp_json_encode( $default_amount )
				);
				?>
				<div class="rev-gen-contribution__input-wrap">
					<label for="<?php echo esc_attr( $html_id ); ?>_custom_input"><?php esc_html_e( 'Enter custom amount', 'revenue-generator' ); ?></label>
					<div class="rev-gen-contribution-custom__input">
						<span class="rev-gen-contribution-custom__symbol">$</span>
						<input id="<?php echo esc_attr( $html_id ); ?>_custom_input" name="tip" type="number" value="" step="0.01" min="0" placeholder="<?php echo esc_attr( $default_amount ); ?>" onfocus="this.value = (this.value ? this.value : 20);" onblur="<?php echo esc_attr( $onblur ); ?>">
					</div>
				</div>
				<button class="rev-gen-contribution-custom__send">
					<?php esc_html_e( 'Send Tip', 'revenue-generator' ); ?>
				</button>
			</div>
		</div>
		<div class="rev-gen-contribution__tip rev-gen-hidden">
			<?php esc_html_e( 'Contribute Now, Pay Later with your Tab', 'revenue-generator' ); ?>
		</div>
		<div class="rev-gen-contribution__footer rev-gen-contribution-footer">
			<?php View::render_footer_backend(); ?>
		</div>
	</div>
</div>
