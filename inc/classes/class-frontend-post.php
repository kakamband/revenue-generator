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

	/**
	 * Add connector config required for adding paywall on the post.
	 */
	public function add_connector_config() {
		if ( is_singular( Post_Types::get_allowed_post_types() ) ) {
			$post_payload_data = $this->get_post_payload();
			$appearance_config = $this->get_purchase_overlay_config();
			if ( ! empty( $post_payload_data ) ) {
				?>
				<script type="application/json" id="laterpay-connector"><?php
					/* phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- added json string is secure and escaped.*/
					echo $appearance_config;
					?></script>p
				<script type="text/javascript">
					function revenueGeneratorHideTeaserContent() {
						document.querySelector('.lp-teaser-content').style.display = 'none';
					}
				</script>
				<!-- LaterPay Connector In-Page Configuration for callbacks -->
				<script type="application/json" id="laterpay-connector">
					{
						"callbacks": {
							"onUserHasAccess": "revenueGeneratorHideTeaserContent"
						}
					}
				</script>
				<!-- LaterPay Connector In-Page Configuration for purchase options -->
				<script type="application/json" id="laterpay-connector"><?php
					/* phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- added json string is secure and escaped.*/
					echo $post_payload_data['payload'];
					?></script>
				<meta property="laterpay:connector:config_token" content="<?php echo esc_attr( $post_payload_data['token'] ); ?>" />
				<?php
			} else {
				wp_dequeue_script( 'revenue-generator-classic-connector' );
			}
		}
	}

	/**
	 * Enqueue the connector script required for paywall.
	 */
	public function register_connector_assets() {
		if ( empty( $this->merchant_region ) ) {
			return;
		}

		$region_connectors     = self::$connector_scripts[ $this->merchant_region ];
		$region_connector_urls = $region_connectors['sandbox']; // @todo make it live after testing.

		// @todo make sure to select eu based on locale, once upstream LaterPay starts supporting them.
		$connector_url = $region_connector_urls['us'];

		if ( is_singular( Post_Types::get_allowed_post_types() ) ) {
			$assets_instance = Assets::get_instance();

			// Enqueue connector script based on region and environment.
			wp_enqueue_script(
				'revenue-generator-classic-connector',
				$connector_url,
				[],
				false,
				true
			);

			// Enqueue frontend styling for purchase overlay.
			wp_enqueue_style(
				'revenue-generator-frontend',
				REVENUE_GENERATOR_BUILD_URL . 'css/revenue-generator-frontend.css',
				[],
				$assets_instance->get_asset_version( 'css/revenue-generator-frontend.css' )
			);
		}
	}

	/**
	 * Add revenue generator wrapper to add paywall attributes.
	 *
	 * @param string $post_content Post content.
	 *
	 * @return string
	 */
	public function revenue_generator_post_content( $post_content ) {
		// Bail early, if unsupported post type.
		if ( ! is_singular( Post_Types::get_allowed_post_types() ) ) {
			return $post_content;
		}

		$teaser_tempalte = '<div class="lp-teaser-content" data-lp-replacement-content>%s</div>';
		$teaser          = '';
		$rg_post         = get_post();

		if ( ! empty( $rg_post ) ) {
			if ( ! empty( $rg_post->post_excerpt ) ) {
				$teaser = sprintf( $teaser_tempalte, $rg_post->post_excerpt );
			} else {
				$teaser_content = Utility::truncate(
					preg_replace( '/\s+/', ' ', $post_content ),
					Utility::determine_number_of_words( $post_content ),
					[
						'html'  => true,
						'words' => true,
					]
				);
				$teaser         = sprintf( $teaser_tempalte, $teaser_content );
			}
		}

		$post_content = sprintf( '<div class="lp-main-content" data-lp-show-on-access>%s</div>', $post_content );
		if ( ! empty( $teaser ) ) {
			$rg_post_content = $teaser . $post_content;
		} else {
			$rg_post_content = $post_content;
		}

		return $rg_post_content;
	}

	/**
	 * Convert purchase option data to connector config.
	 *
	 * @param array  $purchase_option Purchase option data.
	 * @param string $type            Option type.
	 * @param int    $entity_id       Entity id.
	 *
	 * @return array
	 */
	private function covert_to_connector_purchase_option( $purchase_option, $type, $entity_id ) {
		$purchase_option_revenue = 'ppu' === $purchase_option['revenue'] ? 'pay_later' : 'pay_now';
		$merchant_currency       = $this->merchant_currency;
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

	/**
	 * Create appearance configuration for the purchase overlay.
	 *
	 * @return false|string
	 */
	private function get_purchase_overlay_config() {
		return wp_json_encode( [
			'appearance' => [
				'variant'             => 'raw-white',
				'primaryColor'        => '#2e2e2e',
				'secondaryColor'      => '#ebebeb',
				'purchaseButtonColor' => '#2e2e2e',
				'showPaymentMethods'  => false,
			],
		] );
	}

	/**
	 * Create final config for supported post.
	 *
	 * @return array
	 */
	private function get_post_payload() {
		// Required class instances.
		$config_data           = Config::get_global_options();
		$post_types            = Post_Types::get_instance();
		$paywall_instance      = Paywall::get_instance();
		$subscription_instance = Subscription::get_instance();
		$time_pass_instance    = Time_Pass::get_instance();

		// Post and paywall data.
		$rg_post                = get_post();
		$paywall_id             = $paywall_instance->get_connected_paywall_by_post( $rg_post->ID );
		$paywall_data           = $paywall_instance->get_purchase_option_data_by_paywall_id( $paywall_id );
		$purchase_options       = [];
		$final_purchase_options = [];

		// @todo These are default options to be used when in page script is available for title and description.
		$paywall_title       = esc_html__( 'Keep Reading', 'revenue-generator' );
		$paywall_description = esc_html( sprintf( 'Support %s to get access to this content and more.', esc_url( get_home_url() ) ) );

		// Get individual article pricing based on post content word count, i.e "tier" for dynamic pricing option.
		$formatted_post_data       = $post_types->get_formatted_post_data( $rg_post->ID );
		$post_tier                 = empty( $formatted_post_data['post_content'] ) ? 'tier_1' : $post_types->get_post_tier( $formatted_post_data['post_content'] );
		$purchase_options_all      = Config::get_pricing_defaults( $config_data['average_post_publish_count'] );
		$post_dynamic_pricing_data = $purchase_options_all['single_article'][ $post_tier ];

		// If post doesn't have an individual paywall, check for paywall on categories.
		if ( ! $this->is_paywall_active( $paywall_data ) ) {
			// Check if paywall is found on post categories.
			$post_terms = wp_get_post_categories( $rg_post->ID );
			if ( ! empty( $post_terms ) ) {
				$paywall_id   = $paywall_instance->get_connected_paywall_by_categories( $post_terms );
				$paywall_data = $paywall_instance->get_purchase_option_data_by_paywall_id( $paywall_id );

				// If paywall is no found on post categories, check for paywalls on excluded categories.
				if ( ! $this->is_paywall_active( $paywall_data ) ) {
					$paywall_id   = $paywall_instance->get_connected_paywall_in_excluded_categories( $post_terms );
					$paywall_data = $paywall_instance->get_purchase_option_data_by_paywall_id( $paywall_id );
				}
			}
		}

		// If no paywall found in categories and individual post, check for paywall applied on all posts as last resort.
		if ( ! $this->is_paywall_active( $paywall_data ) ) {
			$paywall_id = $paywall_instance->get_paywall_for_all_posts();
		}

		// Setup purchase options.
		$paywall_data = $paywall_instance->get_purchase_option_data_by_paywall_id( $paywall_id );
		if ( $this->is_paywall_active( $paywall_data ) ) {
			$paywall_title         = $paywall_data['title'];
			$paywall_description   = $paywall_data['description'];
			$paywall_options_order = $paywall_data['order'];

			// Get global time passes and subscriptions.
			$active_time_pass_ids    = $time_pass_instance->get_active_time_pass_tokenized_ids();
			$active_subscription_ids = $subscription_instance->get_active_subscription_tokenized_ids();

			// Loop through each active time passes and add to paywall if not set already.
			foreach ( $active_time_pass_ids as $active_time_pass_id ) {
				if ( ! isset( $paywall_options_order[ $active_time_pass_id ] ) ) {
					$paywall_options_order[ $active_time_pass_id ] = end( $paywall_options_order ) + 1;
				}
			}

			// Loop through each active subscriptions and add to paywall if not set already.
			foreach ( $active_subscription_ids as $active_subscription_id ) {
				if ( ! isset( $paywall_options_order[ $active_subscription_id ] ) ) {
					$paywall_options_order[ $active_subscription_id ] = end( $paywall_options_order ) + 1;
				}
			}

			if ( ! empty( $paywall_options_order ) ) {
				if ( ! empty( $paywall_options_order['individual'] ) ) {
					$order                      = $paywall_options_order['individual'] - 1;
					$individual_purchase_option = $paywall_instance->get_individual_purchase_option_data( $paywall_id );
					if ( ! empty( $individual_purchase_option ) ) {
						if ( 'dynamic' === $individual_purchase_option['type'] ) {
							$individual_purchase_option['price']   = $post_dynamic_pricing_data['price'];
							$individual_purchase_option['revenue'] = $post_dynamic_pricing_data['revenue'];
						}
						$individual_option          = $this->covert_to_connector_purchase_option( $individual_purchase_option, 'individual', $rg_post->ID );
						$purchase_options[ $order ] = $individual_option;
					}
				}

				$time_pass_ids = $time_pass_instance->get_time_pass_ids( array_keys( $paywall_options_order ) );
				if ( ! empty( $time_pass_ids ) ) {
					foreach ( $time_pass_ids as $time_pass_id ) {
						$order                    = $paywall_options_order[ 'tlp_' . $time_pass_id ] - 1;
						$timepass_purchase_option = $time_pass_instance->get_time_pass_by_id( $time_pass_id );
						if ( ! empty( $timepass_purchase_option['is_active'] ) && 1 === absint( $timepass_purchase_option['is_active'] ) ) {
							$timepass_option            = $this->covert_to_connector_purchase_option( $timepass_purchase_option, 'timepass', $time_pass_id );
							$purchase_options[ $order ] = $timepass_option;
						}
					}
				}

				$subscription_ids = $subscription_instance->get_subscription_ids( array_keys( $paywall_options_order ) );
				if ( ! empty( $subscription_ids ) ) {
					foreach ( $subscription_ids as $subscription_id ) {
						$order                        = $paywall_options_order[ 'sub_' . $subscription_id ] - 1;
						$subscription_purchase_option = $subscription_instance->get_subscription_by_id( $subscription_id );
						if ( ! empty( $subscription_purchase_option['is_active'] ) && 1 === absint( $subscription_purchase_option['is_active'] ) ) {
							$subscription_option        = $this->covert_to_connector_purchase_option( $subscription_purchase_option, 'subscription', $subscription_id );
							$purchase_options[ $order ] = $subscription_option;
						}
					}
				}
			}
		}

		// Sort purchase options based on new order.
		ksort( $purchase_options );

		// This is done to avoid a mismatch in oder of paywall items.
		if ( ! empty( $purchase_options ) ) {
			foreach ( $purchase_options as $purchase_option ) {
				$final_purchase_options[] = $purchase_option;
			}
		}

		// Setup overlay configurations.
		if ( ! empty( $final_purchase_options ) ) {
			$payload = wp_json_encode( [
				'purchase_options'                 => $final_purchase_options,
				'ignore_database_single_purchases' => true,
				'ignore_database_subscriptions'    => true,
				'ignore_database_timepasses'       => true,
			] );

			return [
				'payload' => $payload,
				'token'   => $this->get_signed_token( $payload )
			];
		}

		return [];
	}

	/**
	 * Create signed token for in page connector configuration.
	 *
	 * @param string $payload Payload data array.
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
	 * From https://base64.guru/developers/php/examples/base64url.
	 *
	 * @param string $data Data to be encoded for connector.
	 *
	 * @return bool|string
	 */
	private function base64url_encode( $data ) {
		// First of all you should encode $data to Base64 string.
		$b64 = base64_encode( $data );
		// Make sure you get a valid result, otherwise, return FALSE, as the base64_encode() function do.
		if ( $b64 === false ) {
			return false;
		}
		// Convert Base64 to Base64URL by replacing “+” with “-” and “/” with “_”.
		$url = strtr( $b64, '+/', '-_' );

		// Remove padding character from the end of line and return the Base64URL result.
		return rtrim( $url, '=' );
	}

	/**
	 * Check if a paywall is active or not.
	 *
	 * @param array $paywall_data Paywall data.
	 *
	 * @return bool
	 */
	private function is_paywall_active( $paywall_data ) {
		return ( ! empty( $paywall_data ) && 1 === absint( $paywall_data['is_active'] ) ) ? true : false;
	}

}
