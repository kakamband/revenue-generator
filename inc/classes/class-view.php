<?php
/**
 * Revenue Generator Plugin View Class.
 *
 * @package revenue-generator
 */

namespace LaterPay\Revenue_Generator\Inc;

use \LaterPay\Revenue_Generator\Inc\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Class Config
 */
class View {

	use Singleton;

	/**
	 *  Include the template in plugin path with data.
	 *
	 * @param string $template_path Path to template.
	 * @param array  $variables     Pass an array of variables you want to use in array keys.
	 *
	 * @return void
	 *
	 * @codeCoverageIgnore Covered in test for render_template
	 */
	public static function get_template_part( $template_path, $variables = array() ) {
		$template = sprintf( '%s.php', REVENUE_GENERATOR_PLUGIN_DIR . '/templates/' . $template_path );
		if ( ! empty( $variables ) && is_array( $variables ) ) {
			// All output is being escaped in loaded template files.
			extract( $variables, EXTR_OVERWRITE ); // phpcs:ignore WordPress.PHP.DontExtract.extract_extract -- Used as an exception as there is no better alternative.
		}
		include $template; // phpcs:ignore
	}

	/**
	 * Render template.
	 *
	 * @param string $template_path Template path.
	 * @param array  $vars          Variables to be used in the template.
	 *
	 * @return string Template markup.
	 */
	public static function render_template( $template_path, $vars = array() ) {
		ob_start();
		self::get_template_part( $template_path, $vars );

		return ob_get_clean();
	}

}
