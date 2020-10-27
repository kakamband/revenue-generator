<?php
/**
 * PHPUnit tests for inc/classes/post-types/class-paywall.php
 *
 * @author Milind More <milind.morel@rtcamp.com>
 *
 * @requires PHP 5.6
 *
 * @coversDefaultClass LaterPay\Revenue_Generator\Inc\Post_Types\Paywall
 *
 * @since 2020-10-22 Milind More
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Tests;

use LaterPay\Revenue_Generator\Inc\Post_Types\Paywall;

/**
 * Unit test cases for \LaterPay\Revenue_Generator\Inc\Paywall
 *
 * @coversDefaultClass \LaterPay\Revenue_Generator\Inc\Paywall
 *
 * @package revenue-generator
 */
class Test_Paywall extends \WP_UnitTestCase {

	/**
	 * Plugin Class Instance.
	 *
	 * @var Contribution
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
	 * Paywall Supported.
	 *
	 * @var object
	 */
	protected static $paywall_supported;

	/**
	 * Paywall Specific.
	 *
	 * @var object
	 */
	protected static $paywall_specifc;


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
	 * Post.
	 *
	 * @var object
	 */
	protected static $post;

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
				'post_title'   => 'Paywall All',
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

		self::$paywall_supported = $factory->post->create_and_get(
			array(
				'post_type'    => 'rg_paywall',
				'post_title'   => 'Paywall Supported',
				'post_content' => 'Support http://revgen.test to get access to this content and more.',
				'post_status'  => 'publish',
				'post_author'  => self::$admin->ID,
				'meta_input'   => array(
					'_rg_title'             => 'Keep Reading',
					'_rg_access_to'         => 'supported',
					'_rg_access_entity'     => self::$post->ID,
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

		self::$paywall_specifc = $factory->post->create_and_get(
			array(
				'post_type'    => 'rg_paywall',
				'post_title'   => 'Paywall Supported',
				'post_content' => 'Support http://revgen.test to get access to this content and more.',
				'post_status'  => 'publish',
				'post_author'  => self::$admin->ID,
				'meta_input'   => array(
					'_rg_title'             => 'Keep Reading',
					'_rg_access_to'         => 'specific_post',
					'_rg_access_entity'     => '2',
					'_rg_preview_id'        => '2',
					'_rg_specific_posts'    => array( (string) self::$post->ID ),
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

	}

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Post_Types\Paywall.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Paywall::get_instance();
	}

	/**
	 * Test Get labels.
	 *
	 * @covers Paywall::get_labels
	 */
	public function test_get_labels_will_return_labels() {
		$labels = $this->_instance->get_labels();

		$this->assertTrue( is_array( $labels ) );
		$this->assertArrayHasKey( 'name', $labels );
		$this->assertArrayHasKey( 'singular_name', $labels );
	}

	/**
	 * Test Get labels.
	 *
	 * @param array $paywall_data Paywall data.
	 *
	 * @covers Paywall::update_paywall
	 *
	 * @dataProvider data_update_paywall
	 */
	public function test_update_paywall( $paywall_data ) {
		$paywall_id = 0;
		if ( ! empty( $paywall_data['id'] ) ) {
			$paywall_data['id'] = self::$paywall->ID;
			$paywall_id         = Utility::invoke_method( $this->_instance, 'update_paywall', array( $paywall_data ) );
		} else {
			$paywall_id = Utility::invoke_method( $this->_instance, 'update_paywall', array( $paywall_data ) );
		}

		$paywall      = get_post( $paywall_id );
		$paywall_meta = get_post_meta( $paywall_id );

		$this->assertNotEmpty( $paywall_id );
		$this->assertNotEmpty( $paywall );
		$this->assertStringStartsWith( 'Paywall', $paywall->post_title );

		$meta_key_expected = array( '_rg_title', '_rg_access_to', '_rg_access_entity', '_rg_preview_id' );

		foreach ( $meta_key_expected as $meta_value ) {
			$this->assertArrayHasKey( $meta_value, $paywall_meta );
		}

	}

	/**
	 * Data provider for test_update_paywall.
	 *
	 * Passes diffrent type of data.
	 *
	 * @return array {
	 *    @type array{
	 *        @type array $paywall_data Paywall content.
	 *    }
	 * }
	 */
	public function data_update_paywall() {

		return array(
			array(
				array(
					'title'          => 'Keep Reading',
					'description'    => 'Support to get access to this content and more',
					'name'           => 'Paywall 1',
					'access_to'      => 'all',
					'access_entity'  => '2',
					'preview_id'     => '2',
					'specific_posts' => '',
				),
			),
			array(
				array(
					'id'             => 'id',
					'title'          => 'Keep Reading',
					'description'    => 'Support to get access to this content and more',
					'name'           => 'Paywall 2',
					'access_to'      => 'all',
					'access_entity'  => '2',
					'preview_id'     => '2',
					'specific_posts' => '',
				),
			),
		);
	}

	/**
	 * Test purchase option data by post id.
	 *
	 * @covers Paywall::get_purchase_option_data_by_post_id
	 */
	public function test_get_purchase_option_data_by_post_id() {

		$post_id                    = self::$post->ID;
		$paywall_info               = Utility::invoke_method( $this->_instance, 'get_purchase_option_data_by_post_id', array( $post_id ) );
		$expected_paywall_info_keys = array( 'id', 'name', 'description', 'title', 'access_to', 'access_entity', 'preview_id', 'order' );

		if ( ! empty( $paywall_info ) ) {
			foreach ( $expected_paywall_info_keys as $keys ) {
				$this->assertArrayHasKey( $keys, $paywall_info );
			}
		}
	}

	/**
	 * Test get paywall for specific post.
	 *
	 * @covers Paywall::get_paywall_for_specific_post
	 */
	public function test_get_paywall_for_specific_post() {
		$post_id             = self::$post->ID;
		$specific_paywall_id = Utility::invoke_method( $this->_instance, 'get_paywall_for_specific_post', array( $post_id ) );
		$this->assertEquals( $specific_paywall_id, self::$paywall_specifc->ID );
	}

	/**
	 * Test get paywall by categories
	 *
	 * @covers Paywall::get_connected_paywall_by_categories
	 */
	public function test_get_connected_paywall_by_categories( ) {
		// WIP.
	}

}
