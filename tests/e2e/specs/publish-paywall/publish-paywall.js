import { visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * Publish paywall actions.
 */
describe('Revenue Generator paywall publish', () => {
	// Navigate merchant to saved paywall area.
	it('take merchant to saved paywall', async () => {
		await visitAdminPage('admin.php', 'page=revenue-generator');
		await page.waitForSelector( '.rev-gen-dashboard-content-paywall .rev-gen-dashboard-content-paywall-preview' );
		await page.click( '.rev-gen-dashboard-content-paywall .rev-gen-dashboard-content-paywall-preview' );
		await page.waitForNavigation();
	});
});
