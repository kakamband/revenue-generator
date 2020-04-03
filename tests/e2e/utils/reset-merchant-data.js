/**
 * WordPress dependencies
 */
import {activatePlugin, deactivatePlugin, visitAdminPage} from "@wordpress/e2e-test-utils";

/**
 * Reset merchant data using plugin.
 */
export async function resetPluginDataAndSelectAveragePosts() {
	await deactivatePlugin( 'e2e-tests-reset-plugin-data' );
	await activatePlugin( 'e2e-tests-reset-plugin-data' );

	await visitAdminPage('admin.php', 'page=revenue-generator');
	await expect(page).toMatchElement('.welcome-screen h1.welcome-screen--heading', {text: 'Welcome to Revenue Generator'});

	await page.waitForSelector( '.welcome-screen-wrapper--card #rg_js_highPostCard' );
	await page.click( '.welcome-screen-wrapper--card #rg_js_highPostCard' );
	await page.waitForNavigation();
}
