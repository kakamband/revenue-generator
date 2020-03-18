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
		if ( ( ! empty( $paywall_data['access_to'] ) && ! empty( $paywall_data['access_entity'] ) ) ) {
			if ( 'category' === $paywall_data['access_to'] || 'exclude_category' === $paywall_data['access_to'] ) {
				update_term_meta( $paywall_data['access_entity'], '_rg_has_paywall', $paywall_data['access_to'] );
			} elseif ( 'supported' === $paywall_data['access_to'] ) {
				update_post_meta( $paywall_data['access_entity'], '_rg_has_paywall', 'true' );
			}
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
	 * Update the order of purchase options in paywall.
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

		$meta_query = [
			'relation' => 'AND',
			[
				'key'     => '_rg_access_entity',
				'compare' => '=',
				'value'   => $post_id
			],
			[
				'key'     => '_rg_access_to',
				'value'   => 'supported',
				'compare' => '=',
			],
		];

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
			if ( static::SLUG === $paywall->post_type ) {
				$paywall_info['id']            = $paywall->ID;
				$paywall_info['title']         = $paywall->post_title;
				$paywall_info['description']   = $paywall->post_content;
				$paywall_info['name']          = get_post_meta( $paywall->ID, '_rg_name', true );
				$paywall_info['access_to']     = get_post_meta( $paywall->ID, '_rg_access_to', true );
				$paywall_info['access_entity'] = get_post_meta( $paywall->ID, '_rg_access_entity', true );
				$paywall_info['preview_id']    = get_post_meta( $paywall->ID, '_rg_preview_id', true );
				$paywall_info['order']         = get_post_meta( $paywall->ID, '_rg_options_order', true );
				$paywall_info['is_active']     = get_post_meta( $paywall->ID, '_rg_is_active', true );
			}
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
			} elseif ( 'supported' === $access_to ) {
				$paywall_instance = Post_Types::get_instance();
				$paywall_instance->clear_post_paywall_meta( $access_entity );
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

	/**
	 * Get paywall related to the post id.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return bool|mixed
	 */
	public function get_connected_paywall_by_post( $post_id ) {
		$paywall_info = $this->get_purchase_option_data_by_post_id( $post_id );
		if ( empty( $paywall_info['id'] ) ) {
			return false;
		} else {
			return $paywall_info['id'];
		}
	}

	/**
	 * Disable the paywall and update activation meta.
	 *
	 * @param int $paywall_id Paywall Id.
	 *
	 * @return bool|int
	 */
	public function disable_paywall( $paywall_id ) {
		if ( ! empty( $paywall_id ) ) {
			return update_post_meta( $paywall_id, '_rg_is_active', 0 );
		}

		return false;
	}

	/**
	 * Activate the paywall and update activation meta.
	 *
	 * @param int $paywall_id Paywall Id.
	 */
	public function activate_paywall( $paywall_id ) {
		if ( ! empty( $paywall_id ) ) {
			update_post_meta( $paywall_id, '_rg_is_active', 1 );
		}
	}

	/**
	 * Get paywall related to the category data.
	 *
	 * @param array $categories Categories Data.
	 *
	 * @return string|\WP_Post
	 */
	public function get_connected_paywall_by_categories( $categories ) {
		$paywall_id = '';
		foreach ( $categories as $category_id ) {
			$paywall_id = $this->get_purchase_option_data_by_category_id( $category_id );

			// If no paywall found check for paywall in parent category.
			if ( empty( $paywall_id ) ) {
				$parent_id       = false;
				$category_object = get_category( $category_id );

				// Verify the category exists before accessing the parent info.
				if ( ! is_wp_error( $category_object ) && ! empty( $category_object ) && isset( $category_object->parent ) ) {
					$parent_id = $category_object->parent;
				}

				while ( $parent_id ) {
					$paywall_id = $this->get_purchase_option_data_by_category_id( $parent_id );
					if ( empty( $paywall_id ) ) {
						$parent_id = get_category( $parent_id )->parent;
						continue;
					}
					break;
				}
			}
		}

		return $paywall_id;
	}

	/**
	 * Get related Paywall ID for excluded categories.
	 *
	 * @param array $categories Categories array.
	 *
	 * @return string|\WP_Post
	 */
	public function get_connected_paywall_in_excluded_categories( $categories ) {
		$query_args = [
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish' ],
			'posts_per_page' => 1,
		];

		$meta_query = [
			'relation' => 'AND',
			[
				'key'     => '_rg_access_entity',
				'compare' => 'NOT IN',
				'value'   => $categories
			],
			[
				'key'     => '_rg_access_to',
				'value'   => 'exclude_category',
				'compare' => '=',
			],
			[
				'key'     => '_rg_is_active',
				'value'   => '1',
				'compare' => '=',
			],
		];

		$query_args['meta_query'] = $meta_query;

		$query = new \WP_Query( $query_args );

		$current_post = $query->posts;

		if ( ! empty( $current_post[0] ) ) {
			return $current_post[0]->ID;
		}

		return '';
	}

	/**
	 * Get related Paywall ID for all posts.
	 *
	 * @return string|\WP_Post
	 */
	public function get_paywall_for_all_posts() {
		$query_args = [
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish' ],
			'posts_per_page' => 1,
		];

		$meta_query = [
			'relation' => 'AND',
			[
				'key'     => '_rg_access_to',
				'value'   => 'all',
				'compare' => '=',
			],
			[
				'key'     => '_rg_is_active',
				'value'   => '1',
				'compare' => '=',
			],
		];

		$query_args['meta_query'] = $meta_query;

		$query = new \WP_Query( $query_args );

		$current_post = $query->posts;

		if ( ! empty( $current_post[0] ) ) {
			return $current_post[0]->ID;
		}

		return '';
	}

	/**
	 * Get related Paywall ID for category.
	 *
	 * @param int $category_id Category ID.
	 *
	 * @return string|int
	 */
	public function get_purchase_option_data_by_category_id( $category_id ) {
		$query_args = [
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish' ],
			'posts_per_page' => 1,
		];

		$meta_query = [
			'relation' => 'AND',
			[
				'key'     => '_rg_access_entity',
				'compare' => '=',
				'value'   => $category_id
			],
			[
				'key'     => '_rg_access_to',
				'value'   => 'category',
				'compare' => '=',
			],
			[
				'key'     => '_rg_is_active',
				'value'   => '1',
				'compare' => '=',
			],
		];

		$query_args['meta_query'] = $meta_query;

		$query = new \WP_Query( $query_args );

		$current_post = $query->posts;

		if ( ! empty( $current_post[0] ) ) {
			return $current_post[0]->ID;
		}

		return '';
	}

	/**
	 * Get all paywalls.
	 */
	public function get_all_paywalls() {

		$query_args = [
			'post_type'      => static::SLUG,
			'post_status'    => [ 'publish' ],
			'posts_per_page' => 100,
			'no_found_rows'  => true,
		];

		// Initialize WP_Query without args.
		$get_paywalls_query = new \WP_Query();

		// Get posts for requested args.
		$posts    = $get_paywalls_query->query( $query_args );
		$paywalls = [];

		foreach ( $posts as $key => $post ) {
			$paywalls[ $key ] = $this->formatted_paywall( $post );
		}

		return $paywalls;
	}

	/**
	 * Returns relevant fields for paywalls of given WP_Post
	 *
	 * @param \WP_Post $post Post to transform
	 *
	 * @return array Time Pass instance as array
	 */
	private function formatted_paywall( $post ) {
		$post_meta         = get_post_meta( $post->ID );
		$post_meta         = $this->formatted_post_meta( $post_meta );
		$post_updated_info = sprintf(
			__( 'Last updated on %s at %s by %s' ),
			get_the_modified_date( '', $post->ID ),
			get_the_modified_time( '', $post->ID ),
			get_the_author_meta( 'display_name', $post->post_author )
		);

		$pay_wall                  = [];
		$pay_wall['id']            = $post->ID;
		$pay_wall['title']         = $post->post_title;
		$pay_wall['description']   = $post->post_content;
		$pay_wall['name']          = $post_meta['name'];
		$pay_wall['access_to']     = $post_meta['access_to'];
		$pay_wall['access_entity'] = $post_meta['access_entity'];
		$pay_wall['is_active']     = $post_meta['is_active'];
		$pay_wall['updated']       = $post_updated_info;

		// Compose message based on paywall attributes.
		if ( 'category' === $pay_wall['access_to'] || 'exclude_category' === $pay_wall['access_to'] ) {
			$category_id     = $pay_wall['access_entity'];
			$category_object = get_category( $category_id );
			if ( 'category' === $pay_wall['access_to'] ) {
				$published_on = sprintf(
					__( '%1$sPublished%2$s on %1$sall posts%2$s in the category %3$s', 'revenue-generator' ),
					'<b>',
					'</b>',
					sprintf( '<b>%s</b>', $category_object->name )
				);
			} else {
				$published_on = sprintf(
					__( '%1$sPublished%2$s on %1$sall posts%2$s except the category %3$s', 'revenue-generator' ),
					'<b>',
					'</b>',
					sprintf( '<b>%s</b>', $category_object->name )
				);
			}
		} else if ( 'supported' === $pay_wall['access_to'] ) {
			$rg_post_object = get_post( $pay_wall['access_entity'] );
			$published_on   = sprintf(
				__( '%1$sPublished%2$s on %1$spost%2$s %3$s', 'revenue-generator' ),
				'<b>',
				'</b>',
				sprintf( '<b>%s</b>', $rg_post_object->post_title )
			);
		} else {
			$published_on = sprintf(
				__( '%1$sPublished%2$s on %1$sall posts%2$s', 'revenue-generator' ),
				'<b>',
				'</b>'

			);
		}

		$pay_wall['published_on'] = $published_on;

		return $pay_wall;
	}

	/**
	 * Check if post meta has values.
	 *
	 * @param array $post_meta Post meta values fetched form database
	 *
	 * @return array
	 */
	private function formatted_post_meta( $post_meta ) {
		$post_meta_data = [];

		/**
		 * _rg_name - store the paywall name.
		 * _rg_access_to - store the content to which the time pass will allow access, can be category / all.
		 * _rg_access_entity - store the entity id.
		 * _rg_is_active - store paywall status.
		 */
		$post_meta_data['name']          = ( isset( $post_meta['_rg_name'][0] ) ) ? $post_meta['_rg_name'][0] : '';
		$post_meta_data['access_to']     = ( isset( $post_meta['_rg_access_to'][0] ) ) ? $post_meta['_rg_access_to'][0] : '';
		$post_meta_data['access_entity'] = ( isset( $post_meta['_rg_access_entity'][0] ) ) ? $post_meta['_rg_access_entity'][0] : '';
		$post_meta_data['is_active']     = ( isset( $post_meta['_rg_is_active'][0] ) ) ? $post_meta['_rg_is_active'][0] : '';

		return $post_meta_data;
	}

}
