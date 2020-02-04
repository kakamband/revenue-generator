<?php
/**
 * Revenue Generator Plugin Main Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Class Plugin
 */
class Plugin {

	use Singleton;

	/**
	 * Class Plugin construct method.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Setup actions and filters.
	 *
	 * @return void
	 */
	protected function setup_hooks() {
		$this->add_plugin_constants();
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
	}

	/**
	 * Define required plugin constants.
	 */
	private function add_plugin_constants() {
		define( 'REVENUE_GENERATOR_VERSION', '0.1.0' );
	}

	/**
	 * Load plugin textdomain.
	 *
	 * @codeCoverageIgnore -- Doesn't have mo files in the plugin, thus verification won't be possible.
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'revenue-generator', false, REVENUE_GENERATOR_PLUGIN_DIR . 'languages/' );
	}
}
