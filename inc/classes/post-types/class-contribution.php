<?php
/**
 * Register Paywall post type.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc\Post_Types;

use LaterPay\Revenue_Generator\Inc\Config;
use LaterPay\Revenue_Generator\Inc\Post_Types;
use LaterPay\Revenue_Generator\Inc\View;

defined( 'ABSPATH' ) || exit;

/**
 * Class Paywall
 */
class Contribution extends Base {

	/**
	 * Slug of post type.
	 *
	 * @var string
	 */
	const SLUG = 'rg_contribution';

	/**
	 * Slug of admin screen for Contributions dashboard.
	 *
	 * @var string
	 */
	const ADMIN_DASHBOARD_SLUG = 'revenue-generator-contributions';

	/**
	 * Slug of admin screen for single Contributions edit.
	 *
	 * @var string
	 */
	const ADMIN_EDIT_SLUG = 'revenue-generator-contribution';

	/**
	 * To get list of labels for paywall post type.
	 *
	 * @return array
	 */
	public function get_labels() {

		return [
			'name'          => __( 'Contributions', 'revenue-generator' ),
			'singular_name' => __( 'Contribution', 'revenue-generator' ),
		];

	}

	/**
	 * Save contribution.
	 *
	 * @param array $contribution_data Contribution Information.
	 *
	 * @return int|\WP_Error
	 */
	public function save( $contribution_data ) {
		$default_meta      = $this->get_default_meta();
		$contribution_data = wp_parse_args( $contribution_data, $default_meta );

		if ( empty( $contribution_data['ID'] ) ) {
			$contribution_id = wp_insert_post(
				[
					'post_content' => $contribution_data['dialog_description'],
					'post_title'   => $contribution_data['name'],
					'post_status'  => 'publish',
					'post_type'    => static::SLUG,
					'meta_input'   => [
						'_rg_thank_you'       => $contribution_data['thank_you'],
						'_rg_type'            => $contribution_data['type'],
						'_rg_custom_amount'   => $contribution_data['custom_amount'],
						'_rg_all_amounts'     => $contribution_data['all_amounts'],
						'_rg_dialog_header'   => $contribution_data['dialog_header'],
						'_rg_all_revenues'    => $contribution_data['all_revenues'],
						'_rg_selected_amount' => $contribution_data['selected_amount'],
						'_rg_code'            => $contribution_data['code'],
					],
				]
			);
		} else {
			$contribution_id   = $contribution_data['ID'];
			$contribution_post = $this->get( $contribution_id );

			if ( is_wp_error( $contribution_post ) ) {
				return new WP_Error( 'invalid_contribution', __( 'Contribution with this ID does not exist.', 'revenue-generator' ) );
			}

			wp_update_post(
				[
					'ID'           => $contribution_id,
					'post_content' => $contribution_data['dialog_description'],
					'post_title'   => $contribution_data['name'],
				]
			);

			foreach ( $default_meta as $meta_key => $meta_value ) {
				update_post_meta( $contribution_id, "_rg_{$meta_key}", $contribution_data[$meta_key] );
			}
		}

		return $contribution_id;
	}

	public function get_default_post() {
		$post = [
			'ID' => 0,
			'post_title' => '',
		];

		$meta = $this->get_default_meta();

		return array_merge( $post, $meta );
	}

	public function get( $id = 0 ) {
		$contribution_default_meta = $this->get_default_meta();

		if ( ! empty( $id ) ) {
			$contribution_post = get_post( $id );

			if ( ! $contribution_post || static::SLUG !== $contribution_post->post_type ) {
				return new WP_Error( 'rg_contribution_not_found', __( 'No contribution found.', 'revenue-generator' ) );
			}

			$contribution_post = $contribution_post->to_array();
			$contribution_meta = get_post_meta( $id, '', true );

			$meta = array();

			foreach ( $contribution_meta as $meta_key => $meta_value ) {
				$unprefixed        = str_replace( '_rg_', '', $meta_key );
				$meta[$unprefixed] = maybe_unserialize( $meta_value[0] );
			}

			$meta = wp_parse_args( $meta, $contribution_default_meta );
		} else {
			$contribution_post = $this->get_default_post();
			$meta              = $contribution_default_meta;
		}

		$contribution = array_merge( $contribution_post, $meta );

		return $contribution;
	}

