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

$rg_teaser = '';

// Create data for view.
if ( ! empty( $rg_preview_post['excerpt'] ) ) {
	$rg_teaser = $rg_preview_post['excerpt'];
} else if ( ! empty( $rg_preview_post['teaser'] ) ) {
	$rg_teaser = $rg_preview_post['teaser'];
}

$paywall_data       = isset( $purchase_options_data['paywall'] ) ? $purchase_options_data['paywall'] : [];
$paywall_id         = empty( $paywall_data['id'] ) ? '' : $paywall_data['id'];
$paywall_preview_id = empty( $paywall_data['preview_id'] ) ? '' : $paywall_data['preview_id'];
if ( empty( $paywall_data ) && ! empty( $rg_preview_post['ID'] ) ) {
	$paywall_preview_id = $rg_preview_post['ID'];
}
$paywall_access_to     = isset( $paywall_data['access_to'] ) ? $paywall_data['access_to'] : 'all';
$purchase_option_items = $purchase_options_data['options'];
$rg_preview_post_title = empty( $rg_preview_post['title'] ) ? '' : $rg_preview_post['title'];
?>

<div class="rev-gen-layout-wrapper">
	<div class="laterpay-loader-wrapper">
		<img alt="<?php echo esc_attr( 'LaterPay Logo', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['lp_icon'] ); ?>" />
	</div>
	<div class="rev-gen-preview-main">
		<div class="rev-gen-preview-main--search">
			<?php if ( ! empty( $rg_preview_post_title ) ) : ?>
				<label for="rg_js_searchContent"><?php esc_html_e( 'Previewing', 'revenue-generator' ); ?>:</label>
			<?php endif; ?>
			<input type="text" id="rg_js_searchContent" placeholder="<?php esc_attr_e( 'search for the page or post you\'d like to preview here', 'revenue-generator' ); ?>" value="<?php echo esc_attr( $rg_preview_post_title ); ?>" />
			<i class="dashicons dashicons-search"></i>
			<div class="rev-gen-preview-main--search-results"></div>
		</div>
		<?php if ( ! empty( $rg_preview_post ) ) : ?>
			<div id="rg_js_postPreviewWrapper" data-preview-id="<?php echo esc_attr( $paywall_preview_id ); ?>" data-access-id="<?php echo esc_attr( $rg_preview_post['ID'] ); ?>" class="rev-gen-preview-main--post">
				<h4 class="rev-gen-preview-main--post--title"><?php echo esc_html( $rg_preview_post['title'] ); ?></h4>
				<?php if ( ! empty( $rg_teaser ) ) : ?>
					<p id="rg_js_postPreviewExcerpt" class="rev-gen-preview-main--post--excerpt"><?php echo wp_kses_post( $rg_teaser ) ?></p>
				<?php endif; ?>
				<div id="rg_js_postPreviewContent" class="rev-gen-preview-main--post--content">
					<?php echo wp_kses_post( $rg_preview_post['post_content'] ); ?>
				</div>
				<div class="rg-purchase-overlay" id="rg_js_purchaseOverlay">
					<button class="rg-purchase-overlay-remove">
						<img alt="<?php echo esc_attr( 'Paywall Remove', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['option_remove'] ); ?>" />
					</button>
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
						<option <?php selected( $paywall_access_to, 'all', true ); ?> value="all"><?php esc_html_e( 'all posts and pages', 'revenue-generator' ); ?></option>
						<option <?php selected( $paywall_access_to, 'supported', true ); ?> value="supported"><?php esc_html_e( 'selected post or page', 'revenue-generator' ); ?></option>
						<option <?php selected( $paywall_access_to, 'category', true ); ?> value="category"><?php esc_html_e( 'category', 'revenue-generator' ); ?></option>
						<option <?php selected( $paywall_access_to, 'exclude_category', true ); ?> value="exclude_category"><?php esc_html_e( 'except for category', 'revenue-generator' ); ?></option>
					</select>
				</div>
				<div class="rev-gen-preview-main--paywall-actions-search">
					<select id="rg_js_searchPaywallContent">
						<?php if ( ! empty( $rg_category_data ) ): ?>
							<option selected="selected" value="<?php echo esc_attr( $rg_category_data->term_id ); ?>">
								<?php echo esc_html( $rg_category_data->name ); ?>
							</option>
						<?php endif; ?>
					</select>
					<i class="dashicons dashicons-search"></i>
				</div>
				<div class="rev-gen-preview-main--paywall-actions-update">
					<button id="rg_js_savePaywall" class="rev-gen-preview-main-paywall-actions-update-save">
						<?php esc_html_e( 'Save', 'revenue-generator' ); ?>
					</button>
					<button id="rg_js_activatePaywall" disabled="disabled" class="rev-gen-preview-main--paywall-actions-update-publish">
						<?php esc_html_e( 'Publish', 'revenue-generator' ); ?>
					</button>
				</div>
			</div>
		<?php endif; ?>
	</div>
	<div id="rg_js_SnackBar" class="rev-gen-snackbar"></div>
	<div class="rev-gen-exit-tour"><?php esc_html_e( 'Exit Tour', 'revenue-generator' ); ?></div>
