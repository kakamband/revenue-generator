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
	 * Connector endpoint root.
	 *
	 * @var string
	 */
	protected $connector_root;

	/**
	 * API endpoint root.
	 *
	 * @var string
	 */
	protected $api_root;

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
	 * Store connector endpoint used in the plugin.
	 *
	 * @var array Common values used for api related info throughout the plugin.
	 */
	public static $connector_endpoints = [
		'EU' => [
			'sandbox' => 'https://connector.sandbox.laterpaytest.net',
			'live'    => 'https://connector.laterpay.net',
		],
		'US' => [
			'sandbox' => 'https://connector.sandbox.uselaterpaytest.com',
			'live'    => 'https://connector.uselaterpay.com',
		],
	];

	/**
	 * Store api endpoints used in the plugin.
	 *
	 * @var array Common values used for api related info throughout the plugin.
	 */
	public static $api_endpoints = [
		'EU' => [
			'sandbox' => 'https://api.sandbox.laterpaytest.net',
			'live'    => 'https://api.laterpay.net/validatesignature',
		],
		'US' => [
			'sandbox' => 'https://api.sandbox.uselaterpaytest.com',
			'live'    => 'https://api.uselaterpay.com',
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
	 * Validate provided merchant credentials and make test sure domain is valid.
	 *
	 * @return bool
	 */
	public function validate_merchant_account() {
		$global_options = Config::get_global_options();
		$region         = $global_options['merchant_region'];

		// Setup web roots for API Call.
		$this->merchant_region = $region;

		// Bail early, if no region set.
		if ( empty( $region ) ) {
			return false;
		}

		$region_connector_endpoints = self::$connector_endpoints[ $region ];
		$region_api_endpoints       = self::$api_endpoints[ $region ];

		$this->connector_root = $region_connector_endpoints['sandbox']; // @todo make it live after testing.
		$this->api_root       = $region_api_endpoints['sandbox']; // @todo make it live after testing.

		// Setup merchant credentials.
		$merchant_credentials = self::get_merchant_credentials();
		if ( ! empty( $merchant_credentials['merchant_id'] ) ) {
			$this->merchant_id = $merchant_credentials['merchant_id'];
		}

		if ( ! empty( $merchant_credentials['merchant_key'] ) ) {
			$this->merchant_api_key = $merchant_credentials['merchant_key'];
		}

		// Check if account credentials are valid.
		$are_credentials_valid = $this->test_merchant_credentials();

		// If account credentials are valid, proceed to checking the merchant domain.
		if ( true === $are_credentials_valid ) {
			return $this->test_merchant_domain();
		} else {
			return false;
		}
	}

	/**
	 * Handle account verification.
	 *
	 * @return bool
	 */
	private function test_merchant_domain() {
		// Request to fetch endpoint, and add home url as origin.
		$fetch_url = $this->build_test_fetch_url();
		$home_url  = get_home_url();
		$response  = wp_remote_get( $fetch_url, [
			// phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout -- Request done only once during initial setup.
			'timeout' => 60,
			'headers' => [
				'Origin' => $home_url
			]
		] );

		// Check and verify allowed origin matches merchant domain.
		$allowed_origin_header = wp_remote_retrieve_header( $response, 'access-control-allow-origin' );

		if ( ! empty( $allowed_origin_header ) && $allowed_origin_header === $home_url ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Create url for test whitelisting of account.
	 *
	 * @return string
	 */
	private function build_test_fetch_url() {
		// Demo params to verify merchant domain.
		$fetch_url_params = build_query( [
			'article_title' => rawurlencode( 'Revenue Generator Demo Page' ),
			'article_url'   => rawurlencode( get_home_url() )
		] );

		return $this->get_api_fetch_url() . '?' . $fetch_url_params;
	}

	/**
	 * Handle account credentials validation.
	 *
	 * @return bool
	 */
	private function test_merchant_credentials() {
		$validate_signature_url = $this->build_validate_signature_url();
		$response               = wp_remote_get( $validate_signature_url );
		$response_body          = wp_remote_retrieve_body( $response );
		$response_status        = wp_remote_retrieve_response_code( $response );

		// Check if the request was successful and account is valid.
		if ( ! empty( $response_status ) && 200 === $response_status ) {
			// Check if current config is valid or not.
			$validation_data = json_decode( $response_body, true );
			if ( ! empty( $validation_data['is_valid'] ) && true === $validation_data['is_valid'] ) {
				return true;
			} else {
				return false;
			}
		}

		return false;
	}

	/**
	 * Create validate signature url for testing account credentials.
	 *
	 * @return string
	 */
	private function build_validate_signature_url() {
		$validation_url_params = build_query( [
			'cp'   => $this->merchant_id,
			'salt' => md5( microtime( true ) ),
			'ts'   => time(),
		] );
		$encoded_params        = urlencode( $validation_url_params );
		$message               = 'GET&' . urlencode( $this->get_validate_signature_url() ) . '&' . $encoded_params;
		$hmac                  = hash_hmac( $this->secret_algo, $message, $this->merchant_api_key );

		return $this->get_validate_signature_url() . '?' . $validation_url_params . '&hmac=' . $hmac;
	}

	/**
	 * Get API fetch URL to verify whitelisted merchant domain.
	 *
	 * @return string
	 */
	private function get_api_fetch_url() {
		return $this->connector_root . '/api/v2/fetch';
	}

	/**
	 * Get dialog add URL.
	 *
	 * @return string
	 */
	private function get_validate_signature_url() {
		return $this->api_root . '/validatesignature';
	}
}
