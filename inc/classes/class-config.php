<?php
/**
 * Revenue Generator Plugin Config Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Class Config
 */
class Config {

	use Singleton;

	/**
	 * Store common values used in the plugin.
	 *
	 * @var array Common values used throughout the plugin.
	 */
	public static $plugin_defaults = [
		'img_dir' => REVENUE_GENERATOR_BUILD_URL . 'img/'
	];

	/**
	 * Class Config construct method.
	 */
	protected function __construct() {
		$this->setup_options();
	}

	/**
	 * Setup plugin options.
	 */
	protected function setup_options() {
		// Check if plugin installation is fresh install.
		if ( false === get_option( 'lp_rg_version' ) ) {
			update_option( 'lp_rg_version', REVENUE_GENERATOR_VERSION );
		}

		// Fresh install.
		if ( false === get_option( 'lp_rg_global_options' ) ) {
			update_option( 'lp_rg_global_options',
				[
					'average_post_publish_count' => '',
					'merchant_currency'          => '',
					'is_tutorial_completed'      => 0,
					'current_tutorial_progress'  => ''
				]
			);
		}
	}

	/**
	 * Returns plugin global options.
	 *
	 * @return array
	 */
	public static function get_global_options() {
		return get_option( 'lp_rg_global_options', [] );
	}

	/**
	 * Get pricing default values for all types else for requested publish count.
	 *
	 * @param string $publish_count Get merchant post publish count.
	 *
	 * @return array|mixed
	 */
	public static function get_pricing_defaults( $publish_count = '' ) {
		$all_price_defaults = self::get_price_defaults();
		if ( ! empty( $publish_count ) ) {
			return $all_price_defaults[ $publish_count ];
		} else {
			return $all_price_defaults;
		}
	}

	/**
	 * Returns default pricing values.
	 *
	 * @return array
	 */
	protected static function get_price_defaults() {
		return [
			'low'  => [
				'single_article' => [
					'tier_1' => [ // 0-250 content length.
						'price' => [
							'amount'        => self::get_connector_price( 1.49 ),
							'payment_model' => 'pay_now'
						],
					],
					'tier_2' => [ // 251-500 content length.
						'price' => [
							'amount'        => self::get_connector_price( 2.49 ),
							'payment_model' => 'pay_now'
						],
					],
					'tier_3' => [ // 501+ content length.
						'price' => [
							'amount'        => self::get_connector_price( 4 ),
							'payment_model' => 'pay_now'
						],
					]
				],
				'time_pass'      => [
					'price'  => [
						'amount'        => self::get_connector_price( 2.49 ),
						'payment_model' => 'pay_now'
					],
					'expiry' => [
						'unit'  => 'd',
						'value' => '7'
					]
				],
				'subscription'   => [
					'price'  => [
						'amount'        => self::get_connector_price( 4.99 ),
						'payment_model' => 'pay_now'
					],
					'expiry' => [
						'unit'  => 'm',
						'value' => '1'
					]
				]
			],
			'high' => [
				'single_article' => [
					'tier_1' => [ // 0-250 content length.
						'price' => [
							'amount'        => self::get_connector_price( 0.49 ),
							'payment_model' => 'pay_later'
						],
					],
					'tier_2' => [ // 251-500 content length.
						'price' => [
							'amount'        => self::get_connector_price( 0.99 ),
							'payment_model' => 'pay_later'
						],
					],
					'tier_3' => [ // 501+ content length.
						'price' => [
							'amount'        => self::get_connector_price( 1.49 ),
							'payment_model' => 'pay_later'
						],
					]
				],
				'time_pass'      => [
					'price'  => [
						'amount'        => self::get_connector_price( 2.49 ),
						'payment_model' => 'pay_now'
					],
					'expiry' => [
						'unit'  => 'd',
						'value' => '7'
					]
				],
				'subscription'   => [
					'price'  => [
						'amount'        => self::get_connector_price( 4.99 ),
						'payment_model' => 'pay_now'
					],
					'expiry' => [
						'unit'  => 'm',
						'value' => '1'
					]
				]
			]
		];
	}

	/**
	 * Returns price value to work in connector config.
	 *
	 * @param float|int $price Price of the purchase option.
	 *
	 * @return float|int
	 */
	protected static function get_connector_price( $price ) {
		return $price * 100;
	}

}
