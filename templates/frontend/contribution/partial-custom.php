<?php
/**
 * Custom box contribution template.
 *
 * @package revenue-generator
 */

defined( 'ABSPATH' ) || exit;
?>
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
