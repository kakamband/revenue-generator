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
			$meta              = [];

			if ( ! $contribution_post || static::SLUG !== $contribution_post->post_type ) {
				return new WP_Error( 'rg_contribution_not_found', __( 'No contribution found.', 'revenue-generator' ) );
			}

			$contribution_post = $contribution_post->to_array();
			$contribution_meta = get_post_meta( $id, '', true );

			$meta = $this->unprefix_meta( $contribution_meta );
			$meta = wp_parse_args( $meta, $contribution_default_meta );

			$last_modified_author_id = $this->get_last_modified_author_id( $id );

			$contribution_post['last_modified_author'] = ( ! empty( $last_modified_author_id ) ) ? $last_modified_author_id : $contribution_post['post_author'];
		} else {
			$contribution_post = $this->get_default_post();
			$meta              = $contribution_default_meta;
		}

		$contribution = array_merge( $contribution_post, $meta );

		return $contribution;
	}

	public function unprefix_meta( $meta = [] ) {
		$unprefixed_meta = [];

		foreach ( $meta as $key => $value ) {
			$unprefixed_key                   = str_replace( '_rg_', '', $key );
			$unprefixed_meta[$unprefixed_key] = maybe_unserialize( $value[0] );
		}

		return $unprefixed_meta;
	}

	public function get_date_time_string( $contribution ) {
		if ( is_int( $contribution ) ) {
			$contribution = $this->get( $contribution );
		}

		$date_time_string = '';

		if ( ! is_array( $contribution ) ) {
			return $date_time_string;
		}

		$created_modified_string = __( 'Created', 'revenue-generator' );
		$post_published_date     = get_the_date( '', $contribution['ID'] );
		$post_published_time     = get_the_time( '', $contribution['ID'] );
		$post_modified_date      = get_the_modified_date( '', $contribution['ID'] );
		$post_modified_time      = get_the_modified_time( '', $contribution['ID'] );

		if ( $post_published_date !== $post_modified_date || $post_published_time !== $post_modified_time ) {
			$created_modified_string = __( 'Updated', 'revenue-generator' );
		}

		$date_time_string  = sprintf(
			/* translators: %1$s modified date, %2$s modified time */
			__( '%1$s on %2$s at %3$s by %4$s', 'revenue-generator' ),
			$created_modified_string,
			$post_modified_date,
			$post_modified_time,
			get_the_author_meta( 'display_name', $contribution['last_modified_author'] )
		);

		return $date_time_string;
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
	public function get_shortcode( $contribution = 0 ) {
		if ( is_int( $contribution ) ) {
			$contribution = $this->get( $contribution );
		}

		$shortcode = '';

		if ( ! is_array( $contribution ) ) {
			return $shortcode;
		}

		$shortcode = sprintf(
			'[laterpay_contribution id="%d"]',
			$contribution['ID']
		);

		if ( ! empty( $contribution['code'] ) ) {
			$shortcode = $contribution['code'];
		}

		return $shortcode;
	}

	public function get_edit_link( $contribution = 0 ) {
		$contribution_id = (int) $contribution;

		if ( is_array( $contribution ) && isset( $contribution['ID'] ) ) {
			$contribution_id = $contribution['ID'];
		}

		if ( empty( $contribution_id ) ) {
			return;
		}

		$edit_link = admin_url(
			sprintf(
				'admin.php?page=%s&id=%d',
				Contribution::ADMIN_EDIT_SLUG,
				$contribution_id
			)
		);

		return $edit_link;
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
			$contributions[ $key ] = $this->get( $post->ID );
		}

		return $contributions;
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
