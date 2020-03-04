const { logger } = require("../config/logger");
const { takeSnapshot, measureTimeElapsed } = require("../util");

/**
 * Opens google main page and wait until page is fully loaded
 *
 * @param {*} page
 *
 * @returns {number} - The time elapsed in ms
 */
async function loadPage(page) {
  logger.debug("Loading page...");

  const start = measureTimeElapsed();

  await page.goto("https://www.google.com/", {
    waitUntil: ["load"]
  });

  const timeElapsed = measureTimeElapsed(start);

  logger.debug("Page loaded...", { timeElapsed });

  return timeElapsed;
}

async function fillForm(page, searchTerm) {
  const start = measureTimeElapsed();

  const inputField = await page.$("[title=Pesquisar]");
  await inputField.type(searchTerm, { delay: 100 });

  const timeElapsed = measureTimeElapsed(start);

  logger.debug(`Form filled in ${timeElapsed} ms`);
  return timeElapsed;
}

async function submitForm(page) {
  const start = measureTimeElapsed();

  // Forces form submission
  await page.$eval("form", form => form.submit());
  await page.waitForNavigation({ waitUntil: ["load"] });

  const timeElapsed = measureTimeElapsed(start);
  logger.debug(`Form filled and resulting page loaded in ${timeElapsed} ms`, {
    timeElapsed
  });

  return timeElapsed;
}

async function extractSearchResults(page) {
  const rawResults = await page.$("[id=search] > div > [data-async-context]");
  // We only care for the text result with links
  const filteredResults = await rawResults.$$eval(".g", results =>
    Array.from(results).map(r => r.innerText)
  );

  const parsedResults = filteredResults.map(fr => {
    const splittedData = fr.split("\n");
    return {
      resultTitle: splittedData[1],
      resultLink: splittedData[2],
      resultDescription: splittedData[3]
    };
  });

  return parsedResults;
}

async function scrap(page, searchTerm) {
  const perf = {};

  try {
    // Load Google's main page
    perf["firstPage"] = await loadPage(page);
    // await takeSnapshot(page, { context: searchTerm, fullPage: true });

    // Fills form with the search term provided
    perf["fillForm"] = await fillForm(page, searchTerm);
    // await takeSnapshot(page, { context: searchTerm, fullPage: true });

    // Submits form and waits for page transition
    perf["submitForm"] = await submitForm(page);

    // Extracts search data
    const results = await extractSearchResults(page);

    logger.info("Completed without errors");

    return { results, perf };
  } catch (error) {}
}

module.exports = scrap;
