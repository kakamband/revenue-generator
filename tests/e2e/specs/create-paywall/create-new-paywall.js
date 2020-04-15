/**
 * Internal dependencies.
 */
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
	it('should take edit the paywall header', async () => {
		// Set paywall title.
		await page.waitForSelector( '.rg-purchase-overlay-title' );
		await expect( page ).toFill( '.rg-purchase-overlay-title', 'Custom Paywall Header' );

		// Set paywall name
		await page.waitForSelector( '.rev-gen-preview-main-paywall-name' );
		await expect( page ).toFill( '.rev-gen-preview-main-paywall-name', 'Global Paywall' );

		// Save paywall
		await page.waitForSelector( '#rg_js_savePaywall' );
		await page.click( '#rg_js_savePaywall' );
		await page.waitForNavigation();

		// Verify new paywall on dashboard.
		await expect( page ).toMatchElement( 'div.rev-gen-dashboard-content-paywall-info > span.rev-gen-dashboard-paywall-name' );
		await expect(page).toMatchElement('div.rev-gen-dashboard-content-paywall-info > span.rev-gen-dashboard-paywall-name', {text: 'Global Paywall:'});

	});
});
