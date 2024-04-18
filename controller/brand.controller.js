const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");
const { CustomError } = require("../config/helper/customError");

const { getRawJson } = require("../config/helper/utility");
const {
  updateResourceWithImageDocVideo,
  addImageDocVideoData,
} = require("../dbService/imageDocVideo.services");

const {
  addbrandData,
  getBrandData,
  updateBrandData,
  updateBrandStatusData,
  deleteBrandData,
} = require("../dbService/brand.services");

/**
 * Adds a new brand to the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing brand data.
 * @param {string} req.body.name - The name of the brand.
 * @param {string} req.body.description - The description of the brand.
 * @param {number} req.body.brandImageId - The ID of the brand image.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the brand is added successfully.
 */
exports.addBrand = async (req, res, next) => {
  try {
    const {
      body: { name, description, brandImageId },
    } = req;

    const objParams = {
      name,
      description,
    };

    const newBrand = await addbrandData(objParams);

    if (brandImageId > 0) {
      await updateResourceWithImageDocVideo({
        imageDocVideoId: brandImageId,
        relatedId: newBrand.id,
      });
    }

    const newBrandRaw = await getRawJson(newBrand);

    sendJsonResponse(
      req,
      res,
      200,
      newBrandRaw,
      true,
      "Brand added successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(
      req,
      res,
      error.statusCode || 500,
      {},
      false,
      error.message
    );
  }
};

/**
 * Fetches a list of brands based on the provided filter parameters.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query.filterParams - The filter parameters to apply to the brand list.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the brand list is fetched successfully.
 */
exports.getBrand = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const brandListData = await getBrandData({ filterParams });
    sendJsonResponse(req, res, 200, brandListData, true, "Brand list fetched");
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(
      req,
      res,
      error.statusCode || 500,
      {},
      false,
      error.message
    );
  }
};

/**
 * Fetches the brand data for the specified brand ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.brandId - The ID of the brand to fetch.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the brand data is fetched successfully.
 */
exports.getBrandById = async (req, res, next) => {
  try {
    const {
      params: { brandId },
    } = req;
    const brandListData = await getBrandData({ brandId });
    sendJsonResponse(req, res, 200, brandListData, true, "Brand data fetched");
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(
      req,
      res,
      error.statusCode || 500,
      {},
      false,
      error.message
    );
  }
};

/**
 * Updates the brand data for the specified brand ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.brandId - The ID of the brand to update.
 * @param {string} req.body.name - The new name for the brand.
 * @param {string} req.body.description - The new description for the brand.
 * @param {number} req.body.brandImageId - The ID of the new brand image.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the brand data is updated successfully.
 */
exports.updateBrand = async (req, res, next) => {
  try {
    const {
      params: { brandId },
      body: { name, description, brandImageId },
    } = req;

    const objParamsForBrandUpdate = {
      name,
      description,
      brandImageId,
      brandId,
    };

    const brandListData = await updateBrandData(objParamsForBrandUpdate);

    if (brandImageId > 0) {
      await updateResourceWithImageDocVideo({
        imageDocVideoId: brandImageId,
        relatedId: brandId,
      });
    }
    sendJsonResponse(req, res, 200, brandListData, true, "Brand data fetched");
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(
      req,
      res,
      error.statusCode || 500,
      {},
      false,
      error.message
    );
  }
};

/**
 * Updates the status of the specified brand.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.brandId - The ID of the brand to update.
 * @param {string} req.params.status - The new status for the brand.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the brand status is updated successfully.
 */
exports.updateBrandStatus = async (req, res, next) => {
  try {
    const {
      params: { brandId, status },
    } = req;
    await updateBrandStatusData(brandId, status);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Employee status updated successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(
      req,
      res,
      error.statusCode || 500,
      {},
      false,
      error.message
    );
  }
};

/**
 * Deletes a brand by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.brandId - The ID of the brand to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the brand is deleted successfully.
 */
exports.deleteBrandById = async (req, res, next) => {
  try {
    const {
      params: { brandId },
    } = req;
    await deleteBrandData(brandId);
    sendJsonResponse(req, res, 200, {}, true, "Brand deleted successfully");
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(
      req,
      res,
      error.statusCode || 500,
      {},
      false,
      error.message
    );
  }
};

exports.uploadBrandImage = async (req, res, next) => {
  try {
    console.log("111111111111111111111111111111111");
    const {
      params: { brandId },
      query: { typeX },
      file,
    } = req;
    console.log("file ::::::::::::::::: ", file);
    const objParams = {
      relatedId: brandId,
      typeX,
      uploadedFileData: file,
      resourceType: "BRAND",
    };
    const imageDovVideoData = await addImageDocVideoData(objParams);
    sendJsonResponse(
      req,
      res,
      200,
      imageDovVideoData,
      true,
      "Employee image uploaded updated successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(
      req,
      res,
      error.statusCode || 500,
      {},
      false,
      error.message
    );
  }
};
