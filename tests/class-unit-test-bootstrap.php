<?php
/**
 * Loads and prepares everything for unit testing.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Tests;

/**
 * Plugin Unit Tests Bootstrap.
 */
class Unit_Tests_Bootstrap {

	/**
	 * The unit tests bootstrap instance.
	 *
	 * @var Unit_Tests_Bootstrap
	 */
	protected static $instance = null;

	/**
	 * The directory where the WP unit tests library is installed.
	 *
	 * @var string
	 */
	public $wp_tests_dir;

	/**
	 * The testing directory.
	 *
	 * @var string
	 */
	public $tests_dir;

	/**
	 * The directory of this plugin.
	 *
	 * @var string
	 */
	public $plugin_dir;

	/**
	 * Setup the unit testing environment.
	 */
	public function __construct() {

		define( 'IS_UNIT_TESTING', true );

		$this->wp_tests_dir = getenv( 'WP_TESTS_DIR' );

		if ( ! $this->wp_tests_dir ) {
			$this->wp_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
		}

		$this->tests_dir  = dirname( __FILE__ );
		$this->plugin_dir = dirname( $this->tests_dir );

		// Load test function so tests_add_filter() is available.
		require_once $this->wp_tests_dir . '/includes/functions.php';

		// Load Plugin.
		tests_add_filter( 'muplugins_loaded', array( $this, 'load_plugin' ) );

		// Load the WP testing environment.
		require_once $this->wp_tests_dir . '/includes/bootstrap.php';

	}

	/**
	 * Load Plugin.
	 */
	public function load_plugin() {
		// Suppress warning and only reports errors.
		error_reporting( E_CORE_ERROR | E_CORE_WARNING | E_COMPILE_ERROR | E_ERROR | E_WARNING | E_PARSE | E_USER_ERROR | E_USER_WARNING | E_RECOVERABLE_ERROR ); // phpcs:ignore
		require_once $this->plugin_dir . '/revenue-generator.php'; // phpcs:ignore
		require_once $this->tests_dir . '/phpunit/helpers/class-utility.php';
	}

	/**
	 * Get the single class instance.
	 *
	 * @return Unit_Tests_Bootstrap
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}

Unit_Tests_Bootstrap::instance();
