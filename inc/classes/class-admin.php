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
		add_action( 'wp_ajax_rg_remove_paywall', [ $this, 'remove_paywall' ] );
		add_action( 'wp_ajax_rg_search_preview_content', [ $this, 'search_preview_content' ] );
		add_action( 'wp_ajax_rg_select_preview_content', [ $this, 'select_preview_content' ] );
		add_action( 'wp_ajax_rg_search_term', [ $this, 'select_search_term' ] );
		add_action( 'wp_ajax_rg_clear_category_meta', [ $this, 'clear_category_meta' ] );
		add_action( 'wp_ajax_rg_complete_tour', [ $this, 'complete_tour' ] );
		add_action( 'wp_ajax_rg_verify_account_credentials', [ $this, 'verify_account_credentials' ] );
		add_action( 'wp_ajax_rg_post_permalink', [ $this, 'get_post_permalink' ] );
		add_action( 'wp_ajax_rg_activate_paywall', [ $this, 'activate_paywall' ] );
		add_action( 'wp_ajax_rg_disable_paywall', [ $this, 'disable_paywall' ] );
		add_action( 'wp_ajax_rg_restart_tour', [ $this, 'restart_tour' ] );
		add_action( 'wp_ajax_rg_set_paywall_order', [ $this, 'set_paywall_sort_order' ] );
	}

	/**
	 * Load required assets in backend.
	 */
	protected static function load_assets() {
		// Localize required data.
		$current_global_options = Config::get_global_options();

		// Check if setup is done, and load page accordingly.
		$is_welcome_setup_done = empty( $current_global_options['average_post_publish_count'] ) ? false : true;

		$currency_limits   = Config::get_currency_limits();
		$merchant_currency = '';

		if ( ! empty( $current_global_options['merchant_currency'] ) ) {
			$merchant_currency = $currency_limits[ $current_global_options['merchant_currency'] ];
		}

		$admin_menus  = self::get_admin_menus();
		$paywall_base = empty( $admin_menus['paywall'] ) ? '' : add_query_arg( [ 'page' => $admin_menus['paywall']['url'] ], admin_url( 'admin.php' ) );

		// Script date required for operations.
		$rg_script_data = [
			'globalOptions'    => $current_global_options,
			'ajaxUrl'          => admin_url( 'admin-ajax.php' ),
			'rg_paywall_nonce' => wp_create_nonce( 'rg_paywall_nonce' ),
			'currency'         => $merchant_currency,
			'locale'           => get_locale(),
			'paywallPageBase'  => $paywall_base,
			'signupURL'        => [
				'US' => 'https://web.uselaterpay.com/dialog/entry/?redirect_to=/merchant/add/#/signup',
				'EU' => 'https://web.laterpay.net/dialog/entry/?redirect_to=/merchant/add/#/signup',
			],
			'defaultConfig'    => [
				'timepass'     => [
					'title'       => esc_html__( '24 Hour Pass', 'revenue-generator' ),
					'description' => esc_html__( 'Enjoy unlimited access to all our content for 24 hours.', 'revenue-generator' ),
					'price'       => 2.49,
					'revenue'     => 'sis',
					'duration'    => 'h',
					'period'      => '24',
				],
				'subscription' => [
					'title'       => esc_html__( '1 Month Subscription', 'revenue-generator' ),
					'description' => esc_html__( 'Enjoy unlimited access to all our content for one month.', 'revenue-generator' ),
					'price'       => 4.99,
					'revenue'     => 'sis',
					'duration'    => 'm',
					'period'      => '1',
				]
			]
		];

		// If setup is not done.
		if ( ! $is_welcome_setup_done ) {
			$rg_script_data['rg_global_config_nonce'] = wp_create_nonce( 'rg_global_config_nonce' );
		}

		// Create variable and add data.
		$rg_global_data = 'var revenueGeneratorGlobalOptions = ' . wp_json_encode( $rg_script_data ) . '; ';
		wp_add_inline_script( 'revenue-generator', $rg_global_data, 'before' );

		wp_enqueue_script( 'revenue-generator' );
		wp_enqueue_style( 'revenue-generator' );
		wp_enqueue_style( 'revenue-generator-select2' );
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
			80
		);

		// Get all submenus and add it.
		$menus = self::get_admin_menus();
		if ( ! empty( $menus ) ) {
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
	 * @param \WP_Screen $current_screen Current \WP_Screen object.
	 */
	public function redirect_merchant( $current_screen ) {
		$current_global_options = Config::get_global_options();
		$admin_menus            = self::get_admin_menus();

		$dashboard_pages = [ 'toplevel_page_revenue-generator', 'revenue-generator_page_revenue-generator-dashboard' ];
		if ( in_array( $current_screen->id, $dashboard_pages ) && ! empty( $admin_menus ) ) {
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

		$paywall_instance = Paywall::get_instance();
		$admin_menus      = self::get_admin_menus();

		// Paywall sorting orders.
		$allowed_sort_order  = [ 'ASC', 'DESC' ];
		$sort_order          = filter_input( INPUT_GET, 'sort_by', FILTER_SANITIZE_STRING );
		$paywall_filter_args = [
			'order' => 'DESC',
		];

		// If no sort param is set default to DESC.
		if ( empty( $sort_order ) ) {
			$sort_order = 'DESC';
		} else {
			$sort_order = in_array( strtoupper( $sort_order ), $allowed_sort_order ) ? strtoupper( $sort_order ) : 'DESC';
		}

		$paywall_filter_args['order'] = $sort_order;
		$dashboard_paywalls           = $paywall_instance->get_all_paywalls( $paywall_filter_args );

		$dashboard_page_data = [
			'new_paywall_url'    => add_query_arg( [ 'page' => $admin_menus['paywall']['url'] ], admin_url( 'admin.php' ) ),
			'current_sort_order' => $sort_order,
			'paywalls'           => $dashboard_paywalls,
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

		$current_paywall  = filter_input( INPUT_GET, 'current_paywall', FILTER_SANITIZE_NUMBER_INT );
		$rg_category_data = '';

		// Load paywall related content if found else load requested content for new paywall.
		if ( ! empty( $current_paywall ) ) {
			// Get selected post info from paywall.
			$formatted_post_data = $post_types->get_post_post_content_by_paywall_id( $current_paywall );

			// Get paywall options data.
			$purchase_options_data = $post_types->get_post_purchase_options_by_paywall_id( $current_paywall );
			$purchase_options      = $post_types->convert_to_purchase_options( $purchase_options_data );

			$paywall_data = $purchase_options['paywall'];

			if ( ! empty( $paywall_data ) ) {
				if ( 'category' === $paywall_data['access_to'] || 'exclude_category' === $paywall_data['access_to'] ) {
					$rg_category_id = $paywall_data['access_entity'];
					if ( ! empty( $rg_category_id ) ) {
						$rg_category_data = get_term( $rg_category_id, 'category' );
					}
				}
			}
		} else {

			$post_preview_id     = filter_input( INPUT_GET, 'preview_post_id', FILTER_SANITIZE_NUMBER_INT );
			$target_post_id      = 0;
			$formatted_post_data = [];

			if ( ! empty( $post_preview_id ) ) {
				$target_post_id = $post_preview_id;
			}

			if ( ! empty( $target_post_id ) ) {
				$formatted_post_data = $post_types->get_formatted_post_data( $target_post_id );
			}

			// Get formatted data again for latest post id.
			if ( empty( $formatted_post_data ) ) {
				// Get latest post info for preview.
				$target_post_id = $post_types->get_latest_post_for_preview();;
			}

			$formatted_post_data = $post_types->get_formatted_post_data( $target_post_id );

			// Get paywall options data.
			$purchase_options_data = $post_types->get_post_purchase_options_by_post_id( $target_post_id, $formatted_post_data );
			$purchase_options      = $post_types->convert_to_purchase_options( $purchase_options_data );
		}

		// Set currency symbol.
		$default_option_data = $post_types->get_default_purchase_option();
		$symbol              = '';
		if ( ! empty( $config_data['merchant_currency'] ) ) {
			$symbol = 'USD' === $config_data['merchant_currency'] ? '$' : '€';
		}

		// Set merchant verification status.
		$is_merchant_verified = false;
		if ( 1 === absint( $config_data['is_merchant_verified'] ) ) {
			$is_merchant_verified = true;
		}

		$admin_menus = self::get_admin_menus();

		// Paywall purchase options data.
		$post_preview_data = [
			'rg_preview_post'       => $formatted_post_data,
			'purchase_options_data' => $purchase_options,
			'default_option_data'   => $default_option_data,
			'merchant_symbol'       => $symbol,
			'rg_category_data'      => $rg_category_data,
			'is_merchant_verified'  => $is_merchant_verified,
			'dashboard_url'         => add_query_arg( [ 'page' => $admin_menus['dashboard']['url'] ], admin_url( 'admin.php' ) ),
			'action_icons'          => [
				'high_count_icon'    => Config::$plugin_defaults['img_dir'] . 'high-publish.svg',
				'lp_icon'            => Config::$plugin_defaults['img_dir'] . 'lp-logo-icon.svg',
				'option_add'         => Config::$plugin_defaults['img_dir'] . 'add-option.svg',
				'option_edit'        => Config::$plugin_defaults['img_dir'] . 'edit-option.svg',
				'option_remove'      => Config::$plugin_defaults['img_dir'] . 'remove-option.svg',
				'option_move_up'     => Config::$plugin_defaults['img_dir'] . 'move-up.svg',
				'option_move_down'   => Config::$plugin_defaults['img_dir'] . 'move-down.svg',
				'option_move_around' => Config::$plugin_defaults['img_dir'] . 'move-option.svg',
				'option_warning'     => Config::$plugin_defaults['img_dir'] . 'option-warning.svg',
				'option_info'        => Config::$plugin_defaults['img_dir'] . 'option-info.svg',
				'option_dynamic'     => Config::$plugin_defaults['img_dir'] . 'option-dynamic.svg',
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
		$menus                  = [];
		$current_global_options = Config::get_global_options();

		// Check if tutorial is completed, and load page accordingly.
		$is_welcome_setup_done = empty( $current_global_options['average_post_publish_count'] ) ? false : true;

		if ( $is_welcome_setup_done ) {
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
		}

		return $menus;
	}

	/**
	 * Update Paywall.
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
		$paywall['preview_id']    = sanitize_text_field( wp_unslash( $paywall_data['preview_id'] ) );
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
				if ( isset( $time_pass['tlp_id'] ) ) {
					$timepass['id'] = sanitize_text_field( $time_pass['tlp_id'] );
				}
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
				if ( isset( $subscription_data['sub_id'] ) ) {
					$subscription['id'] = sanitize_text_field( $subscription_data['sub_id'] );
				}
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

		// Set redirect for saved paywall.
		$admin_menus   = self::get_admin_menus();
		$dashboard_url = add_query_arg( [ 'page' => $admin_menus['dashboard']['url'] ], admin_url( 'admin.php' ) );

		// Send success message.
		wp_send_json( [
			'success'       => true,
			'redirect_to'   => $dashboard_url,
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
			$rg_global_options[ $config_key ]     = $config_value;
			$region                               = 'USD' === $config_value ? 'US' : 'EU';
			$rg_global_options['merchant_region'] = $region;
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
		$purchase_option_id   = sanitize_text_field( filter_input( INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT ) );
		$paywall_id           = sanitize_text_field( filter_input( INPUT_POST, 'paywall_id', FILTER_SANITIZE_NUMBER_INT ) );

		$paywall_instance      = Paywall::get_instance();
		$time_pass_instance    = Time_Pass::get_instance();
		$subscription_instance = Subscription::get_instance();

		$msg = '';
		if ( 'individual' === $purchase_option_type ) {
			$paywall_instance->remove_individual_purchase_option( $purchase_option_id );
			$msg = __( 'Purchase option removed!', 'revenue-generator' );
		} elseif ( 'subscription' === $purchase_option_type ) {
			if ( $subscription_instance->remove_subscription_purchase_option( $purchase_option_id, $paywall_id ) ) {
				$msg = __( 'Subscription removed!', 'revenue-generator' );
			} else {
				$msg = __( 'Unable to remove Subscription, something went wrong!', 'revenue-generator' );
			}
		} elseif ( 'timepass' === $purchase_option_type ) {
			if ( $time_pass_instance->remove_time_pass_purchase_option( $purchase_option_id, $paywall_id ) ) {
				$msg = __( 'Time Pass removed!', 'revenue-generator' );
			} else {
				$msg = __( 'Unable to remove Time Pass, something went wrong!', 'revenue-generator' );
			}
		}

		// Send success message.
		wp_send_json( [
			'success' => true,
			'msg'     => $msg
		] );

	}

	/**
	 * Update the global currency config.
	 */
	public function remove_paywall() {

		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$paywall_id = sanitize_text_field( filter_input( INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT ) );

		$paywall_instance = Paywall::get_instance();
		$removal_data     = $paywall_instance->remove_paywall( $paywall_id );
		$removal_status   = $removal_data['success'];
		$preview_id       = $removal_data['preview_post_id'];

		if ( true === $removal_status ) {
			// Send success message.
			wp_send_json( [
				'success'    => true,
				'preview_id' => $preview_id,
				'msg'        => __( 'Paywall removed!', 'revenue-generator' )
			] );
		} else {
			// Send success message.
			wp_send_json( [
				'success' => false,
				'msg'     => __( 'Unable to remove Paywall, something went wrong!', 'revenue-generator' )
			] );
		}

	}

	/**
	 * Search content for post preview selection.
	 */
	public function search_preview_content() {

		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$search_term = sanitize_text_field( filter_input( INPUT_POST, 'search_term', FILTER_SANITIZE_STRING ) );

		$post_types_instance = Post_Types::get_instance();
		$preview_posts       = $post_types_instance->get_preview_content_selection( $search_term );

		if ( ! empty( $preview_posts ) ) {
			wp_send_json( [
				'success'       => true,
				'preview_posts' => $preview_posts
			] );
		} else {
			wp_send_json( [
				'success'       => false,
				'msg'           => __( 'No matching content found!', 'revenue-generator' ),
				'preview_posts' => []
			] );
		}
	}

	/**
	 * Select content for post preview.
	 */
	public function select_preview_content() {

		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$post_preview_id = sanitize_text_field( filter_input( INPUT_POST, 'post_preview_id', FILTER_SANITIZE_NUMBER_INT ) );

		if ( ! empty( $post_preview_id ) ) {

			$admin_menus = self::get_admin_menus();

			$paywall_instance = Paywall::get_instance();
			$paywall_id       = $paywall_instance->get_connected_paywall_by_post( $post_preview_id );

			// Preview page URL.
			$preview_query_args = [
				'page' => $admin_menus['paywall']['url'],
			];

			// If a paywall exists for the selected content redirect merchant accordingly.
			if ( ! empty( $paywall_id ) ) {
				$preview_query_args['current_paywall'] = $paywall_id;
			} else {
				$preview_query_args['preview_post_id'] = $post_preview_id;
			}

			// Create redirect URL.
			$post_preview_page = add_query_arg(
				$preview_query_args,
				admin_url( 'admin.php' )
			);

			// Send success message.
			wp_send_json( [
				'success'     => true,
				'redirect_to' => $post_preview_page,
			] );

		}
	}

	/**
	 * Get categories to be added in a paywall.
	 */
	public function select_search_term() {
		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$post_term = sanitize_text_field( filter_input( INPUT_POST, 'term', FILTER_SANITIZE_STRING ) );

		$args = [];
		if ( ! empty( $post_term ) ) {
			$args['name__like'] = $post_term;
		}

		$category_instance = Categories::get_instance();

		wp_send_json( [
			'success'    => true,
			'categories' => $category_instance->get_applicable_categories( $args )
		] );
	}

	/**
	 * Clear category meta data on new selection.
	 */
	public function clear_category_meta() {
		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$rg_category_id    = sanitize_text_field( filter_input( INPUT_POST, 'rg_category_id', FILTER_SANITIZE_NUMBER_INT ) );
		$category_instance = Categories::get_instance();

		if ( $category_instance->clear_category_paywall_meta( $rg_category_id ) ) {
			wp_send_json_success();
		} else {
			wp_send_json_error();
		}
	}

	/**
	 * Complete the welcome tour.
	 */
	public function complete_tour() {
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
			'msg'     => __( 'Selection stored successfully!', 'revenue-generator' )
		] );
	}

	/**
	 * Verify account credentials and do a test purchase.
	 */
	public function verify_account_credentials() {
		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$merchant_id  = sanitize_text_field( filter_input( INPUT_POST, 'merchant_id', FILTER_SANITIZE_STRING ) );
		$merchant_key = sanitize_text_field( filter_input( INPUT_POST, 'merchant_key', FILTER_SANITIZE_STRING ) );

		$client_account_instance = Client_Account::get_instance();
		$rg_merchant_credentials = $client_account_instance->get_merchant_credentials();

		// Check and verify merchant id data.
		if ( ! empty( $merchant_id ) ) {
			$rg_merchant_credentials['merchant_id'] = $merchant_id;
		}

		// Check and verify merchant id data.
		if ( ! empty( $merchant_key ) ) {
			$rg_merchant_credentials['merchant_key'] = $merchant_key;
		}

		// Update the option value.
		update_option( 'lp_rg_merchant_credentials', $rg_merchant_credentials );

		$is_valid = $client_account_instance->validate_merchant_account();

		// Set merchant status to verified.
		if ( true === $is_valid ) {
			$rg_global_options                         = Config::get_global_options();
			$rg_global_options['is_merchant_verified'] = '1';
			update_option( 'lp_rg_global_options', $rg_global_options );
		}

		// Send success message.
		wp_send_json( [
			'success' => $is_valid,
		] );
	}

	/**
	 * Get post permalink for requested post.
	 */
	public function get_post_permalink() {
		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$preview_post_id = sanitize_text_field( filter_input( INPUT_POST, 'preview_post_id', FILTER_SANITIZE_NUMBER_INT ) );

		// Check and verify data exits.
		if ( ! empty( $preview_post_id ) ) {
			wp_send_json( [
				'success'     => true,
				'redirect_to' => get_permalink( $preview_post_id )
			] );
		}
	}

	/**
	 * Activate paywall.
	 */
	public function activate_paywall() {
		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$paywall_id = sanitize_text_field( filter_input( INPUT_POST, 'paywall_id', FILTER_SANITIZE_NUMBER_INT ) );

		// Check and verify data exits.
		if ( ! empty( $paywall_id ) ) {
			$paywall_instance = Paywall::get_instance();
			$paywall_instance->activate_paywall( $paywall_id );

			wp_send_json( [
				'success'      => true,
				'has_paywalls' => $paywall_instance->get_paywalls_count() > 1,
			] );
		}
	}

	/**
	 * Disable paywall.
	 */
	public function disable_paywall() {
		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$paywall_id = sanitize_text_field( filter_input( INPUT_POST, 'paywall_id', FILTER_SANITIZE_NUMBER_INT ) );

		// Check and verify data exits.
		if ( ! empty( $paywall_id ) ) {
			$paywall_instance = Paywall::get_instance();
			$result           = (bool) $paywall_instance->disable_paywall( $paywall_id );
			wp_send_json( [
				'success' => $result,
				'msg'     => $result ? __( 'Paywall Disabled!', 'revenue-generator' ) : __( 'Something went wrong!', 'revenue-generator' )
			] );
		}
	}

	/**
	 * Restart the tour.
	 */
	public function restart_tour() {
		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$should_restart = filter_input( INPUT_POST, 'restart_tour', FILTER_SANITIZE_NUMBER_INT );

		// Check and verify data exits.
		if ( 1 === absint( $should_restart ) ) {
			// Reset tutorial.
			$rg_global_options                          = Config::get_global_options();
			$rg_global_options['is_tutorial_completed'] = 0;
			update_option( 'lp_rg_global_options', $rg_global_options );
			wp_send_json_success();
		}
	}

	/**
	 * Set paywall sort order.
	 */
	public function set_paywall_sort_order() {

		// Verify authenticity.
		check_ajax_referer( 'rg_paywall_nonce', 'security' );

		// Get all data and sanitize it.
		$rg_sort_order    = sanitize_text_field( filter_input( INPUT_POST, 'rg_sort_order', FILTER_SANITIZE_STRING ) );
		$rg_dashboard_url = sanitize_text_field( filter_input( INPUT_POST, 'rg_current_url', FILTER_SANITIZE_URL ) );

		if ( ! empty( $rg_sort_order ) ) {

			// Set sort by order.
			$preview_query_args['sort_by'] = $rg_sort_order;

			// Create redirect URL.
			$dashboard_sort_url = add_query_arg(
				$preview_query_args,
				$rg_dashboard_url
			);

			// Send success message.
			wp_send_json( [
				'success'     => true,
				'redirect_to' => $dashboard_sort_url,
			] );
		}
	}
}
