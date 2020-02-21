// Imports
const puppeteer = require("puppeteer");
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

const launchArgs = [
  // Required for Docker version of Puppeteer
  "--no-sandbox",
  "--disable-setuid-sandbox",
  // Disable GPU
  "--disable-gpu",
  // This will write shared memory files into /tmp instead of /dev/shm,
  // because Docker’s default for /dev/shm is 64MB
  "--disable-dev-shm-usage"
];

/**
 * Initializes a common Puppeteer Browser
 *
 * @param {string} proxy - String representation of an IPv4 address and a designated port (IPv4:PORT)
 *
 * @returns {Browser} A Puppeteer Browser
 */
async function initializePuppeteer(proxy) {
  setupProxy()

  return puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: launchArgs,
    defaultViewport: {
      width: 1024,
      height: 768
    }
  });
}

/**
 * Initializes a Puppeteer Browser with steroids
 *
 * @param {string} proxy - String representation of an IPv4 address and a designated port (IPv4:PORT)
 *
 * @returns {Browser} A modified Puppeteer Browser
 */
async function initializeExtraPuppeteer(proxy) {
  setupProxy()
  puppeteerExtra.use(StealthPlugin());
  puppeteerExtra.use(AdblockerPlugin());

  return puppeteerExtra.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: launchArgs,
    defaultViewport: {
      width: 1024,
      height: 768
    }
  });
}

/**
 * Adds a proyx to the launch argument list if one is provided
 *
 * @param {string} proxy - String representation of an IPv4 address and a designated port (IPv4:PORT)
 * @inner
 * @static
 */
function setupProxy(proxy) {
  return proxy ? launchArgs.push(`--proxy-server=https=${proxy}`) : null;
}

module.exports = {
  initializePuppeteer,
  initializeExtraPuppeteer
};
