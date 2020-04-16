/**
 * WordPress dependencies
 */
import {activatePlugin, deactivatePlugin, visitAdminPage} from "@wordpress/e2e-test-utils";

/**
 * Reset merchant data of saved options using plugin.
 */
export async function resetPaywallTimePassSubscriptions() {
	await deactivatePlugin( 'e2e-tests-reset-plugin-cpt-data' );
	await activatePlugin( 'e2e-tests-reset-plugin-cpt-data' );

	await visitAdminPage('admin.php', 'page=revenue-generator');

	await expect(page).toMatchElement('.rev-gen-dashboard-content-nopaywall');
}
