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
	 * Admin.
	 *
	 * @var object
	 */
	protected static $admin;

	/**
	 * Paywall.
	 *
	 * @var object
	 */
	protected static $paywall;

	/**
	 * Post.
	 *
	 * @var object
	 */
	protected static $post;


	/**
	 * Subscription.
	 *
	 * @var object
	 */
	protected static $subscription;

	/**
	 * Time Pass.
	 *
	 * @var object
	 */
	protected static $time_pass;

	/**
	 * Setup Initial Data before.
	 *
	 * @param object $factory factory.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin = $factory->user->create_and_get( array( 'role' => 'administrator' ) );

		self::$subscription = $factory->post->create_and_get(
			array(
				'post_type'    => 'rg_subscription',
				'post_title'   => '1 Month Subscription',
				'post_content' => 'Enjoy unlimited access to all our content for 1 Month',
				'post_status'  => 'publish',
				'post_author'  => self::$admin->ID,
				'meta_input'   => array(
					'_rg_price'        => '4.99',
					'_rg_revenue'      => 'sis',
					'_rg_duration'     => 'm',
					'_rg_period'       => '1',
					'_rg_access_to'    => 'all',
					'_rg_custom_title' => '',
					'_rg_custom_desc'  => '',
				),
			)
		);

		self::$time_pass = $factory->post->create_and_get(
			array(
				'post_type'    => 'rg_pass',
				'post_title'   => '24 Hour Pass',
				'post_content' => 'Enjoy unlimited access to all our content for 24 Hours',
				'post_status'  => 'publish',
				'post_author'  => self::$admin->ID,
				'meta_input'   => array(
					'_rg_price'        => '2.49',
					'_rg_revenue'      => 'sis',
					'_rg_duration'     => 'h',
					'_rg_period'       => '24',
					'_rg_access_to'    => 'all',
					'_rg_custom_title' => '',
					'_rg_custom_desc'  => '',
				),
			)
		);

		self::$paywall = $factory->post->create_and_get(
			array(
				'post_type'    => 'rg_paywall',
				'post_title'   => 'Paywall 1',
				'post_content' => 'Support http://revgen.test to get access to this content and more.',
				'post_status'  => 'publish',
				'post_author'  => self::$admin->ID,
				'meta_input'   => array(
					'_rg_title'             => 'Keep Reading',
					'_rg_access_to'         => 'all',
					'_rg_access_entity'     => '2',
					'_rg_preview_id'        => '2',
					'_rg_specific_posts'    => '',
					'_rg_individual_option' =>
						array(
							'title'        => 'Access Article Now',
							'description'  => 'You\'ll only be charged once you\'ve reached $5.',
							'price'        => '0.49',
							'revenue'      => 'ppu',
							'type'         => 'dynamic',
							'custom_title' => '',
							'custom_desc'  => '',
						),
					'_rg_options_order'     =>
						array(
							'individual'                  => '1',
							'tlp_' . self::$time_pass->ID => '2',
							'sub_' . self::$subscription->ID => '3',
						),
					'_rg_is_active'         => '1',
				),
			)
		);

		self::$post = $factory->post->create_and_get();

	}

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Frontend_Post.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Frontend_Post::get_instance();
		wp_set_current_user( self::$admin->ID );
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

	/**
	 * Test Connector config.
	 *
	 * @covers Frontend_Post::add_connector_config
	 *
	 * @todo Giving error still debuging.
	 */
	public function test_add_connector_config() {
		$post_id = self::$post->ID;
		$this->go_to( get_permalink( $post_id ) );
		$connect_configs = Utility::buffer_and_return( array( $this->_instance, 'add_connector_config' ) );
		$this->assertQueryTrue( 'is_single', 'is_singular' );
		$this->assertContains( 'laterpay-connector', $connect_configs );
		$this->assertContains( 'appearance', $connect_configs );
		$this->assertContains( 'purchase_options', $connect_configs );
		$this->assertContains( 'laterpay:connector:config_token', $connect_configs );
	}

	/**
	 * Test Connected Paywall ID.
	 *
	 * @covers Frontend_Post::get_connected_paywall_id
	 */
	public function test_get_connected_paywall_id() {

		$all_paywall = Utility::invoke_method( $this->_instance, 'get_connected_paywall_id', array( self::$post->ID ) );
		$this->assertArrayHasKey( 'id', $all_paywall );
		$this->assertEquals( 'Paywall 1', $all_paywall['name'] );
	}

	/**
	 * Test Register Connected Assets.
	 *
	 * @covers Frontend_Post::register_connector_assets
	 */
	public function test_register_connector_assets() {
		$post_id = self::$post->ID;
		$this->go_to( get_permalink( $post_id ) );
		Utility::invoke_method( $this->_instance, 'register_connector_assets' );
		$this->assertTrue( wp_script_is( 'revenue-generator-classic-connector' ) );
		$this->assertTrue( wp_style_is( 'revenue-generator-frontend' ) );

	}

	/**
	 * Test Post Content Teaser.
	 *
	 * @param string $content Content to be tested.
	 *
	 * @covers Frontend_Post::revenue_generator_post_content
	 *
	 * @dataProvider data_revenue_generator_post_content
	 */
	public function test_revenue_generator_post_content( $content ) {
		$post_id = self::$post->ID;
		$this->go_to( get_permalink( $post_id ) );
		$post_content = Utility::invoke_method( $this->_instance, 'revenue_generator_post_content', array( $content ) );
		$this->assertContains( 'lp-teaser-content', $post_content );
		$this->assertContains( 'lp-main-content', $post_content );
		$this->assertContains( 'data-lp-show-on-access', $post_content );
	}

	/**
	 * Data provider for revenue_generator_post_content.
	 *
	 * Passes diffrent type of data.
	 *
	 * @return array {
	 *    @type array{
	 *        @type string $content The Content.
	 *    }
	 * }
	 */
	public function data_revenue_generator_post_content() {

		return array(
			array(
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
			),
			array(
				'[hello world=start]Where are you?[/hello]',
			),
		);
	}

	/**
	 * Test Post Payload.
	 *
	 * @covers Frontend_Post::get_post_payload
	 */
	public function test_get_post_payload() {
		$post_id = self::$post->ID;
		$this->go_to( get_permalink( $post_id ) );
		$post_payload = Utility::invoke_method( $this->_instance, 'get_post_payload' );
		$this->assertArrayHasKey( 'payload', $post_payload, 'Array Does not conatin payload' );
		$this->assertArrayHasKey( 'token', $post_payload, 'Array Does not conatin token' );

	}

	/**
	 * Test singed token.
	 *
	 * @covers Frontend_Post::get_signed_token
	 */
	public function test_get_signed_token() {
		$post_id = self::$post->ID;
		$this->go_to( get_permalink( $post_id ) );
		$post_payload = Utility::invoke_method( $this->_instance, 'get_post_payload' );
		$signed_token = Utility::invoke_method( $this->_instance, 'get_signed_token', $post_payload );
		$this->assertNotNull( $signed_token );
	}

	/**
	 * Test gets deleted article ids.
	 *
	 * @covers Frontend_Post::get_deleted_article_ids
	 */
	public function test_get_deleted_article_ids() {
		$post_id = self::$post->ID;
		$this->go_to( get_permalink( $post_id ) );
		$deleted_options = Utility::invoke_method( $this->_instance, 'get_deleted_article_ids' );
		$this->assertNotEmpty( $deleted_options );
		$this->assertStringStartsWith( 'article_', $deleted_options[0] );
	}

}
