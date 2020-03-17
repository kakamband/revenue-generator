<?php
/**
 * Revenue Generator Plugin Fronted Post Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use LaterPay\Revenue_Generator\Inc\Post_Types\Paywall;
use LaterPay\Revenue_Generator\Inc\Post_Types\Subscription;
use LaterPay\Revenue_Generator\Inc\Post_Types\Time_Pass;
use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend_Post
 */
class Frontend_Post {

	use Singleton;

	/**
	 * Merchant region.
	 *
	 * @var string
	 */
	protected $merchant_region;

	/**
	 * Merchant currency.
	 *
	 * @var string
	 */
	protected $merchant_currency;

	/**
	 * Merchant API key.
	 *
	 * @var string
	 */
	protected $merchant_api_key;

	/**
	 * Store common values used in the plugin.
	 *
	 * @var array Common values used for api related info throughout the plugin.
	 */
	public static $connector_scripts = [
		'EU' => [
			'sandbox' => [
				'us' => 'https://connector-script.laterpay.net/3.12.1/eu/sbx/app-en-us.js',
				'eu' => 'https://connector-script.laterpay.net/3.12.1/eu/sbx/app-de-de.js'
			],
			'live'    => [
				'us' => 'https://connector-script.laterpay.net/3.12.1/eu/prod/app-en-us.js',
				'eu' => 'https://connector-script.laterpay.net/3-stable/eu/prod/app-de-de.js'
			]
		],
		'US' => [
			'sandbox' => [
				'us' => 'https://connector-script.uselaterpay.com/3.12.1/us/sbx/app-en-us.js',
				'eu' => 'https://connector-script.uselaterpay.com/3.12.1/us/sbx/app-de-de.js'
			],
			'live'    => [
				'us' => 'https://connector-script.uselaterpay.com/3.12.1/us/prod/app-en-us.js',
				'eu' => 'https://connector-script.uselaterpay.com/3.12.1/us/prod/app-de-de.js'
			]
		],
	];

	/**
	 * Class Client_Account construct method.
	 */
	protected function __construct() {
		$client_account_instance = Client_Account::get_instance();
		$global_options          = Config::get_global_options();
		$this->merchant_region   = $global_options['merchant_region'];
		$this->merchant_currency = 'US' === $this->merchant_region ? 'USD' : 'EUR';
		$merchant_credentials    = $client_account_instance->get_merchant_credentials();
		if ( ! empty( $merchant_credentials['merchant_key'] ) ) {
			$this->merchant_api_key = $merchant_credentials['merchant_key'];
		}
		$this->setup_hooks();
	}

	/**
	 * Setup options.
	 */
	protected function setup_hooks() {
		add_action( 'wp_enqueue_scripts', [ $this, 'register_connector_assets' ] );
		add_filter( 'wp_head', [ $this, 'add_connector_config' ] );
		add_filter( 'the_content', [ $this, 'revenue_generator_post_content' ] );
	}

	public function add_connector_config() {
		if ( is_singular( Post_Types::get_allowed_post_types() ) ) {
			$post_payload_data = $this->get_post_payload();
			?>
			<script type="text/javascript">
				function revenueGeneratorHideTeaserContent() {
					document.querySelector('.lp-hide-me').style.display = 'none';
				}
			</script>

			<!-- LaterPay Connector In-Page Configuration -->
			<script type="application/json" id="laterpay-connector">
				{
					"callbacks": {
						"onUserHasAccess": "revenueGeneratorHideTeaserContent"
					}
				}
			</script>
			<script type="application/json" id="laterpay-connector">
				<?php
				/* phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- added json string is secure and escaped.*/
				echo $post_payload_data['payload'];
				?>
			</script>
			<meta property="laterpay:connector:config_token" content="
			<?php
			/* phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- added token string is secure and escaped. */
			echo $post_payload_data['token'];
			?>"
			/>
			<?php
		}
	}

	public function register_connector_assets() {
		if ( empty( $this->merchant_region ) ) {
			return;
		}

		$region_connectors     = self::$connector_scripts[ $this->merchant_region ];
		$region_connector_urls = $region_connectors['sandbox']; // @todo make it live after testing.

		// @todo make sure to select eu based on locale, once upstream LaterPay starts supporting them.
		$connector_url = $region_connector_urls['us'];

		if ( is_singular( Post_Types::get_allowed_post_types() ) ) {
			wp_enqueue_script(
				'revenue-generator-classic-connector',
				$connector_url,
				[],
				false,
				true
			);
		}
	}

	public function revenue_generator_post_content( $post_content ) {
		// Bail early, if unsupported post type.
		if ( ! is_singular( Post_Types::get_allowed_post_types() ) ) {
			return $post_content;
		}

		$teaser                         = '<div class="lp-hide-me" data-lp-replacement-content>%s</div>';
		$revenue_generator_paid_wrapper = '<div  data-lp-show-on-access>%s</div>';

		return sprintf( $revenue_generator_paid_wrapper, $post_content );
	}