</div>

<!-- Template for purchase option manager actions -->
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

<!-- Template for purchase option manager -->
<script type="text/template" id="tmpl-revgen-purchase-overlay-item-manager">
	<div class="rg-purchase-overlay-option-manager">
		<div class="rg-purchase-overlay-option-manager-entity-selection">
			<select id="rg_js_purchaseOptionType" class="rg-purchase-overlay-option-manager-entity">
				<option
				<# data.entityType === 'individual' ? print("selected") : print('') #> value="individual"><?php esc_html_e( 'Individual Article', 'revenue-generator' ); ?></option>
				<option
				<# data.entityType === 'timepass' ? print("selected") : print('') #> value="timepass"><?php esc_html_e( 'Time Pass', 'revenue-generator' ); ?></option>
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
			<button data-info-for="revenue" class="rg-purchase-overlay-option-info">
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
			<button data-info-for="pricing" class="rg-purchase-overlay-option-info">
				<img src="<?php echo esc_url( $action_icons['option_info'] ); ?>"></button>
		</div>
		<div class="rg-purchase-overlay-option-manager-duration">
			<select class="rg-purchase-overlay-option-manager-duration-count">
				<?php echo wp_kses( Post_Types::get_select_options( 'duration' ), [
					'option' => [
						'selected' => [],
						'value'    => [],
					]
				] ); ?>
			</select>
			<select class="rg-purchase-overlay-option-manager-duration-period">
				<?php echo wp_kses( Post_Types::get_select_options( 'period' ), [
					'option' => [
						'selected' => [],
						'value'    => [],
					]
				] ); ?>
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
		<?php echo empty( $paywall_data['description'] ) ? esc_html( sprintf( 'Support %s to get access to this content and more.', esc_url( get_home_url() ) ) ) : esc_html( $paywall_data['description'] ); ?>
	</div>
	<div class="rg-purchase-overlay-purchase-options" data-paywall-id="<?php echo esc_attr( $paywall_id ); ?>">
		<?php if ( ! empty( $purchase_option_items ) ) :
			foreach ( $purchase_option_items as $purchase_option ) {
				$purchase_option_id       = empty( $purchase_option['id'] ) ? '' : $purchase_option['id'];
				$purchase_option_price    = number_format( $purchase_option['price'], 2 );
				$purchase_option_type     = $purchase_option['purchase_type'];
				$is_individual            = 'individual' === $purchase_option_type;
				$individual_type          = '';
				$purchase_option_revenue  = $purchase_option['revenue'];
				$purchase_option_duration = $is_individual ? '' : $purchase_option['duration'];
				$purchase_option_period   = $is_individual ? '' : $purchase_option['period'];
				$purchase_option_order    = $purchase_option['order'];

				$additional_class = '';
				if ( 2 === $purchase_option_order ) {
					$additional_class = 'option-item-second';
				}

				if ( $is_individual ) {
					$individual_type = empty( $purchase_option['type'] ) ? 'static' : $purchase_option['type'];
				}
				?>
				<div
					class="rg-purchase-overlay-purchase-options-item <?php echo esc_attr( $additional_class ); ?>"
					data-purchase-type="<?php echo esc_attr( $purchase_option_type ); ?>"
					<?php if ( 'individual' !== $purchase_option_type ): ?>
						data-expiry-duration="<?php echo esc_attr( $purchase_option_duration ); ?>"
						data-expiry-period="<?php echo esc_attr( $purchase_option_period ); ?>"
					<?php else: ?>
						data-pricing-type="<?php echo esc_attr( $individual_type ); ?>"
						data-paywall-id="<?php echo esc_attr( $paywall_id ); ?>"
					<?php endif; ?>
					<?php if ( 'timepass' === $purchase_option_type ): ?>
						data-tlp-id="<?php echo esc_attr( $purchase_option_id ); ?>"
					<?php endif;
					if ( 'subscription' === $purchase_option_type ): ?>
						data-sub-id="<?php echo esc_attr( $purchase_option_id ); ?>"
					<?php endif; ?>
					data-uid=""
					data-order="<?php echo esc_attr( $purchase_option_order ); ?>"
				>
					<div class="rg-purchase-overlay-purchase-options-item-info">
						<div class="rg-purchase-overlay-purchase-options-item-info-title" contenteditable="true">
							<?php echo empty( $purchase_option['title'] ) ? esc_html__( 'Access Article Now', 'revenue-generator' ) : esc_html( $purchase_option['title'] ); ?>
						</div>
						<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
							<?php echo empty( $purchase_option['description'] ) ? esc_html__( 'You\'ll only be charged once you\'ve reached $5.', 'revenue-generator' ) : esc_html( $purchase_option['description'] ); ?>
						</div>
					</div>
					<div class="rg-purchase-overlay-purchase-options-item-price">
						<span class="rg-purchase-overlay-purchase-options-item-price-symbol"><?php echo esc_html( $merchant_symbol ); ?></span>
						<span class="rg-purchase-overlay-purchase-options-item-price-span" data-pay-model="<?php echo esc_attr( $purchase_option_revenue ); ?>" contenteditable="true">
						<?php echo esc_html( $purchase_option_price ); ?>
					</span>
					</div>
				</div>
				<?php
			}
		endif;
		?>
	</div>
	<div class="rg-purchase-overlay-option-area">
		<div class="rg-purchase-overlay-option-area-add-option">
			<button>
				<img alt="<?php echo esc_attr( 'Option add', 'revenue-generator' ); ?>" src="<?php echo esc_url( $action_icons['option_add'] ); ?>" />
			</button>
			<hr />
			<span><?php esc_html_e( 'Add a new purchase option', 'revenue-generator' ); ?></span>
			<hr />
		</div>
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

