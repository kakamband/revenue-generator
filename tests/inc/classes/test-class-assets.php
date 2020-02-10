<?php

namespace LaterPay\Revenue_Generator\Tests;

use LaterPay\Revenue_Generator\Inc\Admin;
use LaterPay\Revenue_Generator\Inc\Assets;

/**
 * Unit test cases for \LaterPay\Revenue_Generator\Inc\Assets
 *
 * @coversDefaultClass \LaterPay\Revenue_Generator\Inc\Assets
 *
 * @package revenue-generator
 */
class Test_Assets extends \WP_UnitTestCase {

	/**
	 * Plugin Class Instance.
	 *
	 * @var Assets
	 */
	protected $_instance = false;

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Assets.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Assets::get_instance();
	}

	/**
	 * @covers ::__construct
	 * @covers ::setup_hooks
	 */
	public function test_construct() {

		Utility::invoke_method( $this->_instance, '__construct' );

		// Check all added hooks exist.
		$hooks = [
			[
				'type'     => 'action',
				'name'     => 'admin_enqueue_scripts',
				'priority' => 10,
				'function' => 'register_scripts',
			],
			[
				'type'     => 'action',
				'name'     => 'admin_enqueue_scripts',
				'priority' => 11,
				'function' => 'load_scripts',
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

	/**
	 * @covers ::register_scripts
	 * @covers ::load_scripts
	 */
	public function test_register_scripts() {

		$current_user = get_current_user_id();
		wp_set_current_user( $this->factory()->user->create( array( 'role' => 'administrator' ) ) );
		Utility::invoke_method( Admin::get_instance(), 'revenue_generator_register_page' );
		$admin_page_url = home_url() . '/wp-admin/admin.php?page=revenue-generator';
		$this->assertEquals(
			$admin_page_url,
			menu_page_url( 'revenue-generator', false ), 'Revenue Generator page not created'
		);
		wp_set_current_user( $current_user );
		set_current_screen();
		set_current_screen( 'toplevel_page_revenue-generator' );

		// Verify script and style registration.
		Utility::invoke_method( $this->_instance, 'register_scripts' );
		$this->assertTrue( wp_script_is( 'revenue-generator', 'registered' ) );
		$this->assertTrue( wp_style_is( 'revenue-generator', 'registered' ) );

		// Verify script and style enqueue.
		Utility::invoke_method( $this->_instance, 'load_scripts' );
		$this->assertTrue( wp_script_is( 'revenue-generator', 'enqueued' ) );
		$this->assertTrue( wp_style_is( 'revenue-generator', 'enqueued' ) );
	}
}
