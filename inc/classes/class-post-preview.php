<?php
/**
 * Post Preview meta box.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;
use \LaterPay\Revenue_Generator\Inc\Frontend_Post;
use \LaterPay\Revenue_Generator\Inc\View;
use \LaterPay\Revenue_Generator\Inc\Config;
use LaterPay\Revenue_Generator\Inc\Admin;

/**
 * Class Post Preview Meta box.
 */
class Post_Preview {

	use Singleton;

	/**
	 * Meta box slug.
	 *
	 * @var string Meta box slug.
	 */
	const SLUG = 'rg-paywall-preview';

	/**
	 * Meta box label.
	 *
	 * @var string Meta box label.
	 */
	const LABEL = 'Paywall for this Post';

	/**
	 * Context of meta box.
	 *
	 * @var string Context of meta box.
	 */
	protected $context = 'side';

	/**
	 * Priority of meta box.
	 *
	 * @var string Priority of meta box.
	 */
	protected $priority = 'default';

	/**
	 * Construct method.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * To setup actions/filters.
	 *
	 * @return void
	 */
	protected function setup_hooks() {

		/**
		 * Action
		 */
		add_action( 'add_meta_boxes', [ $this, 'add_meta_boxes' ] );

	}

	/**
	 * To add meta box.
	 *
	 * @return void
	 */
	public function add_meta_boxes() {

		add_meta_box(
			static::SLUG,
			static::LABEL,
			[ $this, 'render_meta_box' ],
			$this->get_post_type(),
			$this->context,
			$this->priority
		);

	}

	/**
	 * List of post type in which meta box is allowed.
	 *
	 * @return array List of post type.
	 */
	public function get_post_type() {

		return [ 'post', 'page' ];

	}

	/**
	 * To render meta box.
	 *
	 * @return string html.
	 */
	public function render_meta_box() {

		global $post;
		$admin_menus       = Admin::get_admin_menus();
		$frontend_post     = Frontend_Post::get_instance();
		$post_payload_data = $frontend_post->get_post_payload();
		$paywall_data      = $frontend_post->get_connected_paywall_id( $post->ID );
		$template_data     = array();
		$config_data       = Config::get_global_options();
		$symbol            = '';

		if ( ! empty( $config_data['merchant_currency'] ) ) {
			$symbol = 'USD' === $config_data['merchant_currency'] ? '$' : '€';
		}

		if ( ! empty( $post_payload_data['payload'] ) ) {

			$post_payloads = json_decode( $post_payload_data['payload'] );
			$paywall       = array();

			foreach ( $post_payloads->purchase_options as $key => $purchase_option ) {
				$purcahse_price            = $purchase_option->price->amount / 100;
				$purchase_option_price     = number_format( $purcahse_price, 2 );
				$paywall[ $key ]['title']  = $purchase_option->title;
				$paywall[ $key ]['amount'] = $symbol . $purchase_option_price;
			}

			$template_data['payload'] = $paywall;
		}

		if ( ! empty( $paywall_data ) ) {

			$last_id = get_post_meta( $post->ID, '_edit_last', true );
			if ( $last_id ) {
				return $last_id;
			}

			$post_author        = empty( $last_id ) ? $post->post_author : $last_id;
			$post_modified_date = get_the_modified_date( '', $post->ID );
			$post_modified_time = get_the_modified_time( '', $post->ID );
			$post_updated_info  = sprintf(
				/* translators: %1$s modified date, %2$s modified time */
				__( 'Last updated on %1$s at %2$s by %3$s' ),
				$post_modified_date,
				$post_modified_time,
				get_the_author_meta( 'display_name', $post_author )
			);

			$paywall_data['updated']           = $post_updated_info;
			$template_data['paywall_data']     = $paywall_data;
			$template_data['edit_paywall_url'] = add_query_arg(
				[
					'page'            => $admin_menus['paywall']['url'],
					'current_paywall' => $paywall_data['id'],
				],
				admin_url( 'admin.php' )
			);
		}

		$template_data['new_paywall_url'] = add_query_arg(
			[
				'page'            => $admin_menus['paywall']['url'],
				'preview_post_id' => $post->ID,
			],
			admin_url( 'admin.php' )
		);

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is escaped in template file.
		echo View::render_template( 'backend/metabox/post-preview', $template_data );

		return '';

	}

}
