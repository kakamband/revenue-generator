<?php

namespace LaterPay\Revenue_Generator\Tests;

use LaterPay\Revenue_Generator\Inc\Post_Types\Contribution;

/**
 * Unit test cases for \LaterPay\Revenue_Generator\Inc\Post_Types\Contribution
 *
 * @coversDefaultClass \LaterPay\Revenue_Generator\Inc\Post_Types\Contribution
 *
 * @package revenue-generator
 */
class Test_Contribution extends \WP_UnitTestCase {

	/**
	 * Plugin Class Instance.
	 *
	 * @var Contribution
	 */
	protected $_instance = false;

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Post_Types\Contribution.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = Contribution::get_instance();
	}

	public function test_get_labels_will_return_labels() {
		$labels = $this->_instance->get_labels();

		$this->assertTrue( is_array( $labels ) );
		$this->assertArrayHasKey( 'name', $labels );
		$this->assertArrayHasKey( 'singular_name', $labels );
	}

	public function test_get_default_post_will_return_array_with_all_metas() {
		$post  = $this->_instance->get_default_post();
		$metas = $this->_instance->get_default_meta();

		$this->assertTrue( is_array( $post ) );
		$this->assertArrayHasKey( 'ID', $post );

		foreach ( $metas as $meta_key => $meta_value ) {
			$this->assertArrayHasKey( $meta_key, $post );
		}
	}

	public function test_get_will_return_default_post_if_passing_zero() {
		$expected = $this->_instance->get_default_post();
		$test     = $this->_instance->get( 0 );

		$this->assertEquals( $expected, $test );
	}

	public function test_unprefix_meta_will_return_unprefixed_meta() {
		$prefixed_meta = [
			'_rg_dialog_header' => '',
			'_rg_thank_you'     => '',
			'_rg_all_amounts'   => '',
		];

		$expected = [
			'dialog_header' => '',
			'thank_you'     => '',
			'all_amounts'   => '',
		];

		$test = $this->_instance->unprefix_meta( $prefixed_meta );

		$this->assertEquals( $expected, $test );
	}

	public function test_get_default_meta_will_return_array() {
		$test = $this->_instance->get_default_meta();

		$this->assertTrue( is_array( $test ) );
	}

	public function test_get_shortcode_will_return_empty_string_if_contribution_is_empty() {
		$test = $this->_instance->get_shortcode();

		$this->assertEquals( '', $test );
	}

	public function test_get_shortcode_will_return_shortcode_if_contribution_is_supplied() {
		$contribution = [
			'ID' => 42,
		];

		$expected = '[laterpay_contribution id="42"]';
		$test     = $this->_instance->get_shortcode( $contribution );

		$this->assertEquals( $expected, $test );
	}

	public function test_get_shortcode_will_return_empty_string_if_contribution_is_left_empty() {
		$contribution = [];

		$expected = '';
		$test     = $this->_instance->get_shortcode( $contribution );

		$this->assertEquals( $expected, $test );
	}

	public function test_get_shortcode_will_return_legacy_shortcode_if_its_in_contribution() {
		$contribution = [
			'ID'   => 42,
			'code' => '[laterpay_contribution  name="Test" thank_you="" type="multiple" custom_amount="0" all_amounts="50,100,500" all_revenues="ppu,ppu,sis" selected_amount="1" dialog_header="Support the Author" dialog_description="Pick your contribution below:"]',
		];

		$expected = $contribution['code'];
		$test     = $this->_instance->get_shortcode( $contribution );

		$this->assertEquals( $expected, $test );
	}

	public function test_get_edit_link_returns_correct_url() {
		$expected = admin_url( 'admin.php?page=' . Contribution::ADMIN_EDIT_SLUG . '&id=42' );
		$test     = $this->_instance->get_edit_link( 42 );

		$this->assertEquals( $expected, $test );
	}

	public function test_get_last_modified_author_id_will_return_author_id_if_found() {
		$id = wp_insert_post( [
			'post_title' => 'Test',
			'post_type'  => Contribution::SLUG,
		] );

		update_post_meta( $id, '_edit_last', 1 );

		$expected = 1;
		$test     = $this->_instance->get_last_modified_author_id( $id );

		$this->assertEquals( $expected, $test );
	}

	public function test_save_will_insert_new_post_if_id_is_empty() {
		$contribution_data = $this->_instance->get_default_post();

		$test = $this->_instance->save( $contribution_data );

		$this->assertNotEquals( 0, $test );
	}

	public function test_save_will_update_existing_post_if_id_is_not_empty() {
		$contribution_data = $this->_instance->get_default_post();
		$new_post_id       = $this->_instance->save( $contribution_data );

		$contribution_data['ID'] = $new_post_id;

		$test = $this->_instance->save( $contribution_data );

		$this->assertEquals( $new_post_id, $test );
	}

	public function test_save_will_erase_legacy_shortcode_if_found() {
		$contribution_data = $this->_instance->get_default_post();
		$new_post_id       = $this->_instance->save( $contribution_data );

		$contribution_data['ID']   = $new_post_id;
		$contribution_data['code'] = '[laterpay_contribution attr="test"]';

		$this->_instance->save( $contribution_data );

		$expected = '';
		$test     = get_post_meta( $new_post_id, '_rg_code', true );

		$this->assertEquals( $expected, $test );
	}

	public function test_delete_will_return_wp_error_on_empty_id() {
		$test     = $this->_instance->delete( 0 );
		$expected = is_wp_error( $test );

		$this->assertTrue( $expected );
	}

	public function test_delete_will_return_wp_error_when_attempting_to_delete_different_post_type() {
		$post_id = wp_insert_post(
			[
				'post_type' => 'post',
			]
		);

		$test     = $this->_instance->delete( $post_id );
		$expected = is_wp_error( $test );

		$this->assertTrue( $expected );
	}

	public function test_delete_will_delete_contribution_if_valid_id_is_passed() {
		$post_id = wp_insert_post(
			[
				'post_type' => Contribution::SLUG,
			]
		);

		$test = $this->_instance->delete( $post_id );

		$post     = get_post( $post_id );
		$expected = is_null( $post );

		$this->assertTrue( $expected );
	}
}
