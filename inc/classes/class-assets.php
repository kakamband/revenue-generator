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
		add_action( 'admin_enqueue_scripts', [ $this, 'load_admin_assets' ], 11 );
	}

	/**
	 * Register the required scripts.
	 */
	public function register_scripts() {
		wp_register_script(
			'revenue-generator',
			REVENUE_GENERATOR_BUILD_URL . 'revenue-generator-admin.js',
			[ 'jquery', 'wp-util' ],
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
	public function load_admin_assets() {
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
