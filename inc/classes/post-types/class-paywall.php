<?php
/**
 * Register Paywall post type.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc\Post_Types;

defined( 'ABSPATH' ) || exit;

/**
 * Class Paywall
 */
class Paywall extends Base {

	/**
	 * Slug of post type.
	 *
	 * @var string
	 */
	const SLUG = 'rg_paywall';

	/**
	 * To get list of labels for paywall post type.
	 *
	 * @return array
	 */
	public function get_labels() {

		return [
			'name'          => __( 'Paywalls', 'revenue-generator' ),
			'singular_name' => __( 'Paywall', 'revenue-generator' ),
		];

	}

	/**
	 * Create/Update Paywall.
	 *
	 * @param array $paywall_data Paywall Information.
	 *
	 * @return int|\WP_Error
	 */
	public function update_paywall( $paywall_data ) {
		if ( empty( $paywall_data['id'] ) ) {
			$paywall_id = wp_insert_post( [
				'post_content' => $paywall_data['description'],
				'post_title'   => $paywall_data['title'],
				'post_status'  => 'publish',
				'post_type'    => static::SLUG,
				'meta_input'   => [
					'_rg_name'          => $paywall_data['name'],
					'_rg_access_to'     => $paywall_data['access_to'],
					'_rg_access_entity' => $paywall_data['access_entity'],
				],
			] );
		} else {
			$paywall_id = $paywall_data['id'];
			wp_update_post( [
				'ID'           => $paywall_id,
				'post_content' => $paywall_data['description'],
				'post_title'   => $paywall_data['title'],
			] );

			update_post_meta( $paywall_id, '_rg_name', $paywall_data['name'] );
			update_post_meta( $paywall_id, '_rg_access_to', $paywall_data['access_to'] );
			update_post_meta( $paywall_id, '_rg_access_entity', $paywall_data['access_entity'] );
		}

		return $paywall_id;
	}

	/**
	 * Update individual purchase option for the paywall.
	 *
	 * @param int   $paywall_id      Paywall ID
	 * @param array $individual_data Individual option data.
	 */
	public function update_paywall_individual_option( $paywall_id, $individual_data ) {
		update_post_meta( $paywall_id, '_rg_individual_option', $individual_data );
	}

	/**
	 * Update the order of purchase options in paywall..
	 *
	 * @param int   $paywall_id Paywall ID
	 * @param array $order_data Purchase option data.
	 */
	public function update_paywall_option_order( $paywall_id, $order_data ) {
		update_post_meta( $paywall_id, '_rg_options_order', $order_data );
	}

	/**
	 * Get related paywall information.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return array
	 */
	public function get_purchase_option_data_by_post_id( $post_id ) {
		$paywall_info = [];
		$query_args   = [
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish' ],
			'posts_per_page' => 1,
		];

		$meta_query = array(
			'relation' => 'OR',
			array(
				'key'     => '_rg_access_entity',
				'compare' => '=',
				'value'   => $post_id
			),
			array(
				'key'     => '_rg_access_to',
				'value'   => 'post',
				'compare' => '=',
			),
			array(
				'key'     => '_rg_access_to',
				'value'   => 'all',
				'compare' => '=',
			)
		);

		$query_args['meta_query'] = $meta_query;

		$query = new \WP_Query( $query_args );

		$current_post = $query->posts;

		if ( ! empty( $current_post[0] ) ) {
			$pay_wall                    = $current_post[0];
			$paywall_info['id']          = $pay_wall->ID;
			$paywall_info['title']       = $pay_wall->post_title;
			$paywall_info['description'] = $pay_wall->post_content;
			$paywall_info['name']        = get_post_meta( $pay_wall->ID, '_rg_name', true );
			$paywall_info['access_to']   = get_post_meta( $pay_wall->ID, '_rg_access_to', true );
			$paywall_info['access_entity']   = get_post_meta( $pay_wall->ID, '_rg_access_entity', true );
			$paywall_info['order']       = get_post_meta( $pay_wall->ID, '_rg_options_order', true );
		}

		return $paywall_info;
	}

	/**
	 * Get individual pricing information.
	 *
	 * @param int $paywall_id Paywall ID.
	 *
	 * @return mixed
	 */
	public function get_individual_purchase_option_data( $paywall_id ) {
		return get_post_meta( $paywall_id, '_rg_individual_option', true );
	}

	/**
	 * Remove purchase option data.
	 *
	 * @param $paywall_id
	 */
	public function remove_individual_purchase_option( $paywall_id ) {
		if ( ! empty( $paywall_id ) ) {
			$this->update_paywall_individual_option( $paywall_id, [] );

			// Unset order if found.
			$current_order = get_post_meta( $paywall_id, '_rg_options_order', true );
			if ( isset( $current_order['individual'] ) ) {
				unset( $current_order['individual'] );
				update_post_meta( $paywall_id, '_rg_options_order', $current_order );
			}
		}
	}

	/**
	 * Get related paywall information.
	 *
	 * @param int $paywall_id Paywall ID.
	 *
	 * @return array
	 */
	public function get_purchase_option_data_by_paywall_id( $paywall_id ) {
		$paywall_info = [];
		$paywall = get_post( $paywall_id );
		if ( ! empty( $paywall ) ) {
			$paywall_info['id']          = $paywall->ID;
			$paywall_info['title']       = $paywall->post_title;
			$paywall_info['description'] = $paywall->post_content;
			$paywall_info['name']        = get_post_meta( $paywall->ID, '_rg_name', true );
			$paywall_info['access_to']   = get_post_meta( $paywall->ID, '_rg_access_to', true );
			$paywall_info['access_entity']   = get_post_meta( $paywall->ID, '_rg_access_entity', true );
			$paywall_info['order']       = get_post_meta( $paywall->ID, '_rg_options_order', true );
		}

		return $paywall_info;
	}

	/**
	 * Remove the paywall.
	 *
	 * @param int $paywall_id Paywall ID.
	 *
	 * @return bool
	 */
	public function remove_paywall( $paywall_id ) {
		if ( ! empty( $paywall_id ) ) {
			// Delete the paywall.
			$result = wp_delete_post( $paywall_id, true );
			if ( empty( $result ) ) {
				return false;
			} else {
				return true;
			}
		}

		return false;
	}


}
