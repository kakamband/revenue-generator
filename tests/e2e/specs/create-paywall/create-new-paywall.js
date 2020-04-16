/**
 * Internal dependencies.
 */
import { resetPaywallTimePassSubscriptions } from '../../utils/reset-paywall-options-data';

/**
 * Handle paywall creation.
 */
describe('Revenue Generator paywall creation', () => {
	// Navigate merchant to paywall creation area.
	it('should delete all paywall and time passes', async () => {
		await resetPaywallTimePassSubscriptions();
	});

	// Navigate merchant to paywall creation area.
	it('should take merchant to create paywall on click of New Paywall button', async () => {
		await page.waitForSelector( '#rg_js_newPaywall' );
		await page.click( '#rg_js_newPaywall' );
		await page.waitForNavigation();
	});

	// Navigate merchant to paywall creation area and save paywall.
	it('should search for hello world post', async () => {
		// Search for hello world post.
		await page.waitForSelector( '#rg_js_searchContent' );
		await expect( page ).toFill( '#rg_js_searchContent', 'Hello' );

		await page.waitForSelector( 'div.rev-gen-preview-main--search-results .rev-gen-preview-main--search-results-item', { text: 'Hello world!' } );
		await page.click( 'div.rev-gen-preview-main--search-results .rev-gen-preview-main--search-results-item' );
		await page.waitForNavigation();

		// Verify we are on hello world page.
		await page.waitForSelector( '#rg_js_postPreviewWrapper .rev-gen-preview-main--post--title', { text: 'Hello world!' } );
	});

	// Save paywall.
	it('should take edit the paywall header and save paywall', async () => {
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
		await expect(page).toMatchElement('div.rev-gen-dashboard-content-paywall-info > span.rev-gen-dashboard-paywall-name', {text: 'Global Paywall'});
	});
});