	/**
	 * Get default meta data for contribution.
	 *
	 * @return array
	 */
	public function get_default_meta() {
		return [
			'type' => 'multiple',
			'name' => '',
			'thank_you' => '',
			'dialog_header' => __( 'Support the Author', 'revenue-generator' ),
			'dialog_description' => __( 'Pick your contribution below:', 'revenue-generator' ),
			'custom_amount' => '',
			'all_amounts' => array( 50, 100, 150 ),
			'all_revenues' => '',
			'selected_amount' => '',
			'code' => '',
		];
	}

	/**
	 * Get shortcode for the contribution.
	 *
	 * This supports previous versions of the plugin where shortcode was stored in the contribution's meta
	 * and also a new version where shortcode is ID based.
	 *
	 * @since 1.1.0
	 *
	 * @param int $contribution_id
	 *
	 * @return string Shortcode.
	 */
	public function get_shortcode( $contribution_id ) {
		$contribution = $this->get( $contribution_id );
		$shortcode    = '';

		if ( is_wp_error( $contribution ) ) {
			return $shortcode;
		}

		$shortcode = sprintf(
			'[laterpay_contribution id="%d"]',
			$contribution_id
		);

		if ( ! empty( $contribution['code'] ) ) {
			$shortcode = $contribution['code'];
		}

		return $shortcode;
	}

	/**
	 * Get all Contributions.
	 *
	 * @param array $contribution_args contribution search args.
	 *
	 * @return array
	 */
	public function get_all_contributions( $contribution_args ) {
		$query_args = [
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish' ],
			'posts_per_page' => 100,
			'no_found_rows'  => true,
		];

		// Merge default params and extra args.
		$query_args = array_merge( $query_args, $contribution_args );

		// Initialize WP_Query without args.
		$get_contributions_query = new \WP_Query();

		// Get posts for requested args.
		$posts         = $get_contributions_query->query( $query_args );
		$contributions = [];

		foreach ( $posts as $key => $post ) {
			$contributions[ $key ] = $this->formatted_contribution( $post );
		}

		return $contributions;
	}

	/**
	 * Returns relevant fields for Contribution of given WP_Post
	 *
	 * @param \WP_Post $post Post to transform.
	 *
	 * @return array Time Pass instance as array
	 */
	private function formatted_contribution( $post ) {
		$post_meta          = get_post_meta( $post->ID );
		$post_meta          = $this->formatted_post_meta( $post_meta );
		$last_modified_user = $this->get_last_modified_author_id( $post->ID );
		$post_author        = empty( $last_modified_user ) ? $post->post_author : $last_modified_user;
		$post_modified_date = get_the_modified_date( '', $post->ID );
		$post_modified_time = get_the_modified_time( '', $post->ID );
		$post_updated_info  = sprintf(
			/* translators: %1$s modified date, %2$s modified time */
			__( 'Created on %1$s at %2$s by %3$s' ),
			$post_modified_date,
			$post_modified_time,
			get_the_author_meta( 'display_name', $post_author )
		);

		$all_amounts          = maybe_unserialize( $post_meta['all_amounts'] );
		$all_formated_amounts = array();
		if ( ! empty( $all_amounts ) ) {
			foreach ( $all_amounts as $amount ) {
				$all_formated_amounts[] = floatval( $amount / 100 );
			}
		}

		$contribution                      = [];
		$contribution['id']                = $post->ID;
		$contribution['name']              = $post->post_title;
		$contribution['description']       = $post->post_content;
		$contribution['dialog_header']     = $post_meta['dialog_header'];
		$contribution['thank_you']         = $post_meta['thank_you'];
		$contribution['type']              = $post_meta['type'];
		$contribution['all_amounts']       = $all_formated_amounts;
		$contribution['all_revenues']      = maybe_unserialize( $post_meta['all_revenues'] );
		$contribution['selected_amount']   = $post_meta['selected_amount'];
		$contribution['code']              = $post_meta['code'];
		$contribution['updated_timestamp'] = strtotime( "{$post_modified_date} $post_modified_time" );
		$contribution['updated']           = $post_updated_info;

		return $contribution;
	}

