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

		$post_meta     = get_post_meta( $post->ID );
		$is_deleted    = ( $post->post_status === 'draft' ) ? 1 : 0 ;

		$post_meta = $this->formatted_post_meta( $post_meta );


		$subscription                    = [];
		$subscription['id']              = $post_meta['_rg_id'];
		$subscription['title']           = $post->post_title;
		$subscription['description']     = $post->post_content;
		$subscription['is_deleted']      = $is_deleted;
		$subscription['price']           = $post_meta['price'];
		$subscription['expiry']           = $post_meta['expiry'];

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
		$post_meta_data   = [];

		/**
		 * rg_id - store the internal counter for subscription, this will be set as article_id in the config.
		 * _rg_price - store the pricing configuration array.
		 * _rg_expiry - store the content access expiry configuration array.
		 */
		$post_meta_data['rg_id'] = ( isset( $post_meta['_rg_id'][0] ) ) ? $post_meta['_rg_id'][0] : '';
		$post_meta_data['price'] = ( isset( $post_meta['_rg_price'][0] ) ) ? $post_meta['_rg_price'][0] : '';
		$post_meta_data['expiry'] = ( isset( $post_meta['_rg_expiry'][0] ) ) ? $post_meta['_rg_expiry'][0] : '';

		return $post_meta_data;
	}

}
