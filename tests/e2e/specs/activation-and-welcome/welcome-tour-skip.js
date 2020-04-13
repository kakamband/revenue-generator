/**
 * Internal dependencies.
 */
import {resetPluginDataAndSelectAveragePosts} from "../../utils/reset-merchant-data";

/**
 * Skip the tutorial.
 */
describe('Revenue Generator Tour Skip', () => {
	beforeAll( async () => {
		await resetPluginDataAndSelectAveragePosts();
	} );

	it('should display a plugin tour and allow skipping it', async () => {
		// Click the skip tour and make sure tour is completed after that.
		await page.waitForSelector('.shepherd-footer .shepherd-content-skip-tour');
		await page.click('.shepherd-footer .shepherd-content-skip-tour');
		await page.waitForNavigation();
	});

	it('should have post search bar once tour is completed and no tour actions', async () => {
		// Visit plugin page and make sure expected element exits.
		await expect( page ).not.toMatchElement( '.shepherd-footer .shepherd-content-skip-tour' );
		await expect(page).toMatchElement('.rev-gen-preview-main--search label', {text: 'Previewing:'});
	});
});
