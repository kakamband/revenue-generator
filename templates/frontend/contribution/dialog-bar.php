<?php
/**
 * Revenue Generator Contribution Short code Screen.
 *
 * @package revenue-generator
 */

use LaterPay\Revenue_Generator\Inc\View;
use \LaterPay\Revenue_Generator\Inc\Post_Types\Contribution_Preview;

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file.
	exit;
}

$is_preview = Contribution_Preview::SLUG === get_post_type();
?>

Bar
