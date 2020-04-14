/**
 * Internal dependencies.
 */
import {resetPluginDataAndSelectAveragePosts} from "../../utils/reset-merchant-data";
import { visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * Check welcome wizard for initial merchant interaction.
 */
describe('Revenue Generator paywall creation', () => {
	// Navigate merchant to paywall creation area.
	it('should take merchant to create paywall on click of New Paywall button', async () => {
		await visitAdminPage('admin.php', 'page=revenue-generator');
		await page.waitForSelector( '#rg_js_newPaywall' );
		await page.click( '#rg_js_newPaywall' );
		await page.waitForNavigation();
	});

	// Navigate merchant to paywall creation area.
	it('should take merchant to create paywall on click of Create your first paywall button', async () => {
		await visitAdminPage('admin.php', 'page=revenue-generator');
		await page.waitForSelector( '.rev-gen-dashboard-content-nopaywall--create-paywall--button' );
		await page.click( '.rev-gen-dashboard-content-nopaywall--create-paywall--button' );
		await page.waitForNavigation();
	});
});
