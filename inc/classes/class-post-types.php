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
	public function get_latest_post_for_preview() {
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
	public function get_formatted_post_data( $post_id ) {

		// Get all post data and return select fields for preview.
		$post_data = get_post( $post_id );

		if ( empty( $post_data ) ) {
			return [];
		}

		// Generate a teaser for the post, if excerpt is empty.
		$post_content   = do_blocks( $post_data->post_content );
		$teaser_content = Utility::truncate(
			preg_replace( '/\s+/', ' ', strip_shortcodes( $post_content ) ),
			Utility::determine_number_of_words( $post_content ),
			array(
				'html'  => true,
				'words' => true,
			)
		);

		return [
			'ID'           => $post_data->ID,
			'title'        => $post_data->post_title,
			'excerpt'      => $post_data->excerpt,
			'teaser'       => $teaser_content,
			'post_content' => apply_filters( 'the_content', $post_data->post_content ),
		];
	}

	/**
	 * Check and verify if Time Passes and Subscriptions exist or not, if they do send the counts.
	 */
	public function has_purchase_options_available() {
		$time_passes_count   = Time_Pass::get_time_passes_count( true );
		$subscriptions_count = Subscription::get_subscriptions_count( true );

		if ( empty( $time_passes_count ) && empty( $subscriptions_count ) ) {
			return false;
		} else {
			return [
				'time_pass'    => $time_passes_count,
				'subscription' => $subscriptions_count
			];
		}
	}

	/**
	 * Get pricing options based on post data.
	 *
	 * @param array $post_data Post data for preview.
	 *
	 * @return array
	 */
	public function get_post_purchase_options( $post_data ) {
		// Global options data.
		$current_global_options = Config::get_global_options();

		// Get information on the post to create a pricing configuration.
		$purchase_options     = [];
		$post_tier            = $this->get_post_tier( $post_data['post_content'] );
		$purchase_options_all = Config::get_pricing_defaults( $current_global_options['average_post_publish_count'] );

		// Get individual article pricing based on post content word count, i.e "tier".
		$purchase_options['individual'] = $purchase_options_all['single_article'][ $post_tier ];

		// Check if we have existing time passes or subscriptions.
		$current_purchase_options = $this->has_purchase_options_available();

		/**
		 * - If no option exits, set the default pricing values.
		 * - If one of either options exist, add it to the pricing config.
		 */
		if ( false === $current_purchase_options ) {
			$purchase_options['time_passes'][]   = $purchase_options_all['time_pass'];
			$purchase_options['subscriptions'][] = $purchase_options_all['subscription'];

			if ( 'low' === $current_global_options['average_post_publish_count'] ) {
				unset( $purchase_options['time_passes'] );
			}
		} elseif ( $current_purchase_options['subscription'] > 0 && empty( $current_purchase_options['time_pass'] ) ) {
			$purchase_options['time_passes'][] = $purchase_options_all['time_passes'];
			$purchase_options['subscriptions'] = Subscription::get_instance()->get_subscriptions_by_criteria( true );

			if ( 'low' === $current_global_options['average_post_publish_count'] ) {
				unset( $purchase_options['time_passes'] );
			}
		} elseif ( $current_purchase_options['time_pass'] > 0 && empty( $current_purchase_options['subscription'] ) ) {
			$purchase_options['subscriptions'][] = $purchase_options_all['subscription'];
			$purchase_options['time_passes'] = Time_Pass::get_instance()->get_time_passes_by_criteria();
		}

		return $purchase_options;
	}

	/**
	 * Get post tier based on post content.
	 *
	 * @param string $post_content Content of the paid post.
	 *
	 * @return string
	 */
	public function get_post_tier( $post_content ) {
		// Get content length.
		$content_length = Utility::get_word_count( $post_content );

		// Predefined content limit for tiers.
		if ( $content_length <= 250 ) {
			return 'tier_1';
		} elseif ( $content_length > 250 && $content_length <= 500 ) {
			return 'tier_2';
		} elseif ( $content_length > 500 ) {
			return 'tier_3';
		}

		return 'tier_1';
	}
}
