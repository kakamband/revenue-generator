<?php
/**
 * Register Subscription post type.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc\Post_Types;

defined( 'ABSPATH' ) || exit;

/**
 * Class Subscription
 */
class Subscription extends Base {

	/**
	 * Slug of post type.
	 *
	 * @var string
	 */
	const SLUG = 'rg_subscription';

	/**
	 * To get list of labels for subscription post type.
	 *
	 * @return array
	 */
	public function get_labels() {

		return [
			'name'          => __( 'Subscriptions', 'revenue-generator' ),
			'singular_name' => __( 'Subscription', 'revenue-generator' ),
		];

	}

	/**
	 * Get count of existing subscriptions.
	 *
	 * @param bool $ignore_deleted to get count of deleted subscription or not.
	 *
	 * @return int number of defined subscriptions
	 */
	public static function get_subscriptions_count( $ignore_deleted = false ) {

		$subscriptions_count = wp_count_posts( static::SLUG );

		$result = ( ( $ignore_deleted === true ) ? $subscriptions_count->publish : $subscriptions_count->publish + $subscriptions_count->draft );

		return absint( $result );
	}

	/**
	 * Get all active subscriptions.
	 *
	 * @return array of subscriptions
	 */
	public function get_active_subscriptions() {
		return $this->get_all_subscriptions( true );
	}

	/**
	 * Get all subscriptions.
	 *
	 * @param bool $ignore_deleted ignore deleted subscriptions
	 *
	 * @return array list of subscriptions
	 */
	public function get_all_subscriptions( $ignore_deleted = false ) {

		$query_args = array(
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish', 'draft' ],
			'posts_per_page' => 100,
			'no_found_rows'  => true,
		);

		// Don't include the deleted subscriptions.
		if ( $ignore_deleted ) {
			$query_args['post_status'] = 'publish';
		}


		// Initialize WP_Query without args.
		$get_subscriptions = new \WP_Query();

		// Get posts for requested args.
		$posts         = $get_subscriptions->query( $query_args );
		$subscriptions = [];

		foreach ( $posts as $key => $post ) {
			$subscriptions[ $key ] = $this->formatted_subscription( $post );
		}

		return $subscriptions;
	}

	/**
	 * Returns relevant fields for subscription of given WP_Post
	 *
	 * @param \WP_Post $post Post to transform
	 *
	 * @return array Subscription instance as array
	 */
	private function formatted_subscription( $post ) {

		$post_meta = get_post_meta( $post->ID );
		$is_active = ( $post->post_status === 'draft' ) ? 0 : 1;

		$post_meta = $this->formatted_post_meta( $post_meta );

		$subscription                    = [];
		$subscription['id']            = $post->ID;
		$subscription['title']           = $post->post_title;
		$subscription['description']     = $post->post_content;
		$subscription['price']           = $post_meta['price'];
		$subscription['revenue']         = $post_meta['revenue'];
		$subscription['duration']        = $post_meta['duration'];
		$subscription['period']          = $post_meta['period'];
		$subscription['is_active']       = $is_active;
		$post_meta_data['access_to']     = $post_meta['access_to'];
		$post_meta_data['access_entity'] = $post_meta['access_entity'];

		return $subscription;
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
		 * _rg_price - store the pricing configuration array.
		 * _rg_expiry - store the content access expiry configuration array.
		 * _rg_access_to - store the content to which the subscription will allow access, can be category / all.
		 * _rg_access_entity - store the id to which the subscription will allow access if access to is category.
		 */
		$post_meta_data['price']         = ( isset( $post_meta['_rg_price'][0] ) ) ? $post_meta['_rg_price'][0] : '';
		$post_meta_data['revenue']       = ( isset( $post_meta['_rg_revenue'][0] ) ) ? $post_meta['_rg_revenue'][0] : '';
		$post_meta_data['duration']      = ( isset( $post_meta['_rg_duration'][0] ) ) ? $post_meta['_rg_duration'][0] : '';
		$post_meta_data['period']        = ( isset( $post_meta['_rg_period'][0] ) ) ? $post_meta['_rg_period'][0] : '';
		$post_meta_data['access_to']     = ( isset( $post_meta['_rg_access_to'][0] ) ) ? $post_meta['_rg_access_to'][0] : '';
		$post_meta_data['access_entity'] = ( isset( $post_meta['_rg_access_entity'][0] ) ) ? $post_meta['_rg_access_entity'][0] : '';

		return $post_meta_data;
	}


	/**
	 * Get all subscriptions that apply to a given post.
	 *
	 * @param bool $ignore_deleted ignore deleted subscriptions
	 *
	 * @return array $subscriptions list of subscriptions
	 */
	public function get_subscriptions_by_criteria( $ignore_deleted = true ) {

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

		// Meta query used to get all subscriptions which are applicable.
		$query_args['meta_query'] = $meta_query;

		// Initialize WP_Query without args.
		$get_subscriptions_query = new \WP_Query();

		// Get posts for requested args.
		$posts         = $get_subscriptions_query->query( $query_args );
		$subscriptions = [];

		foreach ( $posts as $key => $post ) {
			$subscriptions[ $key ] = $this->formatted_subscription( $post );
		}

		return $subscriptions;
	}

	/**
	 * Update subscription information.
	 *
	 * @param array $subscription_data Subscription data.
	 *
	 * @return int|\WP_Error
	 */
	public function update_subscription( $subscription_data ) {
		if ( empty( $subscription_data['id'] ) ) {
			$subscription_id = wp_insert_post( [
				'post_content' => $subscription_data['description'],
				'post_title'   => $subscription_data['title'],
				'post_status'  => 'publish',
				'post_type'    => static::SLUG,
				'meta_input'   => [
					'_rg_price'     => $subscription_data['price'],
					'_rg_revenue'   => $subscription_data['revenue'],
					'_rg_duration'  => $subscription_data['duration'],
					'_rg_period'    => $subscription_data['period'],
					'_rg_access_to' => $subscription_data['access_to'],
				],
			] );
		} else {
			$subscription_id = $subscription_data['id'];
			wp_update_post( [
				'ID'           => $subscription_id,
				'post_content' => $subscription_data['description'],
				'post_title'   => $subscription_data['title'],
			] );

			update_post_meta( $subscription_id, '_rg_price', $subscription_data['price'] );
			update_post_meta( $subscription_id, '_rg_revenue', $subscription_data['revenue'] );
			update_post_meta( $subscription_id, '_rg_duration', $subscription_data['duration'] );
			update_post_meta( $subscription_id, '_rg_access_to', $subscription_data['access_to'] );
		}

		return $subscription_id;
	}

	/**
	 * Get all subscriptions applicable to content.
	 *
	 * @return array
	 */
	public function get_applicable_subscriptions() {
		$subscriptions  = [];
		$all_subscriptions = $this->get_active_subscriptions();
		foreach ( $all_subscriptions as $subscription ) {
			$subscriptions[] = $subscription;
		}

		return $subscriptions;
	}
}
