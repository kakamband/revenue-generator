<?php
/**
 * PHPUnit tests for inc/classes/class-frontend-post.php
 *
 * @author Milind More <milind.morel@rtcamp.com>
 *
 * @requires PHP 5.6
 *
 * @coversDefaultClass LaterPay\Revenue_Generator\Inc\Frontend_Post
 *
 * @since 2020-10-13 Milind More
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Tests;

use LaterPay\Revenue_Generator\Inc\Frontend_Post;

/**
 * Unit test cases for \LaterPay\Revenue_Generator\Inc\Frontend_Post
 *
 * @coversDefaultClass \LaterPay\Revenue_Generator\Inc\Frontend_Post
 *
 * @package revenue-generator
 */
class Test_Frontend_Post extends \WP_UnitTestCase {

	/**
	 * Plugin Class Instance.
	 *
	 * @var Plugin
	 */
	protected $_instance = false;

	/**
	 * Admin ID.
	 *
	 * @var int
	 */
	protected static $admin_id  = 0;

	/**
	 * Setup Initial Data before.
	 *
	 * @param object $factory factory.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create( array( 'role' => 'administrator' ) );
	}

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Frontend_Post.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Frontend_Post::get_instance();
		wp_set_current_user( self::$admin_id );
	}

	/**
	 * @covers ::__construct
	 * @covers ::setup_hooks
	 * @covers ::add_constants
	 * @covers ::load_textdomain
	 */
	public function test_construct() {

		$global_configs_data = array(
			'is_welcome_done'                    => 'paywall',
			'average_post_publish_count'         => 'high',
			'merchant_currency'                  => 'USD',
			'merchant_region'                    => 'US',
			'is_paywall_tutorial_completed'      => 1,
			'is_contribution_tutorial_completed' => 1,
			'is_merchant_verified'               => 1,
		);

		update_option( 'lp_rg_global_options', $global_configs_data );

		Utility::invoke_method( $this->_instance, '__construct' );

		// Check all added hooks exist.
		$hooks = [
			[
				'type'     => 'action',
				'name'     => 'wp_enqueue_scripts',
				'priority' => 10,
				'function' => 'register_connector_assets',
			],
			[
				'type'     => 'filter',
				'name'     => 'wp_head',
				'priority' => 10,
				'function' => 'add_connector_config',
			],
			[
				'type'     => 'filter',
				'name'     => 'the_content',
				'priority' => 10,
				'function' => 'revenue_generator_post_content',
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
				sprintf( 'Frontend_Post::setup_hooks() failed to register %1$s "%2$s" to %3$s()', $hook['type'], $hook['name'], $hook['function'] )
			);
		}

	}
}
