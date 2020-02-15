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

$individual_purchase_option    = isset( $purchase_options_data['individual'] ) ? $purchase_options_data['individual'] : [];
$subscriptions_purchase_option = isset( $purchase_options_data['subscriptions'] ) ? $purchase_options_data['subscriptions'] : [];
$time_passes_purchase_option   = isset( $purchase_options_data['time_passes'] ) ? $purchase_options_data['time_passes'] : [];
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

<script type="text/template" id="tmpl-revgen-purchase-overlay-actions">
	<div class="rg-purchase-overlay-purchase-options-item-actions">
		<button class="rg-purchase-overlay-option-edit">
			<img alt="<?php echo esc_attr( 'Option edit', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['option_edit'] ); ?>" />
		</button>
		<# if ( data.showMoveUp ) { #>
		<button class="rg-purchase-overlay-option-up">
			<img alt="<?php echo esc_attr( 'Option move up', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['option_move_up'] ); ?>" />
		</button>
		<# } #>
		<# if ( data.showMoveDown ) { #>
		<button class="rg-purchase-overlay-option-down">
			<img alt="<?php echo esc_attr( 'Option move down', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['option_move_down'] ); ?>" />
		</button>
		<# } #>
	</div>
</script>

<script type="text/template" id="tmpl-revgen-purchase-overlay-item-manager">
	<div class="rg-purchase-overlay-option-manager">
		<div class="rg-purchase-overlay-option-manager-entity-selection">
			<select class="rg-purchase-overlay-option-manager-entity">
				<option value="individual"><?php esc_html_e( 'Individual Article', 'revenue-generator' ); ?></option>
				<option value="time_pass"><?php esc_html_e( 'Time Pass', 'revenue-generator' ); ?></option>
				<option value="subscription"><?php esc_html_e( 'Subscription', 'revenue-generator' ); ?></option>
			</select>
		</div>
		<div class="rg-purchase-overlay-option-manager-revenue">
			<span><?php esc_html_e( 'Pay Now', 'revenue-generator' ); ?></span>
			<label class="switch">
				<input class="rg-purchase-overlay-option-revenue-selection" type="checkbox" value="1">
				<span class="slider round"></span>
			</label>
			<span><?php esc_html_e( 'Pay Later', 'revenue-generator' ); ?></span>
			<button class="rg-purchase-overlay-option-info">
				<img src="<?php echo esc_url( $action_icons['option_info'] ); ?>"></button>
		</div>
		<div class="rg-purchase-overlay-option-manager-pricing">
			<span><?php esc_html_e( 'Static Pricing', 'revenue-generator' ); ?></span>
			<label class="switch">
				<input class="rg-purchase-overlay-option-pricing-selection" type="checkbox" value="1">
				<span class="slider round"></span>
			</label>
			<span><?php esc_html_e( 'Dynamic Pricing', 'revenue-generator' ); ?></span>
			<button class="rg-purchase-overlay-option-info">
				<img src="<?php echo esc_url( $action_icons['option_info'] ); ?>"></button>
		</div>
		<div class="rg-purchase-overlay-option-manager-action">
			<button class="rg-purchase-overlay-option-remove"><?php esc_html_e( 'Delete This Purchase Option', 'revenue-generator' ); ?></button>
		</div>
	</div>
</script>

