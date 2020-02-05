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
 * Class Config
 */
class Config {

	use Singleton;

	/**
	 * Class Config construct method.
	 */
	protected function __construct() {
		$this->setup_options();
	}

	/**
	 * Setup plugin options.
	 */
	protected function setup_options() {
		// No options available, setup default options.

		// Check if plugin installation is fresh install.
		if ( false === get_option( 'lp_rg_version' ) ) {
			update_option( 'lp_rg_version', REVENUE_GENERATOR_VERSION );
		}

		// Fresh install.
		if ( false === get_option( 'lp_rg_global_options' ) ) {
			update_option( 'lp_rg_global_options',
				[
					'average_post_publish_count' => '',
					'merchant_currency'          => '',
					'is_tutorial_completed'      => '',
					'current_tutorial_progress'  => ''
				]
			);
		}

		// Handle plugin option update for version updates.
		if ( version_compare( REVENUE_GENERATOR_VERSION, get_option( 'lp_rg_version' ), '>' ) ) {
			// Handle plugin options on version update.
			// $this->add_update_options(); @todo Add version update logic.
		}
	}

	/**
	 * Returns plugin global options.
	 *
	 * @return array
	 */
	public static function get_global_options() {
		return get_option( 'lp_rg_global_options', [] );
	}

}
