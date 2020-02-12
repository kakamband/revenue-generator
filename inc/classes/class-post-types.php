<?php
/**
 * Load all classes that registers a post type and define methods to handle supported post types.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;
use LaterPay\Revenue_Generator\Inc\Post_Types\Time_Pass;
use LaterPay\Revenue_Generator\Inc\Post_Types\Subscription;
use LaterPay\Revenue_Generator\Inc\Post_Types\Paywall;


defined( 'ABSPATH' ) || exit;

/**
 * Class Post_Types
 */
class Post_Types {

	use Singleton;

	/**
	 * To store instance of post type.
	 *
	 * @var array List of instance of post type.
	 */
	protected static $instances = [];

	/**
	 * Construct method.
	 */
	protected function __construct() {
		$this->register_post_types();
	}

	/**
	 * To initiate all post type instance.
	 *
	 * @return void
	 */
	protected function register_post_types() {

		self::$instances = [
			Time_Pass::SLUG    => Time_Pass::get_instance(),
			Subscription::SLUG => Subscription::get_instance(),
			Paywall::SLUG      => Paywall::get_instance(),
		];

	}

	/**
	 * To get instance of all post types.
	 *
	 * @return array List of instances of the post types.
	 */
	public static function get_instances() {
		return self::$instances;
	}

	/**
	 * Get slug list of all registered custom post types.
	 *
	 * @return array List of slugs.
	 */
	public static function get_registered_post_types() {
		return array_keys( self::$instances );
	}

	/**
	 * Get slug list of all post types whose content is allowed for sale..
	 *
	 * @return array List of slugs.
	 */
	protected static function get_allowed_post_types() {
		return [
			'post',
			'page'
		];
	}

	/**
	 * Get the latest published posts ID from supported types, defaults to POST.
	 *
	 * @return bool|int
	 */
	public static function get_latest_post_for_preview() {
		$supported_post_types = self::get_allowed_post_types();

		foreach ( $supported_post_types as $post_type ) {
			$latest_post = get_posts( [
				'posts_per_page' => 1,
				'post_type'      => $post_type,
			] );

			// Check if latest post has data, if yes return latest ID of supported type.
			if ( ! empty( $latest_post ) && isset( $latest_post[0] ) ) {
				return $latest_post[0]->ID;
			}
		}

		return false;
	}

	/**
	 * Return a structured data for preview in paywall creation.
	 *
	 * @param int $post_id Post ID
	 *
	 * @return array
	 */
	public static function get_formatted_post_data( $post_id ) {

		// Get all post data and return select fields for preview.
		$post_data = get_post( $post_id );

		if ( empty( $post_data ) ) {
			return [];
		}

		return [
			'ID' => $post_data->ID,
			'title' => $post_data->post_title,
			'excerpt' => $post_data->excerpt,
			'post_content' => apply_filters( 'the_content', $post_data->post_content ),
		];
	}
}
