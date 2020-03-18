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
	 * Store common values used in the plugin.
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
		$region_endpoints      = self::$connector_endpoints[ $region ];
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
	 * Handle account verification.
	 *
	 * @return bool
	 */
	private function test_sample_purchase() {
		// Request to fetch endpoint, and add home url as origin.
		$purchase_url = $this->build_test_purchase_url();
		$home_url     = get_home_url();
		$response     = wp_remote_get( $purchase_url, [
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
	private function build_test_purchase_url() {
		// Demo params to verify merchant domain.
		$purchase_url_params = build_query( [
			'article_title' => rawurlencode( 'Revenue Generator Demo Page' ),
			'article_url'   => rawurlencode( get_home_url() )
		] );

		return $this->get_api_fetch_url() . '?' . $purchase_url_params;
	}

	/**
	 * Get API fetch URL to verify whitelisted merchant domain.
	 *
	 * @return string
	 */
	private function get_api_fetch_url() {
		return $this->web_root . '/api/v2/fetch';
	}
}