<!-- Template for currency confirmation modal -->
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

<!-- Template for option item -->
<script type="text/template" id="tmpl-revgen-default-purchase-option-item">
	<div
		class="rg-purchase-overlay-purchase-options-item"
		data-purchase-type="subscription"
		data-expiry-duration="<?php echo esc_attr( $default_option_data['duration'] ); ?>"
		data-expiry-period="<?php echo esc_attr( $default_option_data['period'] ); ?>"
		data-sub-id=""
		data-uid=""
		data-order=""
	>
		<div class="rg-purchase-overlay-purchase-options-item-info">
			<div class="rg-purchase-overlay-purchase-options-item-info-title" contenteditable="true">
				<?php echo esc_html( $default_option_data['title'] ); ?>
			</div>
			<div class="rg-purchase-overlay-purchase-options-item-info-description" contenteditable="true">
				<?php echo esc_html( $default_option_data['description'] ); ?>
			</div>
		</div>
		<div class="rg-purchase-overlay-purchase-options-item-price">
			<span class="rg-purchase-overlay-purchase-options-item-price-symbol"><?php echo esc_html( $merchant_symbol ); ?></span>
			<span class="rg-purchase-overlay-purchase-options-item-price-span" data-pay-model="<?php echo esc_attr( $default_option_data['revenue'] ); ?>" contenteditable="true">
				<?php echo esc_html( $default_option_data['price'] ); ?>
			</span>
		</div>
	</div>
