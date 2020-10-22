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
		// Define required constants.
		$this->add_constants();

		// Initialize assets.
		Assets::get_instance();

		// Initialize plugin options.
		Config::get_instance();

		// Initialize plugin custom post types.
		Post_Types::get_instance();

		// Initialize admin backend class.
		Admin::get_instance();

		// Initialize account class.
		Client_Account::get_instance();

		// Initialize frontend post class.
		Frontend_Post::get_instance();

		// Initialize settigns class.
		Settings::get_instance();

		// Intialize Shortcode class.
		Shortcodes::get_instance();

		// Intialize Post Preview Class.
		Post_Preview::get_instance();

		// Setup required hooks.
		$this->setup_hooks();
	}

	/**
	 * Setup actions and filters.
	 *
	 * @return void
	 */
	protected function setup_hooks() {
		add_action( 'plugins_loaded', [ $this, 'load_textdomain' ] );
	}

	/**
	 * Load plugin textdomain.
	 *
	 * @codeCoverageIgnore -- Doesn't have mo files in the plugin, thus verification won't be possible.
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'revenue-generator', false, REVENUE_GENERATOR_PLUGIN_DIR . 'languages/' );
	}

	/**
	 * Define required plugin constants.
	 */
	protected function add_constants() {
		define( 'REVENUE_GENERATOR_VERSION', '1.3.1' );
		define( 'REVENUE_GENERATOR_BUILD_DIR', REVENUE_GENERATOR_PLUGIN_DIR . '/assets/build/' );
		define( 'REVENUE_GENERATOR_BUILD_URL', plugins_url( '/assets/build/', REVENUE_GENERATOR_PLUGIN_FILE ) );
	}
}
