/**
 * Internal dependencies.
 */
import {resetPluginDataAndSelectAveragePosts} from "../../utils/reset-merchant-data";
import {clickNextTour} from "../../utils/click-next-in-tour";

/**
 * Go through all steps in the tour.
 */
describe('Revenue Generator Tour Complete', () => {
	it('should show all available options in the paywall creator and complete the tour', async () => {
		await resetPluginDataAndSelectAveragePosts();

		// Search page tour element.
		await expect(page).toMatchElement('#rg-main-search-input-description');
		await clickNextTour( 'rg-main-search-input-description' );

		// Paywall Header element.
		await expect(page).toMatchElement('#rg-purchase-overlay-header-description');
		await clickNextTour( 'rg-purchase-overlay-header-description' );

		// Option description tour element.
		await expect(page).toMatchElement('#rg-purchase-option-item-description');
		await clickNextTour( 'rg-purchase-option-item-description' );

		// Option edit tour element.
		await expect(page).toMatchElement('#rg-purchase-option-item-edit-description');
		await clickNextTour( 'rg-purchase-option-item-edit-description' );

		// Option item title tour element.
		await expect(page).toMatchElement('#rg-purchase-option-item-title-description');
		await clickNextTour('rg-purchase-option-item-title-description');

		// Option item price tour element.
		await expect(page).toMatchElement('#rg-purchase-option-item-price-description');
		await clickNextTour('rg-purchase-option-item-price-description');

		// Option item add tour element.
		await expect(page).toMatchElement('#rg-purchase-option-item-add-description');
		await clickNextTour('rg-purchase-option-item-add-description');

		// Option paywall name tour element.
		await expect(page).toMatchElement('#rg-purchase-option-paywall-name-description');
		await clickNextTour('rg-purchase-option-paywall-name-description');

		// Option paywall content search tour element.
		await expect(page).toMatchElement('#rg-purchase-option-paywall-actions-search-description');
		await clickNextTour('rg-purchase-option-paywall-actions-search-description');

		// Option paywall content search tour element.
		await expect(page).toMatchElement('#rg-purchase-option-paywall-publish-description');

		// Complete the tour.
		await page.waitForSelector('.shepherd-footer .shepherd-content-complete-tour-element');
		await page.click('.shepherd-footer .shepherd-content-complete-tour-element');
		await page.waitForNavigation();

		// Visit plugin page and make sure expected element exits.
		await expect(page).not.toMatchElement('.shepherd-footer');
		await expect(page).toMatchElement('.rev-gen-preview-main--search label', {text: 'Previewing:'});
	});
});
