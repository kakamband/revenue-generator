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
use LaterPay\Revenue_Generator\Inc\Assets;
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
		$search_result = json_decode( $this->_last_response, true );

		// Ensure we found the right match.
		$this->assertContains( 'First: Hello, World!', $search_result, "search_result doesn't contains value as value" );

		// Failed to find.
		$this->assertNotContains( 'Second', $search_result['preview_posts'], 'search_result contains value as value' );

	}

	/**
	 * Test to check if assets are loaded.
	 *
	 * @covers Admin::load_assets
	 */
	public function test_load_assets() {
		// Become an administrator.
		$this->_setRole( 'administrator' );

		// Register Scritps.
		Utility::invoke_method( Assets::get_instance(), 'register_scripts' );

		// Load Scripts.
		Utility::invoke_method( Admin::get_instance(), 'load_assets' );

		// Make sure we are on right screen.
		set_current_screen( 'revenue-generator_page_revenue-generator-dashboard' );

		// Verify script and style registration.
		$this->assertTrue( wp_script_is( 'revenue-generator', 'enqueued' ) );
		$this->assertTrue( wp_style_is( 'revenue-generator', 'enqueued' ) );
		$this->assertTrue( wp_style_is( 'revenue-generator-select2', 'enqueued' ) );
	}

	/**
	 * Test Admin menu pages.
	 *
	 * @covers Admin::revenue_generator_register_page
	 */
	public function test_revenue_generator_register_page() {

		$current_user = get_current_user_id();

		// Become an administrator.
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );
		update_option( 'siteurl', 'http://example.org' );

		// Load Admin Menu.
		Utility::invoke_method( Admin::get_instance(), 'revenue_generator_register_page' );

		$expected['revenue-generator'] = home_url() . '/wp-admin/admin.php?page=revenue-generator';

		/*
		Not working possibly because of menu hide or dynamically loaded menu the global $submenu is also returns as null.
		$expected['revenue-generator-dashboard'] = home_url() . '/wp-admin/admin.php?page=revenue-generator-dashboard';
		$expected['revenue-generator-dashboard'] = home_url() . '/wp-admin/admin.php?page=revenue-generator-paywall';
		*/

		foreach ( $expected as $name => $value ) {
			$this->assertEquals( $value, menu_page_url( $name, false ) );
		}

		wp_set_current_user( $current_user );
	}

	/**
	 * Test Welcome Screen.
	 *
	 * @covers Admin::load_welcome_screen
	 */
	public function test_load_welcome_screen() {
		// Become an administrator.
		$this->_setRole( 'administrator' );

		// Make sure we are on right screen.
		set_current_screen( 'revenue-generator_page_revenue-generator-dashboard' );

		// Load welcome screen.
		$welcome_screen = Utility::buffer_and_return( array( Admin::get_instance(), 'load_welcome_screen' ) );

		$this->assertContains( '<h1 class="welcome-screen--heading">Welcome to Revenue Generator</h1>', $welcome_screen );
	}

}