</script>

<!-- Template for option update warning modal -->
<script type="text/template" id="tmpl-revgen-purchase-option-update">
	<div class="rev-gen-preview-main-option-update">
		<h4 class="rev-gen-preview-main-option-update-title"><?php esc_html_e( 'This will affect all your paywalls.', 'revenue-generator' ); ?></h4>
		<span class="rev-gen-preview-main-option-update-warning">!</span>
		<p class="rev-gen-preview-main-option-update-message">
			<?php
			esc_html_e( 'The changes you have made will impact all the paywalls across your entire site.', 'revenue-generator' );
			?>
		</p>
		<div class="rev-gen-preview-main-option-update-buttons">
			<button id="rg_js_continueOperation" class="rev-gen-preview-main-option-update-buttons-dark">
				<?php esc_html_e( 'Continue', 'revenue-generator' ); ?>
			</button>
			<button id="rg_js_cancelOperation" class="rev-gen-preview-main-option-update-buttons-light">
				<?php esc_html_e( 'Cancel', 'revenue-generator' ); ?>
			</button>
		</div>
	</div>
</script>

<!-- Template for revenue info modal -->
<script type="text/template" id="tmpl-revgen-info-revenue">
	<div class="rev-gen-preview-main-info-modal">
		<span class="rev-gen-preview-main-info-modal-cross">X</span>
		<h4 class="rev-gen-preview-main-info-modal-title"><?php esc_html_e( 'Pay Now v Pay Later?', 'revenue-generator' ); ?></h4>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php
			esc_html_e( 'Choose the pricing model that best suits your needs!', 'revenue-generator' );
			?>
		</p>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php
			printf(
				wp_kses(
					__(
						"<b>Pay Later</b> means users agree to pay for content or timed access later - once their tab reaches $5 or 5€. Think of it as ‘the internet’s running tab.’", 'revenue-generator' ),
					[
						'b' => [],
					]
				)
			);
			?>
		</p>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php
			printf(
				wp_kses(
					__(
						'<b>Pay Now</b> is the traditional upfront payment method that everyone is familiar with. Recurring subscriptions automatically work on a pay now basis.', 'revenue-generator' ),
					[
						'b' => [],
					]
				)
			);
			?>
		</p>
	</div>
</script>

<!-- Template for pricing info modal -->
<script type="text/template" id="tmpl-revgen-info-pricing">
	<div class="rev-gen-preview-main-info-modal">
		<span class="rev-gen-preview-main-info-modal-cross">X</span>
		<h4 class="rev-gen-preview-main-info-modal-title"><?php esc_html_e( 'Static Pricing and Dynamic Pricing', 'revenue-generator' ); ?></h4>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php
			esc_html_e( 'Revenue Generator allows you two ways to go about pricing content.', 'revenue-generator' );
			?>
		</p>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php
			printf(
				wp_kses(
					__(
						'Select <b>Static Pricing</b> to manually set the prices of individual articles based on your own pricing strategy. Charge as little - or as much - as you want.', 'revenue-generator' ),
					[
						'b' => [],
					]
				)
			);
			?>
		</p>
		<p class="rev-gen-preview-main-info-modal-message">
			<?php
			printf(
				wp_kses(
					__(
						'If you select <b>Dynamic Pricing</b>, LaterPay’s AI will “dynamically” adjust the price based on our own data, analytics and algorithms based on the length of each article.', 'revenue-generator' ),
					[
						'b' => [],
					]
				)
			);
			?>
		</p>
	</div>
</script>

