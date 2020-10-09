<?php
/**
 * Revenue Generator Contribution Short code Screen.
 *
 * @package revenue-generator
 */

if ( ! defined( 'ABSPATH' ) ) {
	// prevent direct access to this file.
	exit;
}

use \LaterPay\Revenue_Generator\Inc\Post_Types\Contribution;

$contribution_instance = Contribution::get_instance();
$default_metas         = $contribution_instance->get_default_meta();
$layout_type           = ( isset( $_GET['layout_type'] ) ) ? sanitize_text_field( $_GET['layout_type'] ) : 'box';
$shortcode             = sprintf(
	'[laterpay_contribution name="%s" thank_you="%s" type="%s" custom_amount="%s" all_amounts="%s" all_revenues="%s" selected_amount="1" dialog_header="%s" dialog_description="%s" layout_type="%s"]',
	$default_metas['name'],
	$default_metas['thank_you'],
	$default_metas['type'],
	$default_metas['custom_amount'],
	join( ',', $default_metas['all_amounts'] ),
	$default_metas['all_revenues'],
	$default_metas['dialog_header'],
	$default_metas['dialog_description'],
	$layout_type
);
?>
<!DOCTYPE html>
<html lang="en" class="rev-gen-preview">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Revenue Generator Contribution Preview</title>

	<?php wp_head(); ?>
</head>
<body>
	<main>
		<?php echo do_shortcode( $shortcode ); ?>
	</main>
</body>
</html>
