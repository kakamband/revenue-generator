/**
 * Internal dependencies.
 */
import {resetPluginDataAndSelectAveragePosts} from "../../utils/reset-merchant-data";

/**
 * Check welcome wizard for initial merchant interaction.
 */
describe('Revenue Generator Welcome Wizard', () => {
	it('should display a welcome wizard', async () => {
		await resetPluginDataAndSelectAveragePosts();
	});
});