<!-- Template for purchase overlay -->
<script type="text/template" id="tmpl-revgen-purchase-overlay">
	<div class="rg-purchase-overlay-title" contenteditable="true">
		<?php esc_html_e( 'Keep Reading', 'revenue-generator' ); ?>
	</div>
	<div class="rg-purchase-overlay-description" contenteditable="true">
		<?php echo esc_html( sprintf( 'Support %s to get access to this content and more.', esc_url( get_home_url() ) ) ); ?>
	</div>
	<div class="rg-purchase-overlay-purchase-options">
		<?php if ( ! empty( $individual_purchase_option ) ) : ?>
			<div class="rg-purchase-overlay-purchase-options-item">
				<div class="rg-purchase-overlay-purchase-options-item-info" data-purchase-type="individual">
					<div class="rg-purchase-overlay-purchase-options-item-info-title" contenteditable="true">
						<?php esc_html_e( 'Access Article Now', 'revenue-generator' ); ?>
					</div>
					<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
						<?php esc_html_e( 'You\'ll only be charged once you\'ve reached $5.', 'revenue-generator' ); ?>
					</div>
				</div>
				<div class="rg-purchase-overlay-purchase-options-item-price">
					<span id="rg_js_individualPricing" data-pay-model="<?php echo esc_attr( $individual_purchase_option['price']['payment_model'] ); ?>" contenteditable="true">
						<?php echo esc_html( $individual_purchase_option['price']['amount'] ); ?>
					</span>
				</div>
			</div>
		<?php endif ?>
		<?php
		if ( ! empty( $time_passes_purchase_option ) ) {
			foreach ( $time_passes_purchase_option as $time_pass ) {
				$time_pass_price  = $time_pass['price'];
				$time_pass_expiry = $time_pass['expiry'];
				?>
				<div class="rg-purchase-overlay-purchase-options-item">
					<div class="rg-purchase-overlay-purchase-options-item-info"
						 data-purchase-type="time_pass"
						 data-expiry-unit="<?php echo esc_attr( $time_pass_expiry['unit'] ); ?>"
						 data-expiry-value="<?php echo esc_attr( $time_pass_expiry['value'] ); ?>"
					>
						<div class="rg-purchase-overlay-purchase-options-item-info-title" contenteditable="true">
							<?php echo esc_html( $time_pass['title'] ); ?>
						</div>
						<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
							<?php echo esc_html( $time_pass['description'] ); ?>
						</div>
					</div>
					<div class="rg-purchase-overlay-purchase-options-item-price">
						<span id="rg_js_individualPricing"
							  data-pay-model="<?php echo esc_attr( $time_pass_price['payment_model'] ); ?>"
							  contenteditable="true"
						>
						<?php echo esc_html( $time_pass_price['amount'] ); ?>
					</span>
					</div>
				</div>
				<?php
			}
		}
		?>
		<?php
		if ( ! empty( $subscriptions_purchase_option ) ) {
			foreach ( $subscriptions_purchase_option as $subscription ) {
				$subscription_price  = $subscription['price'];
				$subscription_expiry = $subscription['expiry'];
				?>
				<div class="rg-purchase-overlay-purchase-options-item">
					<div class="rg-purchase-overlay-purchase-options-item-info"
						 data-purchase-type="subscription"
						 data-expiry-unit="<?php echo esc_attr( $subscription_expiry['unit'] ); ?>"
						 data-expiry-value="<?php echo esc_attr( $subscription_expiry['value'] ); ?>"
					>
						<div class="rg-purchase-overlay-purchase-options-item-info-title" contenteditable="true">
							<?php echo esc_html( $subscription['title'] ); ?>
						</div>
						<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
							<?php echo esc_html( $subscription['description'] ); ?>
						</div>
					</div>
					<div class="rg-purchase-overlay-purchase-options-item-price">
						<span id="rg_js_individualPricing"
							  data-pay-model="<?php echo esc_attr( $subscription_price['payment_model'] ); ?>"
							  contenteditable="true"
						>
						<?php echo esc_html( $subscription_price['amount'] ); ?>
					</span>
					</div>
				</div>
				<?php
			}
		}
		?>
	</div>
	<div class="rg-purchase-overlay-privacy">
		<p>
			<?php
			echo wp_kses(
				sprintf(
					__(
						'By selecting an option above, I am confirming that I have read and agree to LaterPay\'s <a href="%1$s">privacy policy</a> and <a href="%1$s">terms of service</a>.'
					),
					'#'
				),
				[
					'a' => []
				]
			);
			?>
		</p>
	</div>
	<a class="rg-purchase-overlay-already-bought" href="#"><?php esc_html__( 'I already bought this', 'revenue-generator' ); ?></a>
	<?php View::render_footer_backend(); ?>
</script>
