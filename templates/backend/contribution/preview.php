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
		<?php echo do_shortcode( '[laterpay_contribution id="66" layout_type="box"]' ); ?>
	</main>
</body>
</html>
