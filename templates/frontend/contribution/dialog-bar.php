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
?>

<div class="rev-gen-contribution rev-gen-contribution--bar is-style-wide">
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
				<div data-href="<?php echo esc_url( $amount_info['url'] ); ?>" data-revenue="<?php echo esc_attr( $amount_info['revenue'] ); ?>" data-campid="<?php echo esc_attr( $campaign_id ); ?>" class="rev-gen-contribution-main--box-donation">
					<?php if ( $is_preview ) : ?>
						<?php echo esc_html( $currency_symbol ); ?><span contenteditable="true" data-bind="amounts"><?php echo esc_html( $lp_amount ); ?></span>
					<?php else : ?>
						<?php echo esc_html( $lp_amount ); ?>
					<?php endif; ?>
				</div>
				<?php
			}
			?>
			<div class="rev-gen-contribution-main--box-donation rev-gen-contribution-main-custom">
				<?php esc_html_e( 'Custom', 'revenue-generator' ); ?>
			</div>
		</div>
		<div class="rg-custom-amount-wrapper" data-ppu-url="<?php echo esc_url( $contribution_urls['ppu'] ); ?>" data-sis-url="<?php echo esc_url( $contribution_urls['sis'] ); ?>">
			<div class="rg-custom-amount fade-in">
				<div class="rg-custom-amount-title"><?php esc_html_e( 'Enter custom Tip amount', 'revenue-generator' ); ?></div>
				<div class="rg-custom-amount-goback">
					<img src="<?php echo esc_url( $action_icons['back_arrow_icon'] ); ?>" class="arrow" />
				</div>
				<?php
				$default_amount = $currency_symbol . '20';

				$onblur = sprintf(
					'if ( "" === this.value ) { this.placeholder = %s; }',
					wp_json_encode( $default_amount )
				);
				?>
				<input class="rg-custom-amount-input" id="rg-custom-tip-amount" name="tip" type="number" value="" step="0.01" min="0" placeholder="<?php echo esc_attr( $default_amount ); ?>" onfocus="this.placeholder = ''; this.value = (this.value?this.value:20);" onblur="<?php echo esc_attr( $onblur ); ?>">
				<div class="rg-custom-amount-send">
					<?php esc_html_e( 'Send Tip', 'revenue-generator' ); ?>
				</div>
			</div>
		</div>
		<div class="rev-gen-contribution__tip">
			<?php esc_html_e( 'Contribute Now, Pay Later with your Tab', 'revenue-generator' ); ?>
		</div>
		<div class="rev-gen-contribution__footer rev-gen-contribution-footer">
			<?php View::render_footer_backend(); ?>
		</div>
	</div>
</div>