	/**
	 * Check if post meta has values.
	 *
	 * @param array $post_meta Post meta values fetched form database.
	 *
	 * @return array
	 */
	private function formatted_post_meta( $post_meta ) {

		$post_meta_data = [];

		/**
		 * _rg_thank_you - Thank you page
		 * _rg_type - Type of contribution single/ multiple future proof
		 * _rg_custom_amount - Custom amount if any future proof.
		 * _rg_all_amounts - All Amounts.
		 * _rg_dialog_header - Dailogbox Header.
		 * _rg_all_revenues  - All Revenues.
		 * _rg_selected_amount - Selected amount.
		 * _rg_code - generated code.
		 */
		$post_meta_data['thank_you']       = ( isset( $post_meta['_rg_thank_you'][0] ) ) ? $post_meta['_rg_thank_you'][0] : '';
		$post_meta_data['type']            = ( isset( $post_meta['_rg_type'][0] ) ) ? $post_meta['_rg_type'][0] : '';
		$post_meta_data['custom_amount']   = ( isset( $post_meta['_rg_custom_amount'][0] ) ) ? $post_meta['_rg_custom_amount'][0] : '0';
		$post_meta_data['all_amounts']     = ( isset( $post_meta['_rg_all_amounts'][0] ) ) ? $post_meta['_rg_all_amounts'][0] : '';
		$post_meta_data['dialog_header']   = ( isset( $post_meta['_rg_dialog_header'][0] ) ) ? $post_meta['_rg_dialog_header'][0] : '';
		$post_meta_data['all_revenues']    = ( isset( $post_meta['_rg_all_revenues'][0] ) ) ? $post_meta['_rg_all_revenues'][0] : '';
		$post_meta_data['selected_amount'] = ( isset( $post_meta['_rg_selected_amount'][0] ) ) ? $post_meta['_rg_selected_amount'][0] : '';
		$post_meta_data['code']            = ( isset( $post_meta['_rg_code'][0] ) ) ? $post_meta['_rg_code'][0] : '';

		return $post_meta_data;
	}

	/**
	 * Get user id of the user who last updated the paywall.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string|int
	 */
	private function get_last_modified_author_id( $post_id ) {
		$last_id = get_post_meta( $post_id, '_edit_last', true );
		if ( $last_id ) {
			return $last_id;
		}

		return '';
	}

	/**
	 * Generate shortcode based on provided config.
	 *
	 * @param string $type Type of shortcode.
	 * @param array  $config_array shortcode configuration data.
	 *
	 * @return array|bool Returns shortcode or false.
	 */
	public static function shortcode_generator( $type, $config_array ) {
		// Handle contribution shortcode generation.
		if ( 'contribution' === $type ) {
			// Validate the configuration.
			$result = self::is_contribution_config_valid( $config_array );
			if ( false === $result['success'] ) {
				return $result;
			} else {
				if ( 'multiple' === $config_array['type'] && 'none' === $config_array['custom_amount'] ) {
					unset( $config_array['custom_amount'] );
				}
				// Create the shortcode string.
				$built_shortcode = sprintf( '[laterpay_contribution id="%s"]', 2 );
				return [
					'success' => true,
					'code'    => $built_shortcode,
				];
			}
		}

		return [
			'success' => false,
			'message' => esc_html__( 'Something went wrong.', 'revenue-generator' ),
		];
	}

	/**
	 * Check if the provided shortcode configuration for Contribution is valid or now.
	 *
	 * @param array $config_array Contribution configuration data.
	 *
	 * @return array|bool
	 */
	private static function is_contribution_config_valid( $config_array ) {

		// Check if campaign name is set.
		if ( empty( $config_array['name'] ) ) {
			return [
				'success' => false,
				'message' => esc_html__( 'Please enter a Campaign Name above.', 'revenue-generator' ),
			];
		}

		// Check if campaign amount is empty.
		if ( 'single' === $config_array['type'] ) {
			if ( floatval( $config_array['single_amount'] ) === floatval( 0.0 ) ) {
				return [
					'success' => false,
					'message' => esc_html__( 'Please enter a valid contribution amount above.', 'revenue-generator' ),
				];
			}
			return true;
		}

		return true;
	}

	/**
	 * Filter to modify the search of contribution data.
	 *
	 * @param string    $sql   SQL string.
	 * @param \WP_Query $query Query object.
	 *
	 * @return string
	 */
	public function rg_contribution_title_filter( $sql, $query ) {
		global $wpdb;

		// If our custom query var is set modify the query.
		if ( ! empty( $query->query['rg_contribution_title'] ) ) {
			$term = $wpdb->esc_like( $query->query['rg_contribution_title'] );
			$sql .= ' AND ' . $wpdb->posts . '.post_title LIKE \'%' . $term . '%\'';
		}

		return $sql;
	}

}
