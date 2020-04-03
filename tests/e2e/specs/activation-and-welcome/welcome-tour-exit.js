/**
 * Internal dependencies.
 */
import {resetPluginDataAndSelectAveragePosts} from "../../utils/reset-merchant-data";

/**
 * Skip the tutorial.
 */
describe('Revenue Generator Tour Exit', () => {
	beforeAll( async () => {
		await resetPluginDataAndSelectAveragePosts();
	} );

	it('should display a plugin tour and allow exiting it', async () => {

		// Search page tour element.
		await expect(page).toMatchElement('#rg-main-search-input-description');

		// Click the exit tour and make sure tour is completed after that.
		await page.waitForSelector('.rev-gen-exit-tour');
		await page.click('.rev-gen-exit-tour');
		await page.waitForNavigation();
	});

	it('should have post search bar once tour is skipped and no tour actions', async () => {
		// Visit plugin page and make sure expected element exits.
		await expect( page ).not.toMatchElement( '.shepherd-footer .shepherd-content-skip-tour' );
		await expect(page).toMatchElement('.rev-gen-preview-main--search label', {text: 'Previewing:'});
	});
});
