<?php
/**
 * PHPUnit tests for inc/classes/class-admin.php
 *
 * @author Milind More <milind.morel@rtcamp.com>
 *
 * @requires PHP 5.6
 *
 * @coversDefaultClass LaterPay\Revenue_Generator\Inc\Admin
 *
 * @since 2020-04-03 Milind More
 *
 * @package revenue-generator
 */

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
	 * Admin ID.
	 *
	 * @var int
	 */
	protected static $admin_id  = 0;

	/**
	 * Post Object.
	 *
	 * @var Object.
	 */
	protected static $post;

	/**
	 * Post ID.
	 *
	 * @var int.
	 */
	protected static $post_id;

	/**
	 * Setup Initial Data before.
	 *
	 * @param object $factory factory.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		$post_ids       = array();
		self::$admin_id = $factory->user->create( array( 'role' => 'administrator' ) );
		$post_ids[]     = self::factory()->post->create( array( 'post_title' => 'First: Hello, World!' ) );

	}

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Admin.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Admin::get_instance();
		wp_set_current_user( self::$admin_id );
	}

	/**
	 * Tests class constructor.
	 *
	 * @covers ::__construct
	 * @covers ::setup_hooks
	 * @covers ::revenue_generator_register_page
	 */
	public function test_construct() {

		Utility::invoke_method( $this->_instance, '__construct' );

		// Check all added hooks exist.
		$hooks = array(
			array(
				'type'     => 'action',
				'name'     => 'admin_menu',
				'priority' => 10,
				'function' => 'revenue_generator_register_page',
			),
			array(
				'type'     => 'action',
				'name'     => 'admin_head',
				'priority' => 10,
				'function' => 'hide_paywall',
			),
			array(
				'type'     => 'action',
				'name'     => 'current_screen',
				'priority' => 10,
				'function' => 'redirect_merchant',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_update_global_config',
				'priority' => 10,
				'function' => 'update_global_config',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_update_paywall',
				'priority' => 10,
				'function' => 'update_paywall',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_update_currency_selection',
				'priority' => 10,
				'function' => 'update_currency_selection',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_remove_purchase_option',
				'priority' => 10,
				'function' => 'remove_purchase_option',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_remove_paywall',
				'priority' => 10,
				'function' => 'remove_paywall',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_search_preview_content',
				'priority' => 10,
				'function' => 'search_preview_content',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_select_preview_content',
				'priority' => 10,
				'function' => 'select_preview_content',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_search_term',
				'priority' => 10,
				'function' => 'select_search_term',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_clear_category_meta',
				'priority' => 10,
				'function' => 'clear_category_meta',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_complete_tour',
				'priority' => 10,
				'function' => 'complete_tour',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_verify_account_credentials',
				'priority' => 10,
				'function' => 'verify_account_credentials',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_post_permalink',
				'priority' => 10,
				'function' => 'get_post_permalink',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_activate_paywall',
				'priority' => 10,
				'function' => 'activate_paywall',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_disable_paywall',
				'priority' => 10,
				'function' => 'disable_paywall',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_restart_tour',
				'priority' => 10,
				'function' => 'restart_tour',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_set_paywall_order',
				'priority' => 10,
				'function' => 'set_paywall_sort_order',
			),
			array(
				'type'     => 'action',
				'name'     => 'wp_ajax_rg_search_paywall',
				'priority' => 10,
				'function' => 'search_paywall',
			),
		);

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
		wp_set_current_user( self::$admin_id );
		$admin_page_url = home_url() . '/wp-admin/admin.php?page=revenue-generator';
		$this->assertEquals(
			$admin_page_url,
			menu_page_url( 'revenue-generator', false ),
			'Revenue Generator page not created'
		);
	}

	/**
	 * Tests class constructor.
	 *
	 * @covers ::hide_paywall
	 */
	/*
	public function test_hide_paywall() {

		// Before function called.
		wp_set_current_user( $this->factory()->user->create( array( 'role' => 'administrator' ) ) );
		$admin_page_url = home_url() . '/wp-admin/admin.php?page=revenue-generator-paywall';
		error_log( var_export( menu_page_url( 'revenue-generator-paywall', false ), true ) );
		error_log( '-----------before-------------' );
		$this->assertEquals(
			$admin_page_url,
			menu_page_url( 'revenue-generator-paywall', false ),
			'Revenue Generator page not created'
		);

		// Function called.
		Utility::invoke_method( Admin::get_instance(), 'hide_paywall' );

		error_log( var_export( menu_page_url( 'revenue-generator-paywall', false ), true ) );
		error_log( '-----------before-------------' );
		// After Function is called.
		$this->assertEmpty( menu_page_url( 'revenue-generator-paywall', false ) );

	}
	*/

	/**
	 * Test for Search Preview Content.
	 *
	 * @covers Admin::search_paywall
	 */
	public function test_search_preview_content() {
		// Become an administrator.
		$this->_setRole( 'administrator' );

		// Set up a default request.
		$_POST['action']      = 'rg_search_preview_content';
		$_POST['search_term'] = 'First:';
		$_POST['security']    = wp_create_nonce( 'rg_paywall_nonce' );

		// Make the request.
		try {
			$this->_handleAjax( 'rg_search_preview_content' );
		} catch ( \WPAjaxDieContinueException $e ) {
			unset( $e );
		}

		// Get the response, it is in heartbeat's response.
		$response = json_decode( $this->_last_response, true );

		$response = 
		error_log( var_export( $response, true ) );
		error_log( '----------------------------------' );

		// Ensure we found the right match.
		$this->assertContains( $this->_last_response, 'First: Hello, World!' );
	}
}
