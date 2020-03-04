/**
 * This module implements common helper methods to extract,
 * modify and process page information
 *
 * @module util/page
 *
 */

const { logger } = require("../config/logger");
const { uploadFile } = require("./upload")

/**
 * Takes a screenshot of the provided page
 *
 * @param {*} page - The page a screenshot should be taken from
 * @param {Object.<string, string>} opts - Additional options
 * @param {boolean} [opts.fullPage=false] - When true, takes a screenshot of the full scrollable page.
 * @param {boolean} [opts.skipUpload=false] - When true, skip uploading files to destination.
 * @param {Context} [opts.context={}] - The execution context
 *
 * @returns {string | Buffer} The key for the generated file within the destination. When options.skipUpload is true, it returns the allocated Buffer
 *
 * @static @function
 */
async function takeScreenshot(
  page,
  { fullPage = false, skipUpload = false, context = {} } = {}
) {
  try {
    logger.info("Taking screenshot from page", {
      category: "page-manipulation",
      context,
      fullPage,
      skipUpload
    });

    buffer = await page.screenshot({
      fullPage,
      type: "jpeg"
    });

    logger.info("Screenshot taken", {
      category: "page-manipulation",
      context,
      fullPage,
      skipUpload
    });

    return skipUpload
      ? buffer
      : await uploadFile(buffer, { contentType: "image/jpeg", ext: ".jpg" });
  } catch (error) {
    logger.error("Could not take screenshot from page", {
      category: "page-manipulation",
      context,
      error
    });

    return null;
  }
}

/**
 * Takes the innerHTML content from the body of the provided page
 *
 * @param {*} page - The page from which the content should be taken from
 * @param {Object.<string, string>} opts - Additional options
 * @param {boolean} [opts.skipUpload=false] - When true, skip uploading files to destination.
 * @param {Context} [opts.context={}] - The execution context
 *
 * @returns {string | Buffer} The key for the generated file within the destination. When options.skipUpload is true, it returns the allocated Buffer
 *
 * @static @function
 */
async function takeContent(page, { skipUpload = false, context = {} }) {
  try {
    logger.info("Taking HTML content from page", {
      category: "page-manipulation",
      context,
      skipUpload
    });

    const html = await page.content();

    buffer = Buffer.from(html);

    logger.info("HTML taken", {
      category: "page-manipulation",
      context,
      skipUpload
    });

    return skipUpload
      ? buffer
      : await uploadFile(buffer, { contentType: "text/html", ext: ".html" });
  } catch (error) {
    logger.error("Could not take HTML from page", {
      category: "page-manipulation",
      context,
      error
    });

    return null;
  }
}

/**
 * Take both the HTML and a screenshot from the provided page
 *
 * @see takeScreenshot
 * @see takeContent
 *
 * @param {*} page - The page a snapshot should be taken from
 * @param {Object.<string, string>} opts - Additional options
 * @param {boolean} [opts.fullPage=false] - When true, takes a screenshot of the full scrollable page.
 * @param {boolean} [opts.skipUpload=false] - When true, skip uploading files to destination.
 * @param {Context} [opts.context={}] - The execution context
 *
 * @returns {Snapshot} The page snapshot
 *
 * @static @function
 */
async function takeSnapshot(
  page,
  { fullPage = false, skipUpload = false, context = {} } = {}
) {
  const [screenshot, html] = await Promise.all([
    takeScreenshot(page, { fullPage, skipUpload, context }),
    takeContent(page, { skipUpload, context })
  ]);

  return { screenshot, html };
}

module.exports = {
  takeSnapshot,
  takeScreenshot,
  takeContent
};