	private function covert_to_connector_purchase_option( $purchase_option, $type, $entity_id ) {
		$purchase_option_revenue = 'ppu' === $purchase_option['revenue'] ? 'pay_later' : 'pay_now';
		$merchant_currency       = $this->merchant_currency;
		// 'description' => empty( $purchase_option['description'] ) ?
		// esc_html__( 'You\'ll only be charged once you\'ve reached $5.', 'revenue-generator' ) :
		// $purchase_option['description'],
		if ( 'individual' === $type ) {
			return [
				'article_id'  => 'article_' . $entity_id,
				'price'       => [
					'amount'        => Config::get_connector_price( $purchase_option['price'] ),
					'currency'      => $merchant_currency,
					'payment_model' => $purchase_option_revenue,
				],
				'sales_model' => 'single_purchase',
				'title'       => empty( $purchase_option['title'] ) ? esc_html__( 'Access Article Now', 'revenue-generator' ) : $purchase_option['title'],
			];
		} elseif ( 'timepass' === $type ) {
			return [
				'article_id'  => 'tlp_' . $entity_id,
				'price'       => [
					'amount'        => Config::get_connector_price( $purchase_option['price'] ),
					'currency'      => $merchant_currency,
					'payment_model' => $purchase_option_revenue,
				],
				'sales_model' => 'timepass',
				'title'       => $purchase_option['title'],
				'description' => $purchase_option['description'],
				'expiry'      => [
					'unit'  => $purchase_option['duration'],
					'value' => $purchase_option['period']
				]
			];
		} else {
			return [
				'article_id'  => 'sub_' . $entity_id,
				'price'       => [
					'amount'        => Config::get_connector_price( $purchase_option['price'] ),
					'currency'      => $merchant_currency,
					'payment_model' => $purchase_option_revenue,
				],
				'sales_model' => 'subscription',
				'title'       => $purchase_option['title'],
				'description' => $purchase_option['description'],
				'expiry'      => [
					'unit'  => $purchase_option['duration'],
					'value' => $purchase_option['period']
				]
			];
		}
	}

	private function get_post_payload() {
		$rg_post          = get_post();
		$paywall_instance = Paywall::get_instance();
		$paywall_id       = $paywall_instance->get_connected_paywall_by_post( $rg_post->ID );
		$purchase_options = [];

		// If post doesn't have an individual paywall, check for paywall on categories.
		if ( empty( $paywall_id ) ) {
			$post_terms = wp_get_post_categories( $rg_post->ID );
			if ( ! empty( $post_terms ) ) {
				$paywall_id = $paywall_instance->get_connected_paywall_by_categories( $post_terms );
			}
		} else {
			$purchase_options_data = $paywall_instance->get_purchase_option_data_by_paywall_id( $paywall_id );
			if ( ! empty( $purchase_options_data ) ) {
				$paywall_title         = $purchase_options_data['title'];
				$paywall_description   = $purchase_options_data['description'];
				$paywall_options_order = $purchase_options_data['order'];
				if ( ! empty( $paywall_options_order ) ) {
					if ( ! empty( $paywall_options_order['individual'] ) ) {
						$order                      = $paywall_options_order['individual'];
						$individual_purchase_option = $paywall_instance->get_individual_purchase_option_data( $paywall_id );
						if ( ! empty( $individual_purchase_option ) ) {
							$individual_option              = $this->covert_to_connector_purchase_option( $individual_purchase_option, 'individual', $rg_post->ID );
							$purchase_options[ $order - 1 ] = $individual_option;
						}
					}

					$time_pass_instance = Time_Pass::get_instance();
					$time_pass_ids      = $time_pass_instance->get_time_pass_ids( array_keys( $paywall_options_order ) );
					if ( ! empty( $time_pass_ids ) ) {
						foreach ( $time_pass_ids as $time_pass_id ) {
							$order                          = $paywall_options_order[ 'tlp_' . $time_pass_id ];
							$timepass_purchase_option       = $time_pass_instance->get_time_pass_by_id( $time_pass_id );
							$timepass_option                = $this->covert_to_connector_purchase_option( $timepass_purchase_option, 'timepass', $time_pass_id );
							$purchase_options[ $order - 1 ] = $timepass_option;
						}
					}

					$subscription_instance = Subscription::get_instance();
					$subscription_ids      = $subscription_instance->get_subscription_ids( array_keys( $paywall_options_order ) );
					if ( ! empty( $subscription_ids ) ) {
						foreach ( $subscription_ids as $subscription_id ) {
							$order                          = $paywall_options_order[ 'sub_' . $subscription_id ];
							$subscription_purchase_option   = $subscription_instance->get_subscription_by_id( $subscription_id );
							$subscription_option            = $this->covert_to_connector_purchase_option( $subscription_purchase_option, 'subscription', $subscription_id );
							$purchase_options[ $order - 1 ] = $subscription_option;
						}
					}
				}
			}
		}

		$payload = wp_json_encode( [
			'purchase_options' => $purchase_options,
			'appearance'       => [
				'purchaseOverlay' => [
					'variant' => 'raw-white'
				]
			],
		] );


		return [
			'payload' => $payload,
			'token'   => $this->get_signed_token( $payload )
		];
	}

	/**
	 * Create signed token for in page connector configuration.
	 *
	 * @return string
	 */
	private function get_signed_token( $payload ) {
		$jwt_header         = wp_json_encode( [ 'typ' => 'JWT', 'alg' => 'HS256' ] );
		$base64UrlHeader    = $this->base64url_encode( $jwt_header );
		$base64UrlPayload   = $this->base64url_encode( $payload );
		$signature          = hash_hmac( 'sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->merchant_api_key, true );
		$base64UrlSignature = $this->base64url_encode( $signature );
		$token              = $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;

		return $token;
	}

	/**
	 * From https://base64.guru/developers/php/examples/base64url
	 *
	 * @param $data
	 *
	 * @return bool|string
	 */
	private function base64url_encode( $data ) {
		// First of all you should encode $data to Base64 string
		$b64 = base64_encode( $data );
		// Make sure you get a valid result, otherwise, return FALSE, as the base64_encode() function do
		if ( $b64 === false ) {
			return false;
		}
		// Convert Base64 to Base64URL by replacing “+” with “-” and “/” with “_”
		$url = strtr( $b64, '+/', '-_' );

		// Remove padding character from the end of line and return the Base64URL result
		return rtrim( $url, '=' );
	}

}
