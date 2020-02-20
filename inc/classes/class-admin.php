<?php
/**
 * Revenue Generator Plugin Admin Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Post_Types\Paywall;
use LaterPay\Revenue_Generator\Inc\Post_Types\Subscription;
use LaterPay\Revenue_Generator\Inc\Post_Types\Time_Pass;
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
		add_action( 'current_screen', [ $this, 'redirect_merchant' ] );
		add_action( 'wp_ajax_rg_update_global_config', [ $this, 'update_global_config' ] );
		add_action( 'wp_ajax_rg_update_paywall', [ $this, 'update_paywall' ] );
		add_action( 'wp_ajax_rg_update_currency_selection', [ $this, 'update_currency_selection' ] );
		add_action( 'wp_ajax_rg_remove_purchase_option', [ $this, 'remove_purchase_option' ] );
	}

	/**
	 * Load required assets in backend.
	 */
	protected static function load_assets() {
		// Localize required data.
		$current_global_options = Config::get_global_options();

		// Check if setup is done, and load page accordingly.
		$is_welcome_setup_done = empty( $current_global_options['average_post_publish_count'] ) ? false : true;

		$currency_limits = Config::get_currency_limits();

		// Script date required for operations.
		$rg_script_data = [
			'globalOptions'    => $current_global_options,
			'ajaxUrl'          => admin_url( 'admin-ajax.php' ),
			'rg_paywall_nonce' => wp_create_nonce( 'rg_paywall_nonce' ),
			'currency'         => $currency_limits[ $current_global_options['merchant_currency'] ],
			'locale'           => get_locale()
		];

		// If setup is not done
		if ( ! $is_welcome_setup_done ) {
			$rg_script_data['rg_global_config_nonce'] = wp_create_nonce( 'rg_global_config_nonce' );
		}

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
				[ $this, $page_callback ]
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
	 * If the tutorial is incomplete, redirect user to paywall page before dashboard.
	 *
	 * @param $current_screen
	 */
	public function redirect_merchant( $current_screen ) {
		$dashboard_pages = [ 'toplevel_page_revenue-generator', 'revenue-generator_page_revenue-generator-dashboard' ];
		if ( in_array( $current_screen->id, $dashboard_pages ) ) {
			$current_global_options = Config::get_global_options();
			$admin_menus            = self::get_admin_menus();

			// Check if tutorial is completed, and load page accordingly.
			$is_welcome_setup_done = empty( $current_global_options['average_post_publish_count'] ) ? false : true;
			$is_tutorial_completed = (bool) $current_global_options['is_tutorial_completed'];

			$paywall_page = add_query_arg( [ 'page' => $admin_menus['paywall']['url'] ], admin_url( 'admin.php' ) );

			if ( true === $is_welcome_setup_done && false === $is_tutorial_completed ) {
				wp_safe_redirect( $paywall_page );
				exit;
			}
		}
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

		$admin_menus         = self::get_admin_menus();
		$dashboard_page_data = [
			'new_paywall_url' => add_query_arg( [ 'page' => $admin_menus['paywall']['url'] ], admin_url( 'admin.php' ) ),
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
		$config_data = Config::get_global_options();

		$post_types = Post_Types::get_instance();

		// Get latest post info for preview.
		$latest_post_id      = $post_types->get_latest_post_for_preview();
		$formatted_post_data = $post_types->get_formatted_post_data( $latest_post_id );

		// Get paywall options data.
		$purchase_options_data = $post_types->get_post_purchase_options( $latest_post_id, $formatted_post_data );
		$default_option_data   = $post_types->get_default_purchase_option();
		$purchase_options      = $post_types->convert_to_purchase_options( $purchase_options_data );

		// Paywall purchase options data.
		$post_preview_data = [
			'rg_preview_post'       => $formatted_post_data,
			'purchase_options_data' => $purchase_options,
			'default_option_data'   => $default_option_data,
			'merchant_symbol'       => 'USD' === $config_data['merchant_currency'] ? '$' : '€',
			'action_icons'          => [
				'option_add'         => Config::$plugin_defaults['img_dir'] . 'add-option.svg',
				'option_edit'        => Config::$plugin_defaults['img_dir'] . 'edit-option.svg',
				'option_remove'      => Config::$plugin_defaults['img_dir'] . 'remove-option.svg',
				'option_move_up'     => Config::$plugin_defaults['img_dir'] . 'move-up.svg',
				'option_move_down'   => Config::$plugin_defaults['img_dir'] . 'move-down.svg',
				'option_move_around' => Config::$plugin_defaults['img_dir'] . 'move-option.svg',
				'option_warning'     => Config::$plugin_defaults['img_dir'] . 'option-warning.svg',
				'option_info'        => Config::$plugin_defaults['img_dir'] . 'option-info.svg',
			]
		];

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is escaped in template file.
		echo View::render_template( 'backend/paywall/post-preview', $post_preview_data );

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
		$menus['dashboard'] = [
			'url'    => 'revenue-generator-dashboard',
			'title'  => __( 'Dashboard', 'revenue-generator' ),
			'cap'    => 'manage_options',
			'method' => 'dashboard'
		];

		$menus['paywall'] = [
			'url'    => 'revenue-generator-paywall',
			'title'  => __( 'New Paywall', 'revenue-generator' ),
			'cap'    => 'manage_options',
			'method' => 'paywall'
		];

		return $menus;
	}

	/**
	 * Update Paywall.
	 *
	 */
	public function update_paywall() {

		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Sanitize the data.
		$rg_post_id      = sanitize_text_field( filter_input( INPUT_POST, 'post_id', FILTER_SANITIZE_NUMBER_INT ) );
		$paywall_data    = filter_input( INPUT_POST, 'paywall', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		$individual_data = filter_input( INPUT_POST, 'individual', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		$time_passes     = filter_input( INPUT_POST, 'time_passes', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		$subscriptions   = filter_input( INPUT_POST, 'subscriptions', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		$paywall_instance         = Paywall::get_instance();
		$paywall['title']         = sanitize_text_field( wp_unslash( $paywall_data['title'] ) );
		$paywall['description']   = sanitize_text_field( wp_unslash( $paywall_data['desc'] ) );
		$paywall['name']          = sanitize_text_field( wp_unslash( $paywall_data['name'] ) );
		$paywall['id']            = sanitize_text_field( $paywall_data['id'] );
		$paywall['access_to']     = sanitize_text_field( wp_unslash( $paywall_data['applies'] ) );
		$paywall['access_entity'] = $rg_post_id;

		$order_items = [];

		// Create Paywall.
		$paywall_id = $paywall_instance->update_paywall( $paywall );

		if ( ! empty( $individual_data ) ) {
			$individual['title']       = sanitize_text_field( wp_unslash( $individual_data['title'] ) );
			$individual['description'] = sanitize_text_field( wp_unslash( $individual_data['desc'] ) );
			$individual['price']       = floatval( $individual_data['price'] );
			$individual['revenue']     = sanitize_text_field( $individual_data['revenue'] );
			$individual['type']        = sanitize_text_field( $individual_data['type'] );
			$order_items['individual'] = absint( $individual_data['order'] );

			// Add Individual option to paywall.
			$paywall_instance->update_paywall_individual_option( $paywall_id, $individual );
		}

		$time_pass_instance = Time_Pass::get_instance();
		$time_pass_response = [];

		if ( ! empty( $time_passes ) ) {
			// Store time pass.
			foreach ( $time_passes as $time_pass ) {
				$timepass['id']          = sanitize_text_field( $time_pass['tlp_id'] );
				$timepass['title']       = sanitize_text_field( wp_unslash( $time_pass['title'] ) );
				$timepass['description'] = sanitize_text_field( wp_unslash( $time_pass['desc'] ) );
				$timepass['price']       = floatval( $time_pass['price'] );
				$timepass['revenue']     = sanitize_text_field( $time_pass['revenue'] );
				$timepass['duration']    = sanitize_text_field( $time_pass['duration'] );
				$timepass['period']      = sanitize_text_field( $time_pass['period'] );
				$timepass['access_to']   = 'all'; // @todo make it dynamic

				$tp_id                                   = $time_pass_instance->update_time_pass( $timepass );
				$time_pass_response[ $time_pass['uid'] ] = $tp_id;
				$order_items[ 'tlp_' . $tp_id ]          = absint( $time_pass['order'] );
			}
		}

		$subscription_instance = Subscription::get_instance();
		$subscription_response = [];

		if ( ! empty( $subscriptions ) ) {
			// Store time pass.
			foreach ( $subscriptions as $subscription_data ) {
				$subscription['id']          = sanitize_text_field( $subscription_data['sub_id'] );
				$subscription['title']       = sanitize_text_field( wp_unslash( $subscription_data['title'] ) );
				$subscription['description'] = sanitize_text_field( wp_unslash( $subscription_data['desc'] ) );
				$subscription['price']       = floatval( $subscription_data['price'] );
				$subscription['revenue']     = sanitize_text_field( $subscription_data['revenue'] );
				$subscription['duration']    = sanitize_text_field( $subscription_data['duration'] );
				$subscription['period']      = sanitize_text_field( $subscription_data['period'] );
				$subscription['access_to']   = 'all'; // @todo make it dynamic

				$sub_id                                             = $subscription_instance->update_subscription( $subscription );
				$subscription_response[ $subscription_data['uid'] ] = $sub_id;
				$order_items[ 'sub_' . $sub_id ]                    = absint( $subscription_data['order'] );
			}
		}

		$paywall_instance->update_paywall_option_order( $paywall_id, $order_items );

		// Send success message.
		wp_send_json( [
			'success'       => true,
			'msg'           => empty( $paywall_data['id'] ) ? __( 'Paywall updated successfully!', 'revenue-generator' ) : __( 'Paywall saved successfully!', 'revenue-generator' ),
			'paywall_id'    => $paywall_id,
			'time_passes'   => $time_pass_response,
			'subscriptions' => $subscription_response,
		] );

	}

	/**
	 * Update the global currency config.
	 */
	public function update_currency_selection() {
		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

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
			'msg'     => __( 'Currency stored successfully!', 'revenue-generator' )
		] );

	}

	/**
	 * Update the global currency config.
	 */
	public function remove_purchase_option() {

		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$purchase_option_type = sanitize_text_field( filter_input( INPUT_POST, 'type', FILTER_SANITIZE_STRING ) );
		$purchase_option_id = sanitize_text_field( filter_input( INPUT_POST, 'id', FILTER_SANITIZE_STRING ) );

		$post_types_instance   = Post_Types::get_instance();
		$time_pass_instance = Time_Pass::get_instance();
		$subscription_instance = Subscription::get_instance();

		if ( 'individual' === $purchase_option_type ) {
			$post_types_instance->remove_individual_purchase_option();
		} elseif ( 'subscription'=== $purchase_option_type ) {
		} elseif ( 'timepass' === $purchase_option_type ) {
		}

	}
}
