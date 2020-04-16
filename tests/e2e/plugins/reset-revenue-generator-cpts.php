<?php
/**
 * Plugin Name: E2E Tests Reset Plugin CPT Data.
 * Description: This plugin is used in E2E test to reset plugin data and give a fresh start.
 * Plugin URI: https://github.com/laterpay/revenue-generator
 * Author: laterpay
 * Author URI: https://laterpay.net/
 *
 * @package   revenue-generator
 */

register_activation_hook(
	__FILE__,
	function () {
		revenue_generator_e2e_reset_plugin_cpt_data();
	}
);

register_deactivation_hook(
	__FILE__,
	function () {
		revenue_generator_e2e_reset_plugin_cpt_data();
	}
);

function revenue_generator_e2e_reset_plugin_cpt_data() {
	/**
	 * 1. Delete meta data added on supported posts / pages and categories for internal use.
	 *
	 * Remove paywall identification data on posts and pages and categories.
	 */
	delete_post_meta_by_key( '_rg_has_paywall' );

	// Get all terms having meta key _rg_has_paywall.
	$args = [
		'hide_empty' => false,
		'meta_query' => [
			[
				'key'     => '_rg_has_paywall',
				'compare' => '=',
			],
		],
	];

	$rg_terms = get_terms( 'category', $args );
	if ( ! empty( $rg_terms ) ) {
		// Delete all term meta added by Revenue Generator.
		foreach ( $rg_terms as $rg_term ) {
			delete_term_meta( $rg_term->term_id, '_rg_has_paywall' );
		}
	}

	/**
	 * 2.Delete data of custom post type created by the plugin.
	 *
	 * Get all paywalls, passes and subscriptions for deletion.
	 */
	$args = [
		'post_type'      => [ 'rg_paywall', 'rg_pass', 'rg_subscription' ],
		'posts_per_page' => 100,
		'no_found_rows'  => true,
		'post_status'    => [ 'publish', 'draft' ],
	];

	$query = new WP_Query( $args );

	while ( $query->have_posts() ) {
		// Get custom post data created by plugin and delete it.
		$query->the_post();
		$rg_post_id = get_the_ID();
		wp_delete_post( $rg_post_id, true );
	}

	wp_reset_postdata();
}

