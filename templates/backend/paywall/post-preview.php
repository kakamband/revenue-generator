<?php
/**
 * Revenue Generator post preivew screen with Paywall.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\View;
use LaterPay\Revenue_Generator\Inc\Post_Types;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file
	exit;
}

// Create data for view.
$rg_teaser = empty( $rg_preview_post['excerpt'] ) ? $rg_preview_post['teaser'] : $rg_preview_post['excerpt'];

$paywall_data                  = isset( $purchase_options_data['paywall'] ) ? $purchase_options_data['paywall'] : [];
$paywall_id                    = empty( $paywall_data['id'] ) ? '' : $paywall_data['id'];
$individual_purchase_option    = isset( $purchase_options_data['individual'] ) ? $purchase_options_data['individual'] : [];
$individual_type               = empty( $individual_purchase_option['type'] ) ? 'static' : $individual_purchase_option['type'];
$subscriptions_purchase_option = isset( $purchase_options_data['subscriptions'] ) ? $purchase_options_data['subscriptions'] : [];
$time_passes_purchase_option   = isset( $purchase_options_data['time_passes'] ) ? $purchase_options_data['time_passes'] : [];
?>

<div class="rev-gen-layout-wrapper">
	<div class="rev-gen-preview-main">
		<div class="rev-gen-preview-main--search">
			<?php if ( ! empty( $rg_preview_post['title'] ) ) : ?>
				<label for="rg_js_searchContent"><?php esc_html_e( 'Previewing', 'revenue-generator' ); ?>:</label>
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
		<div class="rev-gen-preview-main--paywall-actions">
			<div class="rev-gen-preview-main--paywall-actions-apply">
				<p>
					<?php
					echo wp_kses(
						sprintf(
							__( 'Apply <span contenteditable="true" class="rev-gen-preview-main-paywall-name">%s</span> to', 'revenue-generator' ),
							esc_html( 'Paywall 1' )
						),
						[
							'span' => [
								'class'           => [],
								'contenteditable' => true,
							]
						]
					);
					?>
				</p>
				<select class="rev-gen-preview-main-paywall-applies-to">
					<option value="all"><?php esc_html_e( 'all posts and pages', 'revenue-generator' ); ?></option>
					<option value="category"><?php esc_html_e( 'category', 'revenue-generator' ); ?></option>
					<option value="page"><?php esc_html_e( 'page', 'revenue-generator' ); ?></option>
					<option value="post"><?php esc_html_e( 'post', 'revenue-generator' ); ?></option>
				</select>
			</div>
			<div class="rev-gen-preview-main--paywall-actions-search">
				<input type="text" id="rg_js_searchPaywallContent" placeholder="<?php esc_attr_e( 'search', 'revenue-generator' ); ?>" />
				<i class="dashicons dashicons-search"></i>
			</div>
			<div class="rev-gen-preview-main--paywall-actions-update">
				<button id="rg_js_savePaywall" class="rev-gen-preview-main-paywall-actions-update-save">
					<?php esc_html_e( 'Save', 'revenue-generator' ); ?>
				</button>
				<button id="rg_js_activatePaywall" class="rev-gen-preview-main--paywall-actions-update-publish">
					<?php esc_html_e( 'Publish', 'revenue-generator' ); ?>
				</button>
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
			<select id="rg_js_purchaseOptionType" class="rg-purchase-overlay-option-manager-entity">
				<option
				<# data.entityType === 'individual' ? print("selected") : print('') #> value="individual"><?php esc_html_e( 'Individual Article', 'revenue-generator' ); ?></option>
				<option
				<# data.entityType === 'time-pass' ? print("selected") : print('') #> value="time-pass"><?php esc_html_e( 'Time Pass', 'revenue-generator' ); ?></option>
				<option
				<# data.entityType === 'subscription' ? print("selected") : print('') #> value="subscription"><?php esc_html_e( 'Subscription', 'revenue-generator' ); ?></option>
			</select>
		</div>
		<div class="rg-purchase-overlay-option-manager-revenue">
			<span><?php esc_html_e( 'Pay Now', 'revenue-generator' ); ?></span>
			<label class="switch">
				<input class="rg-purchase-overlay-option-revenue-selection" type="checkbox">
				<span class="slider round"></span>
			</label>
			<span><?php esc_html_e( 'Pay Later', 'revenue-generator' ); ?></span>
			<button class="rg-purchase-overlay-option-info">
				<img src="<?php echo esc_url( $action_icons['option_info'] ); ?>">
			</button>
		</div>
		<div class="rg-purchase-overlay-option-manager-pricing">
			<span><?php esc_html_e( 'Static Pricing', 'revenue-generator' ); ?></span>
			<label class="switch">
				<input class="rg-purchase-overlay-option-pricing-selection" type="checkbox">
				<span class="slider round"></span>
			</label>
			<span><?php esc_html_e( 'Dynamic Pricing', 'revenue-generator' ); ?></span>
			<button class="rg-purchase-overlay-option-info">
				<img src="<?php echo esc_url( $action_icons['option_info'] ); ?>"></button>
		</div>
		<div class="rg-purchase-overlay-option-manager-duration">
			<select class="rg-purchase-overlay-option-manager-duration-count">
				<?php echo wp_kses( Post_Types::get_select_options( 'duration' ), array(
					'option' => array(
						'selected' => array(),
						'value'    => array(),
					)
				) ); ?>
			</select>
			<select class="rg-purchase-overlay-option-manager-duration-period">
				<?php echo wp_kses( Post_Types::get_select_options( 'period' ), array(
					'option' => array(
						'selected' => array(),
						'value'    => array(),
					)
				) ); ?>
			</select>
		</div>
		<div class="rg-purchase-overlay-option-manager-action">
			<button class="rg-purchase-overlay-option-remove"><?php esc_html_e( 'Delete This Purchase Option', 'revenue-generator' ); ?></button>
		</div>
	</div>
</script>

<!-- Template for purchase overlay -->
<script type="text/template" id="tmpl-revgen-purchase-overlay">
	<div class="rg-purchase-overlay-title" contenteditable="true">
		<?php echo empty( $paywall_data['title'] ) ? esc_html__( 'Keep Reading', 'revenue-generator' ) : esc_html( $paywall_data['title'] ); ?>
	</div>
	<div class="rg-purchase-overlay-description" contenteditable="true">
		<?php empty( $paywall_data['description'] ) ? esc_html( sprintf( 'Support %s to get access to this content and more.', esc_url( get_home_url() ) ) ) : esc_html( $paywall_data['description'] ); ?>
	</div>
	<div class="rg-purchase-overlay-purchase-options" data-paywall-id="<?php echo esc_attr( $paywall_id ); ?>">
		<?php if ( ! empty( $individual_purchase_option ) ) : ?>
			<div
				class="rg-purchase-overlay-purchase-options-item"
				data-purchase-type="individual"
				data-pricing-type="<?php echo esc_attr( $individual_type ); ?>"
			>
				<div class="rg-purchase-overlay-purchase-options-item-info">
					<div class="rg-purchase-overlay-purchase-options-item-info-title" contenteditable="true">
						<?php echo empty( $individual_purchase_option['title'] ) ? esc_html__( 'Access Article Now', 'revenue-generator' ) : esc_html( $individual_purchase_option['title'] ); ?>
					</div>
					<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
						<?php echo empty( $individual_purchase_option['description'] ) ? esc_html__( 'You\'ll only be charged once you\'ve reached $5.', 'revenue-generator' ) : esc_html( $individual_purchase_option['description'] ); ?>
					</div>
				</div>
				<div class="rg-purchase-overlay-purchase-options-item-price">
					<span class="rg-purchase-overlay-purchase-options-item-price-symbol"><?php echo esc_html( $merchant_symbol ); ?></span>
					<span class="rg-purchase-overlay-purchase-options-item-price-span" data-pay-model="<?php echo esc_attr( $individual_purchase_option['revenue'] ); ?>" contenteditable="true">
						<?php echo esc_html( $individual_purchase_option['price'] ); ?>
					</span>
				</div>
			</div>
		<?php endif ?>
		<?php
		if ( ! empty( $time_passes_purchase_option ) ) {
			foreach ( $time_passes_purchase_option as $time_pass ) {
				$time_pass_id       = empty( $time_pass['id'] ) ? '' : $time_pass['id'];
				$time_pass_price    = $time_pass['price'];
				$time_pass_revenue  = $time_pass['revenue'];
				$time_pass_duration = $time_pass['duration'];
				$time_pass_period   = $time_pass['period'];
				?>
				<div
					class="rg-purchase-overlay-purchase-options-item"
					data-purchase-type="time-pass"
					data-expiry-duration="<?php echo esc_attr( $time_pass_duration ); ?>"
					data-expiry-period="<?php echo esc_attr( $time_pass_period ); ?>"
					data-tlp-id="<?php echo esc_attr( $time_pass_id ); ?>"
					data-uid=""
				>
					<div class="rg-purchase-overlay-purchase-options-item-info">
						<div class="rg-purchase-overlay-purchase-options-item-info-title" contenteditable="true">
							<?php echo esc_html( $time_pass['title'] ); ?>
						</div>
						<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
							<?php echo esc_html( $time_pass['description'] ); ?>
						</div>
					</div>
					<div class="rg-purchase-overlay-purchase-options-item-price">
						<span class="rg-purchase-overlay-purchase-options-item-price-symbol"><?php echo esc_html( $merchant_symbol ); ?></span>
						<span class="rg-purchase-overlay-purchase-options-item-price-span" data-pay-model="<?php echo esc_attr( $time_pass_revenue ); ?>" contenteditable="true">
						<?php echo esc_html( $time_pass_price ); ?>
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
				$subscription_id       = empty( $subscription['id'] ) ? '' : $subscription['id'];
				$subscription_price    = $subscription['price'];
				$subscription_revenue  = $subscription['revenue'];
				$subscription_duration = $subscription['duration'];
				$subscription_period   = $subscription['period'];
				?>
				<div
					class="rg-purchase-overlay-purchase-options-item"
					data-purchase-type="subscription"
					data-expiry-duration="<?php echo esc_attr( $subscription_duration ); ?>"
					data-expiry-period="<?php echo esc_attr( $subscription_period ); ?>"
					data-sub-id="<?php echo esc_attr( $subscription_id ); ?>"
					data-uid=""
				>
					<div class="rg-purchase-overlay-purchase-options-item-info">
						<div class="rg-purchase-overlay-purchase-options-item-info-title" contenteditable="true">
							<?php echo esc_html( $subscription['title'] ); ?>
						</div>
						<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
							<?php echo esc_html( $subscription['description'] ); ?>
						</div>
					</div>
					<div class="rg-purchase-overlay-purchase-options-item-price">
						<span class="rg-purchase-overlay-purchase-options-item-price-symbol"><?php echo esc_html( $merchant_symbol ); ?></span>
						<span class="rg-purchase-overlay-purchase-options-item-price-span" data-pay-model="<?php echo esc_attr( $subscription_revenue ); ?>" contenteditable="true">
						<?php echo esc_html( $subscription_price ); ?>
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

<script type="text/template" id="tmpl-revgen-purchase-currency-overlay">
	<div class="rev-gen-preview-main-currency-modal">
		<span class="rev-gen-preview-main-currency-modal-cross">X</span>
		<h4 class="rev-gen-preview-main-currency-modal-title"><?php esc_html_e( 'Choose your currency', 'revenue-generator' ); ?></h4>
		<span class="rev-gen-preview-main-currency-modal-question"><?php esc_html_e( 'In what currency do you sell content?', 'revenue-generator' ); ?></span>
		<div class="rev-gen-preview-main-currency-modal-inputs">
			<label>
				<input class="rev-gen-preview-main-currency-modal-inputs-currency" type="radio" name="currency" value="USD" />
				<?php esc_html_e( 'USD', 'revenue-generator' ); ?> $
			</label>
			<label>
				<input class="rev-gen-preview-main-currency-modal-inputs-currency" type="radio" name="currency" value="EUR" />
				<?php esc_html_e( 'EURO', 'revenue-generator' ); ?> €
			</label>
		</div>
		<button disabled="disabled" class="rev-gen-preview-main-currency-modal-button">
			<?php esc_html_e( 'Apply currency', 'revenue-generator' ); ?>
		</button>
	</div>
</script>
