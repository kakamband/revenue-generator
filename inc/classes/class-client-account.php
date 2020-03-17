<?php
/**
 * Revenue Generator Plugin Client Account Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Class Client_Account
 */
class Client_Account {

	use Singleton;

	/**
	 * API key.
	 *
	 * @var string
	 */
	protected $merchant_api_key;

	/**
	 * Dialog API root
	 *
	 * @var string
	 */
	protected $web_root;

	/**
	 * Merchant ID.
	 *
	 * @var string
	 */
	protected $merchant_id;

	/**
	 * Merchant region.
	 *
	 * @var string
	 */
	protected $merchant_region;

	/**
	 * Algorithm used to sign the key.
	 *
	 * @var string
	 */
	protected $secret_algo = 'sha224';


	/**
	 * Store common values used in the plugin.
	 *
	 * @var array Common values used for api related info throughout the plugin.
	 */
	public static $api_endpoints = [
		'EU' => [
			'sandbox' => 'https://web.sandbox.laterpaytest.net',
			'live'    => 'https://web.laterpay.net',
		],
		'US' => [
			'sandbox' => 'https://web.sandbox.uselaterpaytest.com',
			'live'    => 'https://web.uselaterpay.com',
		],
	];

	/**
	 * Class Client_Account construct method.
	 */
	protected function __construct() {
		$this->setup_options();
	}

	/**
	 * Setup account default options.
	 */
	protected function setup_options() {
		// Fresh install.
		if ( false === get_option( 'lp_rg_merchant_credentials' ) ) {
			// Set default data for merchant credentials.
			update_option( 'lp_rg_merchant_credentials',
				[
					'merchant_id'  => '',
					'merchant_key' => ''
				]
			);
		}
	}

	/**
	 * Returns merchant credentials.
	 *
	 * @return array
	 */
	public function get_merchant_credentials() {
		return get_option( 'lp_rg_merchant_credentials', [] );
	}

	/**
	 * Validate provided merchant credentials and make test purchase.
	 *
	 * @return bool
	 */
	public function validate_merchant_account() {
		$global_options = Config::get_global_options();
		$region         = $global_options['merchant_region'];

		// Bail early, if no region set.
		if ( empty( $region ) ) {
			return false;
		}

		// Setup web root for API Call.
		$this->merchant_region = $region;
		$region_endpoints      = self::$api_endpoints[ $region ];
		$this->web_root        = $region_endpoints['sandbox']; // @todo make it live after testing.

		// Setup merchant credentials.
		$merchant_credentials = self::get_merchant_credentials();
		if ( ! empty( $merchant_credentials['merchant_id'] ) ) {
			$this->merchant_id = $merchant_credentials['merchant_id'];
		}

		if ( ! empty( $merchant_credentials['merchant_key'] ) ) {
			$this->merchant_api_key = $merchant_credentials['merchant_key'];
		}

		return $this->test_sample_purchase();
	}

	/**
	 * Handle test purchase.
	 *
	 * @return bool
	 */
	private function test_sample_purchase() {
		$purchase_url    = $this->build_test_purchase_url();
		$response        = wp_remote_get( $purchase_url );
		$response_body   = wp_remote_retrieve_body( $response );
		$response_status = wp_remote_retrieve_response_code( $response );
		if ( ! empty( $response_status ) && 200 === $response_status ) {
			preg_match( '/purchaseURL:(.*),/m', $response_body, $matches, PREG_OFFSET_CAPTURE, 0 );
			if ( ! empty( $matches[1] ) ) {
				$api_purchase_data = $matches[1];
				$api_purchase_url  = $api_purchase_data[0];
				preg_match( '/\/api\/([a-z0-9]+)\//m', $api_purchase_url, $api_matches, PREG_OFFSET_CAPTURE, 0 );

				if ( ! empty( $api_matches[1] ) ) {
					$api_string_data = $api_matches[1];
					$api_string      = $api_string_data[0];
					$api_request_url = $this->web_root . '/api/' . $api_string;
					$api_response    = wp_remote_post( $api_request_url, [
						'body' => '{}',
					] );
					// @todo verify purchase.
				}

				return true;
			}
		}

		return false;
	}

	/**
	 * Create test purchase url for test progress.
	 *
	 * @return string
	 */
	private function build_test_purchase_url() {
		$pricing             = 'US' === $this->merchant_region ? 'USD' : 'EUR';
		$purchase_url_params = build_query( array(
			'article_id' => 'wordpress_plugin_account_verification',
			'cp'         => $this->merchant_id,
			'pricing'    => $pricing . '0',
			'renewable'  => '0',
			'title'      => rawurlencode( 'Account Verification Purchase' ),
			'ts'         => time(),
			'url'        => rawurlencode( get_home_url() )
		) );

		$encoded_params = urlencode( $purchase_url_params );
		$message        = 'GET&' . urlencode( $this->get_dialog_add_url() ) . '&' . $encoded_params;
		$hmac           = hash_hmac( $this->secret_algo, $message, $this->merchant_api_key );

		return $this->get_dialog_add_url() . '?' . $purchase_url_params . '&hmac=' . $hmac;
	}

	/**
	 * Get dialog add URL.
	 *
	 * @return string
	 */
	private function get_dialog_add_url() {
		return $this->web_root . '/dialog/add';
	}
}
