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
			REVENUE_GENERATOR_BUILD_URL . 'app/index.js',
			[ 'wp-element' ],
			$this->get_asset_version( 'app/index.js' )
		);

		wp_localize_script(
			'revenue-generator',
			'revenueGenerator',
			[
				'globalOptions' => $current_global_options
			]
		);

		wp_register_style(
			'revenue-generator',
			REVENUE_GENERATOR_BUILD_URL . 'app/style.css',
			[],
			$this->get_asset_version( 'app/style.css' )
		);
	}

	/**
	 * Enqueue the registered scripts.
	 */
	public function load_scripts() {
		if ( is_admin() ) {
			wp_enqueue_script( 'revenue-generator' );
			wp_enqueue_style( 'revenue-generator' );
		}
	}

	/**
	 * Register a new menu page for the Dashboard.
	 */
	public function revenue_generator_register_page(){
		add_menu_page(
			__( 'Revenue Generator', 'revenue-generator' ),
			__( 'Revenue Generator', 'revenue-generator'  ),
			'manage_options',
			'revenue-generator',
			[ $this, 'load_main_dashboard' ],
			'dashicons-cart',
			5
		);
	}

	/**
	 * Load Dashboard page.
	 *
	 * @return string
	 */
	public function load_main_dashboard() {
		?>
		<div id="lp_rev_gen_root" class="rev-gen-layout_wrapper"></div>
		<?php
	}

	/**
	 * Define required plugin constants.
	 */
	protected function add_constants() {
		define( 'REVENUE_GENERATOR_VERSION', '0.1.0' );
		define( 'REVENUE_GENERATOR_BUILD_DIR', REVENUE_GENERATOR_PLUGIN_DIR . '/build/' );
		define( 'REVENUE_GENERATOR_BUILD_URL', plugins_url( '/assets/build/', REVENUE_GENERATOR_PLUGIN_FILE ) );
	}

	/**
	 * Gets the file modified time for asset version.
	 *
	 * @param string $file Path to file.
	 *
	 * @return string Current modified time of the file..
	 */
	public function get_asset_version( $file ) {
		return filemtime( REVENUE_GENERATOR_BUILD_DIR . $file );
	}
}
