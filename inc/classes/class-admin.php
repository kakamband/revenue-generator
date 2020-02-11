<?php
/**
 * Revenue Generator Plugin Admin Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Class Admin
 */
class Admin {

	use Singleton;

	/**
	 * Class Admin construct method.
	 */
	protected function __construct() {
		// Setup required hooks.
		$this->setup_hooks();
	}

	/**
	 * Setup actions and filters.
	 *
	 * @return void
	 */
	protected function setup_hooks() {
		add_action( 'admin_menu', [ $this, 'revenue_generator_register_page' ] );
		add_action( 'admin_head', [ $this, 'hide_paywall' ] );
		add_action( 'wp_ajax_rg_update_global_config', array( $this, 'update_global_config' ) );
	}

	/**
	 * Load required assets in backend.
	 */
	protected static function load_assets() {
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

	/**
	 * Hides paywall menu from submenu of plugin.
	 */
	public function hide_paywall() {
		// Hide paywall menu from submenu of plugin.
		remove_submenu_page( 'revenue-generator', 'revenue-generator-paywall' );
	}

	/**
	 * Register a new menu page for the Dashboard.
	 */
	public function revenue_generator_register_page() {
		$current_global_options = Config::get_global_options();

		// Check if setup is done, and load page accordingly.
		$is_welcome_setup_done = empty( $current_global_options['average_post_publish_count'] ) ? false : true;
		$dashboard_callback    = $is_welcome_setup_done ? 'load_dashboard' : 'load_welcome_screen';

		// Add main menu page.
		add_menu_page(
			__( 'Revenue Generator', 'revenue-generator' ),
			__( 'Revenue Generator', 'revenue-generator' ),
			'manage_options',
			'revenue-generator',
			[ $this, $dashboard_callback ],
			'dashicons-laterpay-logo',
			5
		);

		// Get all submenus and add it.
		$menus = self::get_admin_menus();
		foreach ( $menus as $key => $page_data ) {
			$slug          = $page_data['url'];
			$page_callback = (
				'dashboard' === $page_data['method'] && false === $is_welcome_setup_done ) ?
				'load_welcome_screen' :
				'load_' . $page_data['method'];

			add_submenu_page(
				'revenue-generator',
				$page_data['title'] . ' | ' . __( 'Revenue Generator Settings', 'revenue-generator' ),
				$page_data['title'],
				$page_data['cap'],
				$slug,
				array( $this, $page_callback )
			);
		}
	}

	/**
	 * Load admin welcome screen.
	 *
	 * @return string
	 *
	 * @codeCoverageIgnore -- Test will be covered in e2e tests.
	 */
	public function load_welcome_screen() {
		self::load_assets();
		$welcome_page_data = [
			'low_count_icon'  => Config::$plugin_defaults['img_dir'] . 'low-publish.svg',
			'high_count_icon' => Config::$plugin_defaults['img_dir'] . 'high-publish.svg'
		];
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is escaped in template file.
		echo View::render_template( 'backend/welcome/welcome', $welcome_page_data );

		return '';
	}

	/**
	 * Load admin dashboard.
	 *
	 * @return string
	 *
	 * @codeCoverageIgnore -- Test will be covered in e2e tests.
	 */
	public function load_dashboard() {
		self::load_assets();

		$admin_menus = self::get_admin_menus();
		$dashboard_page_data = [
			'new_paywall_url'  => add_query_arg( array( 'page' => $admin_menus['paywall']['url'] ) ), admin_url( 'admin.php' ),
		];

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is escaped in template file.
		echo View::render_template( 'backend/dashboard/dashboard', $dashboard_page_data );
		return '';
	}

	/**
	 * Load admin paywall.
	 *
	 * @return string
	 *
	 * @codeCoverageIgnore -- Test will be covered in e2e tests.
	 */
	public function load_paywall() {
		self::load_assets();

		return 'Paywall';
	}

	/**
	 * Update the global config with provided data.
	 *
	 * @codeCoverageIgnore -- @todo add AJAX test base class to cover this.
	 */
	public function update_global_config() {

		// Verify authenticity.
		check_ajax_referer( 'rg_global_config_nonce', 'security' );

		// Get all data and sanitize it.
		$config_key   = sanitize_text_field( filter_input( INPUT_POST, 'config_key', FILTER_SANITIZE_STRING ) );
		$config_value = sanitize_text_field( filter_input( INPUT_POST, 'config_value', FILTER_SANITIZE_STRING ) );

		$rg_global_options = Config::get_global_options();

		// Check if the option exists already.
		if ( ! isset( $rg_global_options[ $config_key ] ) ) {
			wp_send_json( [
				'success' => false,
				'msg'     => __( 'Invalid data passed!', 'revenue-generator' )
			] );
		}

		// Check and verify updated option.
		if ( ! empty( $config_value ) ) {
			$rg_global_options[ $config_key ] = $config_value;
		}

		// Update the option value.
		update_option( 'lp_rg_global_options', $rg_global_options );

		// Send success message.
		wp_send_json( [
			'success' => true,
			'msg'     => __( 'Selection stored successfully!', 'revenue-generator' )
		] );

	}

	/**
	 * Define admin menus used in the plugin.
	 *
	 * @return array
	 */
	public static function get_admin_menus() {
		$menus['dashboard'] = array(
			'url'    => 'revenue-generator-dashboard',
			'title'  => __( 'Dashboard', 'revenue-generator' ),
			'cap'    => 'manage_options',
			'method' => 'dashboard'
		);

		$menus['paywall'] = array(
			'url'    => 'revenue-generator-paywall',
			'title'  => __( 'New Paywall', 'revenue-generator' ),
			'cap'    => 'manage_options',
			'method' => 'paywall'
		);

		return $menus;
	}
}
