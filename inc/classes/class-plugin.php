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

		// Initialize plugin options.
		Config::get_instance();

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
		add_action( 'admin_enqueue_scripts', [ $this, 'register_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'load_scripts' ], 11 );
		add_action( 'admin_menu', [ $this, 'revenue_generator_register_page' ] );
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
	 * Register the required scripts.
	 */
	public function register_scripts() {

		$current_global_options = Config::get_global_options();

		wp_register_script(
			'revenue-generator',
			REVENUE_GENERATOR_BUILD_URL . 'revenue-generator-admin.js',
			[ 'jquery' ],
			$this->get_asset_version( 'revenue-generator-admin.js' )
		);

		wp_localize_script(
			'revenue-generator',
			'revenueGenerator',
			[
				'globalOptions' => $current_global_options
			]
		);

		// Sets translated strings for JS script.
		wp_set_script_translations(
			'revenue-generator',
			'revenue-generator',
			REVENUE_GENERATOR_PLUGIN_DIR . 'languages/'
		);

		wp_register_style(
			'revenue-generator',
			REVENUE_GENERATOR_BUILD_URL . 'css/revenue-generator-dashboard.css',
			[],
			$this->get_asset_version( 'css/revenue-generator-dashboard.css' )
		);

		wp_register_style(
			'revenue-generator-admin',
			REVENUE_GENERATOR_BUILD_URL . 'css/revenue-generator-admin.css',
			[],
			$this->get_asset_version( 'css/revenue-generator-admin.css' )
		);
	}

	/**
	 * Enqueue the registered scripts.
	 */
	public function load_scripts() {
		$screen_info = get_current_screen();
		if ( is_admin() && 'toplevel_page_revenue-generator' === $screen_info->id ) {
			wp_enqueue_script( 'revenue-generator' );
			wp_enqueue_style( 'revenue-generator' );
		}
		wp_enqueue_style( 'revenue-generator-admin' );
	}

	/**
	 * Register a new menu page for the Dashboard.
	 */
	public function revenue_generator_register_page() {
		add_menu_page(
			__( 'Revenue Generator', 'revenue-generator' ),
			__( 'Revenue Generator', 'revenue-generator' ),
			'manage_options',
			'revenue-generator',
			[ $this, 'load_dashboard' ],
			'dashicons-laterpay-logo',
			5
		);
	}

	/**
	 * Load admin screen.
	 *
	 * @return string
	 *
	 * @codeCoverageIgnore -- Test will be covered in e2e tests.
	 */
	public function load_dashboard() {
		$current_global_options = Config::get_global_options();

		if ( empty( $current_global_options['average_post_publish_count'] ) ) {
			$welcome_page_data = [
				'low_count_icon'  => Config::$plugin_defaults['img_dir'] . 'low-publish.svg',
				'high_count_icon' => Config::$plugin_defaults['img_dir'] . 'high-publish.svg'
			];

			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is escaped in template file.
			echo View::render_template( 'backend/welcome/welcome', $welcome_page_data );
		}
	}

	/**
	 * Define required plugin constants.
	 */
	protected function add_constants() {
		define( 'REVENUE_GENERATOR_VERSION', '0.1.0' );
		define( 'REVENUE_GENERATOR_BUILD_DIR', REVENUE_GENERATOR_PLUGIN_DIR . '/assets/build/' );
		define( 'REVENUE_GENERATOR_BUILD_URL', plugins_url( '/assets/build/', REVENUE_GENERATOR_PLUGIN_FILE ) );
	}

	/**
	 * Gets the file modified time for asset version.
	 *
	 * @param string $file Path to file.
	 *
	 * @return string Current modified time of the file.
	 *
	 * @codeCoverageIgnore  -- method checked in enqueue
	 */
	public function get_asset_version( $file ) {
		if ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) {
			return filemtime( REVENUE_GENERATOR_BUILD_DIR . $file );
		} else {
			return REVENUE_GENERATOR_VERSION;
		}
	}
}
