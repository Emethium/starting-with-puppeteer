// Local imports
const { logger } = require("./config/logger");
const {
  initializePuppeteer,
  initializeExtraPuppeteer
} = require("./util/browser");
const { verifyAnonymity } = require("./util/stealth");
const scrap = require("./core/google");

async function scrapGoogle() {
  const browser = await initializePuppeteer();
  const page = await browser.newPage();

  const result = await scrap(page, process.env.TERM);

  await browser.close();

  logger.info(result);

  process.exit(0);
}

async function stealthChecker() {
  const browser = await initializeExtraPuppeteer();
  const page = await browser.newPage();

  const result = await verifyAnonymity(page);

  await browser.close();

  logger.info(result);

  process.exit(0);
}

module.exports = {
  scrapGoogle,
  stealthChecker
};
