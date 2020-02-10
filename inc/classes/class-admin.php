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
		add_action( 'wp_ajax_rg_update_global_config', array( $this, 'update_global_config' ) );
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

		return '';
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
		$config_key = sanitize_text_field( filter_input( INPUT_POST, 'config_key', FILTER_SANITIZE_STRING ) );
		$config_value = sanitize_text_field( filter_input( INPUT_POST, 'config_value', FILTER_SANITIZE_STRING ) );

		$rg_global_options = Config::get_global_options();

		// Check if the option exists already.
		if ( ! isset( $rg_global_options[$config_key] ) ) {
			wp_send_json( [
				'success' => false,
				'msg' => __( 'Invalid data passed!', 'revenue-generator' )
			] );
		}

		// Check and verify updated option.
		if ( ! empty( $config_value ) ) {
			$rg_global_options[$config_key] = $config_value;
		}

		// Update the option value.
		update_option( 'lp_rg_global_options', $rg_global_options );

		// Send success message.
		wp_send_json( [
			'success' => true,
			'msg' => __( 'Selection stored successfully!', 'revenue-generator' )
		] );

	}
}
