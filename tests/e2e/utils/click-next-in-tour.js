/**
 * Click next button in the tour for given element.
 */
export async function clickNextTour( tourElement ) {
	await page.waitForSelector(`div[aria-describedby=${tourElement}] .shepherd-content-next-tour-element`);
	await page.click(`div[aria-describedby=${tourElement}] .shepherd-content-next-tour-element`);
}
