<?php

namespace LaterPay\Revenue_Generator\Tests;

use LaterPay\Revenue_Generator\Inc\Admin;

/**
 * Unit test cases for \LaterPay\Revenue_Generator\Inc\Admin
 *
 * @coversDefaultClass \LaterPay\Revenue_Generator\Inc\Admin
 *
 * @package revenue-generator
 */
class Test_Admin extends \WP_Ajax_UnitTestCase {

	/**
	 * Admin Class Instance.
	 *
	 * @var Admin
	 */
	protected $_instance = false;

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Admin.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Admin::get_instance();
	}

	/**
	 * @covers ::__construct
	 * @covers ::setup_hooks
	 * @covers ::revenue_generator_register_page
	 */
	public function test_construct() {

		Utility::invoke_method( $this->_instance, '__construct' );

		// Check all added hooks exist.
		$hooks = [
			[
				'type'     => 'action',
				'name'     => 'admin_menu',
				'priority' => 10,
				'function' => 'revenue_generator_register_page',
			],
			[
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_update_global_config',
				'priority' => 10,
				'function' => 'update_global_config',
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

		Utility::invoke_method( Admin::get_instance(), 'revenue_generator_register_page' );
		wp_set_current_user( $this->factory()->user->create( array( 'role' => 'administrator' ) ) );
		$admin_page_url = home_url() . '/wp-admin/admin.php?page=revenue-generator';
		$this->assertEquals(
			$admin_page_url,
			menu_page_url( 'revenue-generator', false ), 'Revenue Generator page not created'
		);
	}
}
