<?php
/**
 * Register Paywall post type.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc\Post_Types;

use LaterPay\Revenue_Generator\Inc\Categories;
use LaterPay\Revenue_Generator\Inc\Post_Types;

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
					'_rg_preview_id'    => $paywall_data['preview_id'],
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
			update_post_meta( $paywall_id, '_rg_preview_id', $paywall_data['preview_id'] );
		}

		// If paywall is being added based on categories make sure to create meta to identify it.
		if (
			( ! empty( $paywall_data['access_to'] ) && ! empty( $paywall_data['access_entity'] ) ) &&
			(
				'category' === $paywall_data['access_to'] ||
				'exclude_category' === $paywall_data['access_to']
			)
		) {
			update_term_meta( $paywall_data['access_entity'], '_rg_has_paywall', 'true' );
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
			'relation' => 'AND',
			array(
				'key'     => '_rg_access_entity',
				'compare' => '=',
				'value'   => $post_id
			),
			array(
				'key'     => '_rg_access_to',
				'value'   => 'supported',
				'compare' => '=',
			),
		);

		$query_args['meta_query'] = $meta_query;

		$query = new \WP_Query( $query_args );

		$current_post = $query->posts;

		if ( ! empty( $current_post[0] ) ) {
			$pay_wall                      = $current_post[0];
			$paywall_info['id']            = $pay_wall->ID;
			$paywall_info['title']         = $pay_wall->post_title;
			$paywall_info['description']   = $pay_wall->post_content;
			$paywall_info['name']          = get_post_meta( $pay_wall->ID, '_rg_name', true );
			$paywall_info['access_to']     = get_post_meta( $pay_wall->ID, '_rg_access_to', true );
			$paywall_info['access_entity'] = get_post_meta( $pay_wall->ID, '_rg_access_entity', true );
			$paywall_info['preview_id']    = get_post_meta( $pay_wall->ID, '_rg_preview_id', true );
			$paywall_info['order']         = get_post_meta( $pay_wall->ID, '_rg_options_order', true );
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
		$paywall      = get_post( $paywall_id );
		if ( ! empty( $paywall ) ) {
			$paywall_info['id']            = $paywall->ID;
			$paywall_info['title']         = $paywall->post_title;
			$paywall_info['description']   = $paywall->post_content;
			$paywall_info['name']          = get_post_meta( $paywall->ID, '_rg_name', true );
			$paywall_info['access_to']     = get_post_meta( $paywall->ID, '_rg_access_to', true );
			$paywall_info['access_entity'] = get_post_meta( $paywall->ID, '_rg_access_entity', true );
			$paywall_info['preview_id']    = get_post_meta( $paywall->ID, '_rg_preview_id', true );
			$paywall_info['order']         = get_post_meta( $paywall->ID, '_rg_options_order', true );
		}

		return $paywall_info;
	}

	/**
	 * Remove the paywall.
	 *
	 * @param int $paywall_id Paywall ID.
	 *
	 * @return array
	 */
	public function remove_paywall( $paywall_id ) {
		$post_types = Post_Types::get_instance();
		if ( ! empty( $paywall_id ) ) {
			$paywall_data = $this->get_purchase_option_data_by_paywall_id( $paywall_id );

			$access_to     = $paywall_data['access_to'];
			$access_entity = $paywall_data['access_entity'];

			// Remove category meta.
			if ( 'category' === $access_to || 'exclude_category' === $access_to ) {
				$category_instance = Categories::get_instance();
				$category_instance->clear_category_paywall_meta( $access_entity );
			}

			$preview_id = $paywall_data['preview_id'];

			if ( empty( $preview_id ) ) {
				$preview_id = $post_types->get_latest_post_for_preview();
			}

			// Delete the paywall.
			$result = wp_delete_post( $paywall_id, true );
			if ( empty( $result ) ) {
				return [
					'success'         => false,
					'preview_post_id' => $preview_id
				];
			} else {
				return [
					'success'         => true,
					'preview_post_id' => $preview_id
				];
			}
		}

		return [
			'success'         => false,
			'preview_post_id' => $post_types->get_latest_post_for_preview()
		];
	}

	public function get_connected_paywall( $post_id ) {
		$paywall_info = $this->get_purchase_option_data_by_post_id( $post_id );
		if ( empty( $paywall_info['id'] ) ) {
			return false;
		} else {
			return $paywall_info['id'];
		}
	}

}
