/**
 * Provides support functions for anonymity and stealth check operations
 *
 * @module util/stealth
 *
 */

// Local imports
const { logger } = require("../config/logger");
const { takeSnapshot } = require("./page");
/**
 * Tests scrapper anonymity by hitting a bot test page and extracting the results
 *
 */
async function verifyAnonymity(page) {
  logger.info("Running anonymity tests..", { category: "stealthCheck" });

  const intoliTest = await runIntoliTest(page);
  const antoineTest = await runAntoineVastelTest(page);

  logger.info("All tests ran succesfully", { category: "stealthCheck" });

  return { intoliTest, antoineTest };
}

async function runAntoineVastelTest(page) {
  logger.warn("Running Antoine Vastel test...", { category: "stealthCheck" });

  await page.goto("https://arh.antoinevastel.com/bots/areyouheadless", {
    waitUntil: ["networkidle2"]
  });

  await takeSnapshot(page, { fullPage: true });

  const result = await page.$eval(".success", el => el.innerText);

  const status = result.includes("not") ? "failed" : "passed";

  return { result, status };
}

async function runIntoliTest(page) {
  logger.warn("Running Intoli test...", { category: "stealthCheck" });

  await page.goto("https://bot.sannysoft.com", {
    waitUntil: ["networkidle2"]
  });

  await takeSnapshot(page, { fullPage: true });

  const intoliTests = await extractIntoliTests(page);
  const fingerprintTests = await extractFingerprintTests(page);

  return intoliTests.concat(fingerprintTests);
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
