<?php

namespace LaterPay\Revenue_Generator\Tests;

use LaterPay\Revenue_Generator\Inc\Config;

/**
 * Unit test cases for \LaterPay\Revenue_Generator\Inc\Config
 *
 * @coversDefaultClass \LaterPay\Revenue_Generator\Inc\Config
 *
 * @package revenue-generator
 */
class Test_Config extends \WP_UnitTestCase {

	/**
	 * Plugin Class Instance.
	 *
	 * @var Config
	 */
	protected $_instance = false;

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Config.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Config::get_instance();
	}

	/**
	 * @covers ::__construct
	 * @covers ::setup_options
	 * @covers ::get_global_options
	 */
	public function test_construct() {

		// Check if plugin version and global options are defined.
		delete_option( 'lp_rg_version' );
		delete_option( 'lp_rg_global_options' );
		$this->assertEquals( get_option( 'lp_rg_version', false ), false, 'Plugin options is not set.' );
		$plugin_global_options = get_option( 'lp_rg_global_options', false );
		$this->assertEquals( $plugin_global_options, false, 'Plugin options is not set.' );

		// Check if plugin version and global options are defined.
		Utility::invoke_method( $this->_instance, '__construct' );
		$this->assertEquals( get_option( 'lp_rg_version', false ), REVENUE_GENERATOR_VERSION, 'Plugin options is not set.' );
		delete_option( 'lp_rg_version' );

		// Check if plugin version and global options are defined.
		Utility::invoke_method( $this->_instance, 'setup_options' );
		$this->assertEquals( get_option( 'lp_rg_version', false ), REVENUE_GENERATOR_VERSION, 'Plugin options is not set.' );
		$plugin_global_options = get_option( 'lp_rg_global_options', false );
		$this->assertarrayHasKey(
			'average_post_publish_count',
			$plugin_global_options,
			'pricing default for low post count does not exist'
		);

		// Check if globa otpions can be retrieved.
		$global_options = Utility::invoke_method( $this->_instance, 'get_global_options' );
		$this->assertarrayHasKey(
			'average_post_publish_count',
			$global_options,
			'pricing default for low post count does not exist'
		);
	}

	/**
	 * @covers ::get_pricing_defaults
	 * @covers ::get_price_defaults
	 */
	public function test_get_pricing_defaults() {

		// Test all options.
		$pricing_defaults = Utility::invoke_method( $this->_instance, 'get_pricing_defaults', [] );
		$this->assertarrayHasKey(
			'low',
			$pricing_defaults,
			'pricing default for low post count does not exist'
		);

		$this->assertarrayHasKey(
			'high',
			$pricing_defaults,
			'pricing default for high post count does not exist'
		);

		// Test 'high' pricing options.
		$pricing_high_defaults = Utility::invoke_method( $this->_instance, 'get_pricing_defaults', [ 'high' ] );

		$this->assertarrayHasKey(
			'subscription',
			$pricing_high_defaults,
			'pricing default for subscription in high post count does not exist'
		);

		$subscription_pricing = $pricing_high_defaults['subscription'];
		$this->assertEquals( $subscription_pricing['price']['amount'], 499 );

		// Test without options.
		$pricing_high_defaults = Utility::invoke_method( $this->_instance, 'get_price_defaults', [] );

		$this->assertarrayHasKey(
			'low',
			$pricing_high_defaults,
			'pricing default for low post count does not exist'
		);

		$this->assertarrayHasKey(
			'high',
			$pricing_high_defaults,
			'pricing default for high post count does not exist'
		);
	}

	/**
	 * @covers ::get_connector_price
	 */
	public function test_get_connector_price() {
		$price = Utility::invoke_method( $this->_instance, 'get_connector_price', [ 1.49 ] );
		$this->assertEquals( $price, 149 );
	}
}
