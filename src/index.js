
// Local imports
const { logger } = require("./config/logger");
const { initializePuppeteer, initializeExtraPuppeteer } = require("./util/browser")
const scrap = require("./core/google")

async function scrapGoogle() {
  const browser = await initializePuppeteer()
  const page = await browser.newPage()

  const result = await scrap(page, process.env.TERM)
  
  logger.info(result)

  process.exit(0)
}

module.exports = {
  scrapGoogle
}