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

	/**
	 * Get count of existing time passes.
	 *
	 * @param bool $ignore_deleted ignore count of deleted pass.
	 *
	 * @return int number of defined time passes
	 */
	public static function get_time_passes_count( $ignore_deleted = false ) {

		$timepass_count = wp_count_posts( static::SLUG );

		$result = ( ( $ignore_deleted === true ) ? $timepass_count->publish : $timepass_count->publish + $timepass_count->draft );

		return absint( $result );
	}

}
