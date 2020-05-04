<?php
/**
 * Revenue Generator Contribution Short code Screen.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\View;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file.
	exit;
}
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
	<div class="rg-multiple-wrapper">
		<div class="rg-dialog-wrapper">
			<div class="rg-dialog">
				<div class="rg-header-wrapper">
					<div class="rg-header-padding"></div>
					<div class="rg-header-text">
						<span><?php echo esc_html( $dialog_header ); ?></span>
					</div>
				</div>
				<div class="rg-body-wrapper">
					<div>
						<span class="rg-amount-text"><?php echo esc_html( $dialog_description ); ?></span>
					</div>
					<div class="rg-amount-presets-wrapper">
						<div class="rg-amount-presets">
							<?php
							foreach ( $payment_config['amounts'] as $amount_info ) {
								if ( true === $amount_info['selected'] ) {
									$selected_button = true;
								} else {
									$selected_button = false;
								}
								$lp_amount = $currency_symbol . View::format_number( floatval( $amount_info['amount'] / 100 ), 2 );
								?>
								<div class="rg-amount-preset-wrapper">
									<div class="rg-amount-preset-button <?php echo true === $selected_button ? 'rg-amount-preset-button-selected' : ''; ?>"
										data-revenue="<?php echo esc_attr( $amount_info['revenue'] ); ?>"
										data-campid="<?php echo esc_attr( $campaign_id ); ?>"
										data-url="<?php echo esc_url( $amount_info['url'] ); ?>"
										><?php echo esc_html( $lp_amount ); ?></div>
								</div>
								<?php
							}
							?>
						</div>
						<span class="rg-amount-tip">
							<?php esc_html_e( 'Contribute Now, Pay Later with your Tab?', 'revenue-generator' ); ?>
						</span>
					</div>
					<?php if ( isset( $payment_config['custom_amount'] ) ) : ?>
						<div class="rg-custom-amount-wrapper">
							<div class="rg-custom-amount">
								<label for="lp_custom_amount_input" class="rg-custom-amount-label">
									<span class="rg-custom-amount-text"><?php esc_html_e( 'Custom Amount', 'revenue-generator' ); ?>:</span>
								</label>
								<div class="rg-custom-input-wrapper" data-ppu-url="<?php echo esc_url( $contribution_urls['ppu'] ); ?>" data-sis-url="<?php echo esc_url( $contribution_urls['sis'] ); ?>">
									<input class="rg-custom-amount-input" type="number" step="0.10" value="<?php echo ( ! empty( $payment_config['custom_amount'] ) ) ? esc_attr( View::format_number( floatval( $payment_config['custom_amount'] / 100 ), 2 ) ) : ''; ?>" />
									<i><?php echo esc_html( $currency_symbol ); ?></i>
								</div>
							</div>
						</div>
					<?php endif; ?>
					<div class="rg-dialog-button-wrapper">
						<div class="rg-button-wrapper">
							<div data-url="" class="rg-button rg-contribution-button">
								<div class="rg-cart"></div>
								<div class="rg-link">
									<?php esc_html_e( 'Contribute now', 'revenue-generator' ); ?>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="rg-powered-by">
					<span><?php esc_html_e( 'Powered by', 'revenue-generator' ); ?></span>
					<a class="rg-powered-by-link" href="https://www.laterpay.net/" target="_blank" rel="noopener">
						<img alt="LaterPay Logo" src="https://revgen.test/wp-content/plugins/revenue-generator/assets/build/img/lp-logo.svg">
					</a>
				</div>
			</div>
		</div>
	</div>
	<?php
}
