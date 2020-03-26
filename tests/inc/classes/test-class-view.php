<?php

namespace LaterPay\Revenue_Generator\Tests;

use LaterPay\Revenue_Generator\Inc\View;

/**
 * Unit test cases for \LaterPay\Revenue_Generator\Inc\View
 *
 * @coversDefaultClass \LaterPay\Revenue_Generator\Inc\View
 *
 * @package revenue-generator
 */
class Test_View extends \WP_UnitTestCase {

	/**
	 * View Class Instance.
	 *
	 * @var View
	 */
	protected $_instance = false;

	/**
	 * This function sets the instance for class LaterPay\Revenue_Generator\Inc\Config.
	 */
	public function setUp() {
		parent::setUp();
		$this->_instance = View::get_instance();
	}


	/**
	 * @covers ::render_template
	 * @covers ::get_template_part
	 */
	public function test_render_template() {
		$template_output = Utility::invoke_method( $this->_instance, 'render_template', [ 'backend/welcome/welcome' ] );
		$this->assertContains( '<div class="rev-gen-layout-wrapper">', $template_output );
	}

	/**
	 * @covers ::render_footer_backend
	 */
	public function test_render_footer_backend() {
		$template_output = Utility::invoke_method( $this->_instance, 'render_footer_backend' );
		$this->assertContains( '<div class="rev-gen-footer">', $template_output );
	}
}
