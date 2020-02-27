/**
 * Provides support functions for anonymity and stealth check operations
 *
 * @module util/stealth
 *
 */

// Imports
const puppeteerExtra = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

// Local imports
const logger = require("../config/logger");
const args = [
  // Required for Docker version of Puppeteer
  "--no-sandbox",
  "--disable-setuid-sandbox",
  // Disable GPU
  "--disable-gpu",
  // This will write shared memory files into /tmp instead of /dev/shm,
  // because Docker’s default for /dev/shm is 64MB
  "--disable-dev-shm-usage",
];

/**
 * Tests scrapper anonymity by hitting a bot test page and extracting the results
 *
 */
async function verifyAnonymity() {
  puppeteerExtra.use(pluginStealth());

  const testsResults = await puppeteerExtra
    .launch({ executablePath: "/usr/bin/chromium-browser", args })
    .then(async browser => {
      logger.info("Running anonymity tests..", { category: "stealthCheck" });

      const page = await browser.newPage();

      await page.goto("https://bot.sannysoft.com", {
        waitUntil: ["networkidle2"]
      });

      const intoliTests = await extractIntoliTests(page);
      const fingerprintTests = await extractFingerprintTests(page);

      await browser.close();

      logger.info("All tests ran succesfully", { category: "stealthCheck" });
      return intoliTests.concat(fingerprintTests);
    });

  return testsResults;
}

async function extractIntoliTests(page) {
  return await page.$$eval(".result", results => {
    return Array.from(results).map(r => {
      return {
        test: r.id,
        result: r.innerText,
        status: r.className.replace("result", "").trim()
      };
    });
  });
}

async function extractFingerprintTests(page) {
  return await page.$eval("#fp2", table => {
    return Array.from(table.rows).map(r => {
      return {
        test: r.children[0].innerText,
        result: JSON.parse(r.children[2].innerText),
        status: r.children[1].className
      };
    });
  });
}

module.exports = {
  verifyAnonymity
};
