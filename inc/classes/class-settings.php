<?php
/**
 * Revenue Generator Plugin Settings Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Class Admin
 */
class Settings {

	use Singleton;

	/**
	 * Class Admin construct method.
	 */
	protected function __construct() {
		// Setup required hooks.
		$this->setup_hooks();
		// Setup settings Options.
		$this->setup_options();
	}

	/**
	 * Setup plugin options.
	 */
	protected function setup_options() {

		// Fresh install.
		if ( false === get_option( 'lp_rg_settings_options' ) ) {
			// @todo, make region and currency empty and let the merchant choose, once EU is ready on upstream.
			// Set default global options.
			update_option(
				'lp_rg_settings_options',
				[
					'rg_ga_personal_enabled_status' => 0,
					'rg_ga_enabled_status'          => 0,
					'rg_laterpay_ga_ua_id'          => 'UA-126481240-1',
					'rg_personal_ga_ua_id'          => '',
				]
			);
		}
	}

	/**
	 * Returns plugin settings options.
	 *
	 * @return array
	 */
	public static function get_settings_options() {
		return get_option( 'lp_rg_settings_options', [] );
	}

	/**
	 * Setup actions and filters.
	 *
	 * @return void
	 */
	protected function setup_hooks() {
		add_action( 'wp_ajax_rg_update_settings_options', [ $this, 'update_settings_options' ] );
	}

	/**
	 * Update the settings with provided data.
	 *
	 * @codeCoverageIgnore -- @todo add AJAX test base class to cover this.
	 */
	public function update_settings_options() {

		// Verify authenticity.
		check_ajax_referer( 'rg_setting_nonce', 'security' );

		// Get all data and sanitize it.
		$config_key   = sanitize_text_field( filter_input( INPUT_POST, 'config_key', FILTER_SANITIZE_STRING ) );
		$config_value = sanitize_text_field( filter_input( INPUT_POST, 'config_value', FILTER_SANITIZE_STRING ) );

		$rg_settings_options = $this->get_settings_options();

		// Check if the settings exists already.
		if ( ! isset( $rg_settings_options[ $config_key ] ) ) {
			wp_send_json(
				[
					'success' => false,
					'msg'     => __( 'Invalid data passed!', 'revenue-generator' ),
				]
			);
		}

		// Check and verify updated option.
		if ( ! empty( $config_value ) ) {
			$rg_settings_options[ $config_key ] = $config_value;
		} else {
			$rg_settings_options[ $config_key ] = 0;
		}

		// Update the option value.
		update_option( 'lp_rg_settings_options', $rg_settings_options );

		// Send success message.
		wp_send_json(
			[
				'success' => true,
				'msg'     => __( 'Settings saved successfully!', 'revenue-generator' ),
			]
		);

	}

	/**
	 * Get Tracking Id of specified type.
	 *
	 * @param string $type Type whose tracking id to get.
	 *
	 * @return string
	 */
	public static function get_tracking_id( $type = '' ) {

		$rg_settings = get_option( 'lp_rg_settings_options', [] );

		if ( 'user' === $type ) {

			// Check if Personal Tracking Setting is Enabled.
			$is_enabled_user_tracking = ( ! empty( $rg_settings['rg_ga_personal_enabled_status'] ) &&
			1 === intval( $rg_settings['rg_ga_personal_enabled_status'] ) );

			// Add user tracking id if enabled.
			if ( $is_enabled_user_tracking && ! empty( $rg_settings['rg_personal_ga_ua_id'] ) ) {
				return $rg_settings['rg_personal_ga_ua_id'];
			}
		} else {

			// Check if LaterPay Tracking Setting is Enabled.
			$is_enabled_lp_tracking = ( ! empty( $rg_settings['rg_ga_enabled_status'] ) &&
			1 === intval( $rg_settings['rg_ga_enabled_status'] ) );

			// Add LaterPay Tracking Id if enabled. We will be using config value, not the one stored in option,
			// to make sure correct tracking id is, available for GA.
			if ( $is_enabled_lp_tracking && ! empty( $rg_settings['rg_laterpay_ga_ua_id'] ) ) {
				return $rg_settings['rg_laterpay_ga_ua_id'];
			}
		}

		return '';
	}
}
