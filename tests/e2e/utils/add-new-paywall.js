import { visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * Click New Paywall button on the bar and navigate to new paywall creation area.
 */
export async function clickNewPaywall( tourElement ) {
	await visitAdminPage('admin.php', 'page=revenue-generator');
	await page.waitForSelector( '#rg_js_newPaywall' );
	await page.click( '#rg_js_newPaywall' );
	await page.waitForNavigation();
}
