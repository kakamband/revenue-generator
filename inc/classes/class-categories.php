<?php
/**
 * Handle category based pricing functionality.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use LaterPay\Revenue_Generator\Inc\Traits\Singleton;


defined( 'ABSPATH' ) || exit;

/**
 * Class Categories
 */
class Categories {

	use Singleton;

	/**
	 * Get categories that don't have a paywall associated to them.
	 *
	 * @param $args
	 *
	 * @return array
	 */
	public function get_applicable_categories( $args ) {
		$query = array(
			'taxonomy'     => 'category',
			'hide_empty'   => false,
			'meta_key'     => '_rg_has_paywall',
			'meta_compare' => 'NOT EXISTS'
		);

		$args = wp_parse_args(
			$args,
			$query
		);

		$category_with_price = new \WP_Term_Query( $args );

		return $category_with_price->terms;
	}

}
