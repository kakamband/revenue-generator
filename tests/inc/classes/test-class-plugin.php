<?php

namespace LaterPay\Revenue_Generator\Tests;

use LaterPay\Revenue_Generator\Inc\Plugin;

/**
 * Unit test cases for \LaterPay\Revenue_Generator\Inc\Plugin
 *
 * @coversDefaultClass \LaterPay\Revenue_Generator\Inc\Plugin
 *
 * @package revenue-generator
 */
class Test_Plugin extends \WP_UnitTestCase {

	/**
	 * Plugin Class Instance.
	 *
	 * @var Plugin
	 */
	protected $_instance = false;

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Plugin.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Plugin::get_instance();
	}

	/**
	 * @covers ::__construct
	 * @covers ::setup_hooks
	 * @covers ::add_plugin_constants
	 * @covers ::load_textdomain
	 */
	public function test_construct() {

		Utility::invoke_method( $this->_instance, '__construct' );

		// Check all added hooks exist.
		$hooks = [
			[
				'type'     => 'action',
				'name'     => 'plugins_loaded',
				'priority' => 10,
				'function' => 'load_textdomain',
			],
		];

		// Check if hooks loaded.
		foreach ( $hooks as $hook ) {

			$this->assertEquals(
				$hook['priority'],
				call_user_func(
					sprintf( 'has_%s', $hook['type'] ),
					$hook['name'],
					array(
						$this->_instance,
						$hook['function'],
					)
				),
				sprintf( 'Plugins::setup_hooks() failed to register %1$s "%2$s" to %3$s()', $hook['type'], $hook['name'], $hook['function'] )
			);
		}

		// Check if plugin version constant is defined.
		$this->assertTrue( defined( 'REVENUE_GENERATOR_VERSION' ), 'Plugin version is not defined.' );
	}
}
