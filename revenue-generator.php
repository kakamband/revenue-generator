<?php
/**
 * Plugin Name: Revenue Generator
 * Description: Monetize your blog and content with LaterPay's Revenue Generator.
 * Plugin URI: https://github.com/laterpay/revenue-generator
 * Version: 1.0.0-beta1
 * Author: laterpay
 * Text Domain: revenue-generator
 * Author URI: https://laterpay.net/
 * Domain Path: /languages/
 *
 * @package revenue-generator
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'REVENUE_GENERATOR_PLUGIN_FILE' ) ) {
	// Define plugin main file.
	define( 'REVENUE_GENERATOR_PLUGIN_FILE', __FILE__ );
}

if ( ! defined( 'REVENUE_GENERATOR_PLUGIN_DIR' ) ) {
	// Define plugin directory path.
	define( 'REVENUE_GENERATOR_PLUGIN_DIR', untrailingslashit( plugin_dir_path( REVENUE_GENERATOR_PLUGIN_FILE ) ) );
}

// Register the autoloader.
require_once REVENUE_GENERATOR_PLUGIN_DIR . '/inc/helpers/autoloader.php';
require_once REVENUE_GENERATOR_PLUGIN_DIR . '/vendor/laterpay/laterpay-client-php/autoload.php';

use \LaterPay\Revenue_Generator\Inc\Plugin;

// Initialize the main class.
Plugin::get_instance();
