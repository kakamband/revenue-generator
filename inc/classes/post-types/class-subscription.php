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

}