<!-- Template for paywall removal confirmation. -->
<script type="text/template" id="tmpl-revgen-remove-paywall">
	<div class="rev-gen-preview-main-remove-paywall">
		<h4 class="rev-gen-preview-main-remove-paywall-title"><?php esc_html_e( 'Are you sure you want to remove the paywall.', 'revenue-generator' ); ?></h4>
		<p class="rev-gen-preview-main-remove-paywall-message">
			<?php
			esc_html_e( 'This content will be visible to all users.', 'revenue-generator' );
			?>
		</p>
		<div class="rev-gen-preview-main-remove-paywall-buttons">
			<button id="rg_js_removePaywall" class="rev-gen-preview-main-remove-paywall-buttons-dark">
				<?php esc_html_e( 'Yes, remove Paywall', 'revenue-generator' ); ?>
			</button>
			<button id="rg_js_cancelPaywallRemoval" class="rev-gen-preview-main-remove-paywall-buttons-light">
				<?php esc_html_e( 'No, keep Paywall', 'revenue-generator' ); ?>
			</button>
		</div>
	</div>
</script>

<!-- Template for action to add paywall. -->
<script type="text/template" id="tmpl-revgen-add-paywall">
	<div class="rev-gen-preview-main--paywall-actions-add">
		<p>
			<?php esc_html_e( 'You don’t have a paywall on this page - all content will be publicly visible.', 'revenue-generator' ); ?>
		</p>
		<button id="rj_js_addNewPaywall" data-preview-id="">
			<?php esc_html_e( 'Add Paywall', 'revenue-generator' ); ?>
		</button>
	</div>
</script>

<!-- Template for account activation modal. -->
<script type="text/template" id="tmpl-revgen-account-activation-modal">
	<div class="rev-gen-preview-main-account-modal">
		<span class="rev-gen-preview-main-account-modal-cross">X</span>
		<div class="rev-gen-preview-main-account-modal-action">
			<h4 class="rev-gen-preview-main-account-modal-action-title"><?php esc_html_e( 'You’re almost done!', 'revenue-generator' ); ?></h4>
			<span class="rev-gen-preview-main-account-modal-action-info"><?php esc_html_e( 'To make sure you get your revenues, we need you to connect your LaterPay account.', 'revenue-generator' ); ?></span>
			<div class="rev-gen-preview-main-account-modal-actions">
				<button id="rg_js_connectAccount" class="rev-gen-preview-main-account-modal-actions-dark">
					<?php esc_html_e( 'Connect Account', 'revenue-generator' ); ?>
				</button>
				<button id="rg_js_signUp" class="rev-gen-preview-main-account-modal-actions-light">
					<?php esc_html_e( 'Signup', 'revenue-generator' ); ?>
				</button>
				<a href="https://support.laterpay.net/what-is-laterpay/" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Learn more', 'revenue-generator' ); ?></a>
			</div>
		</div>
		<div class="rev-gen-preview-main-account-modal-fields">
			<h5 class="rev-gen-preview-main-account-modal-fields-title"><?php esc_html_e( 'Connect your account to activate paywall', 'revenue-generator' ); ?></h5>
			<input class="rev-gen-preview-main-account-modal-fields-email" type="email" placeholder="<?php esc_attr_e( 'Email', 'revenue-generator' ); ?>" />
			<input class="rev-gen-preview-main-account-modal-fields-password" type="password" placeholder="<?php esc_attr_e( 'Password', 'revenue-generator' ); ?>" />
			<div class="rev-gen-preview-main-account-modal-actions">
				<button disabled="disabled" id="rg_js_verifyAccount" class="rev-gen-preview-main-account-modal-actions-dark">
					<?php esc_html_e( 'Connect Account', 'revenue-generator' ); ?>
				</button>
				<p>
					<?php esc_html_e( 'Don’t have an account?', 'revenue-generator' ); ?>
					<a id="rg_js_activateSignup" href="#"><?php esc_html_e( 'Signup', 'revenue-generator' ); ?></a>
				</p>
			</div>
		</div>
	</div>
</script>
