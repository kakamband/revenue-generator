<?php
/**
 * Register Time Pass post type.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc\Post_Types;

defined( 'ABSPATH' ) || exit;

/**
 * Class Time_Pass
 */
class Time_Pass extends Base {

	/**
	 * Slug of post type.
	 *
	 * @var string
	 */
	const SLUG = 'rg_pass';

	/**
	 * To get list of labels for time pass post type.
	 *
	 * @return array
	 */
	public function get_labels() {

		return [
			'name'          => __( 'Time Passes', 'revenue-generator' ),
			'singular_name' => __( 'Time Pass', 'revenue-generator' ),
		];

	}

}
