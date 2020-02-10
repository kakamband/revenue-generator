<?php
/**
 * Revenue Generator Plugin Assets Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Class Assets
 */
class Assets {

	use Singleton;

	/**
	 * Class Asset construct method.
	 */
	protected function __construct() {
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
		add_action( 'admin_enqueue_scripts', [ $this, 'register_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'load_scripts' ], 11 );
	}

	/**
	 * Register the required scripts.
	 */
	public function register_scripts() {
		wp_register_script(
			'revenue-generator',
			REVENUE_GENERATOR_BUILD_URL . 'revenue-generator-admin.js',
			[ 'jquery' ],
			$this->get_asset_version( 'revenue-generator-admin.js' )
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

			// Localize required data.
			$current_global_options = Config::get_global_options();

			// Script date required for operations.
			$rg_script_data = [
				'globalOptions'          => $current_global_options,
				'ajaxUrl'                => admin_url( 'admin-ajax.php' ),
				'rg_global_config_nonce' => wp_create_nonce( 'rg_global_config_nonce' )
			];

			// Create variable and add data.
			$rg_global_data = 'var revenueGeneratorGlobalOptions = ' . wp_json_encode( $rg_script_data ) . '; ';
			wp_add_inline_script( 'revenue-generator', $rg_global_data, 'before' );

			wp_enqueue_script( 'revenue-generator' );
			wp_enqueue_style( 'revenue-generator' );
		}
		wp_enqueue_style( 'revenue-generator-admin' );
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
