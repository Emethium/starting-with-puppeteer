/**
 * Provides helper methods for dealing with file transfer, downloading and copying from remote locations
 *
 * @module util/file-upload
 *
 */

// Imports
const S3 = require("aws-sdk").S3;
const uuidv4 = require("uuid/v4");

// Local imports
const logger = require("../config/logger");
const { measureTimeElapsed } = require("./time");

/**
 * Uploads a base64 encoded buffer with the specified
 * content type and extension to an external service.
 *
 * When no destination if configured through {@link config/environment.bucket}
 * it will silent ignore the upload request and return
 *
 * @param {Buffer} buffer - An integer buffer (base64 encoded)
 * @param {Object<string, string>} opts - Additional options for file upload
 * @param {string} opts.contentType - The content type for the buffered file
 * @param {string} opts.ext - File extension
 *
 * @static
 * @function
 */
async function uploadFile(buffer, { contentType, ext } = {}) {
  // Halt execution if no bucket is configured
  if (!bucket || bypassFileUpload) {
    logger.warn(
      "An upload destination was not provided, ignoring file upload...",
      { category: "file-upload" }
    );

    return;
  }

  const service = getUploadService();
  const key = generateObjectKey(ext);

  try {
    const start = measureTimeElapsed();

    logger.silly(`Uploading object ${key}`, {
      category: "file-upload",
      key
    });

    await service
      .putObject({
        Key: key,
        Bucket: bucket,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: contentType
      })
      .promise();

    const timeElapsed = measureTimeElapsed(start);

    logger.silly("Object uploaded", { category: "file-upload", timeElapsed });

    return key;
  } catch (error) {
    logger.error(`Could not upload file ${key} `, {
      category: "file-upload",
      error
    });
  }
}

/**
 * Instanciates a service object representing
 * an abstract destination which all API calls
 * should be issued to.
 *
 * @returns {AWS.S3} A service object for external calls
 *
 * @private
 * @static
 * @function
 */
function getUploadService() {
  const config = {
    apiVersion: "2006-03-01",
    signatureVersion: "v4",
    s3ForcePathStyle: true,
    endpoint: "http://minio:9000"
  };

  return new S3(config);
}

/**
 * Generates an object key (uuid-v4) with the provided extension.
 *
 * @param {string} [ext=".jpg"] - The file extension (defaults to .jpg)
 * @returns {string} The generated object key, formatted as uuid + ext
 *
 * @private
 * @static
 * @function
 */
function generateObjectKey(ext = ".jpg") {
  const uuid = uuidv4();

  return uuid + ext;
}

// Exports
module.exports = {
  uploadFile
};
