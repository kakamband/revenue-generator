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

		$time_pass_count = wp_count_posts( static::SLUG );

		$result = ( ( $ignore_deleted === true ) ? $time_pass_count->publish : $time_pass_count->publish + $time_pass_count->draft );

		return absint( $result );
	}

	/**
	 * Get all active time passes.
	 *
	 * @return array of time passes.
	 */
	public function get_active_time_passes() {
		return $this->get_all_time_passes( true );
	}

	/**
	 * Get all time passes.
	 *
	 * @param bool $ignore_deleted ignore deleted time passes
	 *
	 * @return array list of time passes
	 */
	public function get_all_time_passes( $ignore_deleted = false ) {

		$query_args = array(
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish', 'draft' ],
			'posts_per_page' => 100,
			'no_found_rows'  => true,
		);

		// Don't include the deleted time passes.
		if ( $ignore_deleted ) {
			$query_args['post_status'] = 'publish';
		}

		// Initialize WP_Query without args.
		$get_time_passes = new \WP_Query();

		// Get posts for requested args.
		$posts       = $get_time_passes->query( $query_args );
		$time_passes = [];

		foreach ( $posts as $key => $post ) {
			$time_passes[ $key ] = $this->formatted_time_pass( $post );
		}

		return $time_passes;
	}

	/**
	 * Returns relevant fields for time pass of given WP_Post
	 *
	 * @param \WP_Post $post Post to transform
	 *
	 * @return array Time Pass instance as array
	 */
	private function formatted_time_pass( $post ) {

		$post_meta = get_post_meta( $post->ID );
		$is_active = ( $post->post_status === 'draft' ) ? 1 : 0;

		$post_meta = $this->formatted_post_meta( $post_meta );

		$time_pass                  = [];
		$time_pass['id']            = $post_meta['_rg_id'];
		$time_pass['title']         = $post->post_title;
		$time_pass['description']   = $post->post_content;
		$time_pass['price']         = $post_meta['price'];
		$time_pass['expiry']        = $post_meta['expiry'];
		$time_pass['is_active']     = $is_active;
		$time_pass['access_to']     = $post_meta['access_to'];
		$time_pass['access_entity'] = $post_meta['access_entity'];

		return $time_pass;
	}

	/**
	 * Check post meta has a values.
	 *
	 * @param array $post_meta Post meta values fetched form database
	 *
	 * @return array
	 */
	private function formatted_post_meta( $post_meta ) {
		$post_meta_data = [];

		/**
		 * _rg_id - store the internal counter for time pass, this will be set as article_id in the config.
		 * _rg_price - store the pricing configuration array.
		 * _rg_expiry - store the content access expiry configuration array.
		 * _rg_access_to - store the content to which the time pass will allow access, can be category / all.
		 * _rg_access_entity - store the id to which the time pass will allow access if access to is category.
		 */
		$post_meta_data['rg_id']         = ( isset( $post_meta['_rg_id'][0] ) ) ? $post_meta['_rg_id'][0] : '';
		$post_meta_data['price']         = ( isset( $post_meta['_rg_price'][0] ) ) ? $post_meta['_rg_price'][0] : '';
		$post_meta_data['expiry']        = ( isset( $post_meta['_rg_expiry'][0] ) ) ? $post_meta['_rg_expiry'][0] : '';
		$post_meta_data['access_to']     = ( isset( $post_meta['_rg_access_to'][0] ) ) ? $post_meta['_rg_access_to'][0] : '';
		$post_meta_data['access_entity'] = ( isset( $post_meta['_rg_access_entity'][0] ) ) ? $post_meta['_rg_access_entity'][0] : '';

		return $post_meta_data;
	}

	/**
	 * Get all time passes that apply to a given post.
	 *
	 * @param bool $ignore_deleted ignore deleted time passes
	 *
	 * @return array $time_passes list of time passes
	 */
	public function get_time_passes_by_criteria( $ignore_deleted = true ) {

		$query_args = [
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish', 'draft' ],
			'posts_per_page' => 100,
			'no_found_rows'  => true,
		];

		$meta_query = array(
			'relation' => 'OR',
			array(
				'key'     => '_rg_access_to',
				'value'   => 'all',
				'compare' => '=',
			),
		);

		if ( $ignore_deleted ) {
			$query_args['post_status'] = 'publish';
		}

		// Meta query used to get all time passes which are applicable.
		$query_args['meta_query'] = $meta_query;

		// Initialize WP_Query without args.
		$get_time_passes_query = new \WP_Query();

		// Get posts for requested args.
		$posts       = $get_time_passes_query->query( $query_args );
		$time_passes = [];

		foreach ( $posts as $key => $post ) {
			$time_passes[ $key ] = $this->formatted_time_pass( $post );
		}

		return $time_passes;
	}

	/**
	 * Update time pass data.
	 *
	 * @param array $time_pass_data Time Pass data.
	 *
	 * @return int|\WP_Error
	 */
	public function update_time_pass( $time_pass_data ) {
		if ( empty( $time_pass_data['id'] ) ) {
			$time_pass_id = wp_insert_post( [
				'post_content' => $time_pass_data['description'],
				'post_title'   => $time_pass_data['title'],
				'post_status'  => 'publish',
				'post_type'    => static::SLUG,
				'meta_input'   => [
					'_rg_price'    => $time_pass_data['price'],
					'_rg_revenue'  => $time_pass_data['revenue'],
					'_rg_duration' => $time_pass_data['duration'],
					'_rg_period'   => $time_pass_data['period'],
				],
			] );
		} else {
			$paywall_id = $time_pass_data['id'];
			wp_update_post( [
				'ID'           => $paywall_id,
				'post_content' => $time_pass_data['description'],
				'post_title'   => $time_pass_data['title'],
			] );

			update_post_meta( $paywall_id, '_rg_price', $time_pass_data['price'] );
			update_post_meta( $paywall_id, '_rg_revenue', $time_pass_data['revenue'] );
			update_post_meta( $paywall_id, '_rg_duration', $time_pass_data['duration'] );
			update_post_meta( $paywall_id, '_rg_period', $time_pass_data['period'] );
		}

		return $time_pass_id;
	}

}
