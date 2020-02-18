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
					'_rg_name'            => $paywall_data['name'],
					'_rg_support_type'    => $paywall_data['support_type'],
					'_rg_support_type_id' => $paywall_data['support_type_id'],
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
			update_post_meta( $paywall_id, '_rg_support_type', $paywall_data['support_type'] );
			update_post_meta( $paywall_id, '_rg_support_type_id', $paywall_data['support_type_id'] );
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

}
