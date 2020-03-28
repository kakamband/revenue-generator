<?php
/**
 * This file runs if someone clicks the delete link for deactivated Revenue Generator plugin in WordPress admin area.
 *
 * 1. Delete options data used in plugin.
 * 2. Delete meta data added on supported posts / pages and categories for internal use.
 * 3. Delete data of custom post type created by the plugin.
 *
 * @package revenue-generator
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

/**
 * 1. Delete options data used in plugin.
 *
 * All common options used by plugin should be added here for deletion.
 */
$lp_rg_global_options = [
	'lp_rg_version',
	'lp_rg_global_options',
	'lp_rg_merchant_credentials',
];

foreach ( $lp_rg_global_options as $lp_rg_global_option ) {
	// Delete plugin option.
	delete_option( $lp_rg_global_option );
}

/**
 * 2. Delete meta data added on supported posts / pages and categories for internal use.
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
 * 3.Delete data of custom post type created by the plugin.
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
