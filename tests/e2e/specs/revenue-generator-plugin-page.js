/**
 * WordPress dependencies.
 */
import {visitAdminPage} from '@wordpress/e2e-test-utils';

/**
 * Check welcome wizard for initial merchant interaction.
 */
describe('Revenue Generator Plugin Page', () => {
	it('should display a welcome wizard', async () => {
		await visitAdminPage('admin.php', 'page=revenue-generator');
		await expect(page).toMatchElement('.welcome-screen h1.welcome-screen--heading', {text: 'Welcome to Revenue Generator'});
	});
});
