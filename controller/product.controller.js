const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");
const { CustomError } = require("../config/helper/customError");

const { getRawJson } = require("../config/helper/utility");
const {
  updateResourceWithImageDocVideo,
  addImageDocVideoData,
  deleteImageDocVideoData,
} = require("../dbService/imageDocVideo.services");

const {
  addProductData,
  getProductData,
  updateProductData,
  updateProductStatusData,
  deleteProductData,
} = require("../dbService/product.service");

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
exports.addProduct = async (req, res, next) => {
  try {
    const {
      body: {
        name,
        description,
        categoryId,
        subCategoryId,
        brandId,
        hsnCode,
        modelNumber,
        warrenty,
        warrantyTerm,
        warrantyDescription,
        gstRate,
        productImageId,
        productManualId,
      },
    } = req;

    const objParams = {
      name,
      description,
      categoryId,
      subCategoryId,
      brandId,
      hsnCode,
      modelNumber,
      warrenty,
      warrantyTerm,
      warrantyDescription,
      gstRate,
    };

    const newProduct = await addProductData(objParams);

    if (productImageId.length > 0) {
      for (let intI = 0; intI < productImageId.length; intI++) {
        await updateResourceWithImageDocVideo({
          imageDocVideoId: productImageId[intI],
          relatedId: newProduct.id,
        });
      }
    }

    if (productManualId.length > 0) {
      for (let intI = 0; intI < productManualId.length; intI++) {
        await updateResourceWithImageDocVideo({
          imageDocVideoId: productManualId[intI],
          relatedId: newProduct.id,
        });
      }
    }

    const newProductRaw = await getRawJson(newProduct);

    sendJsonResponse(
      req,
      res,
      200,
      newProductRaw,
      true,
      "Product added successfully"
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
exports.getProduct = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const brandListData = await getProductData({ filterParams });
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
exports.getProductById = async (req, res, next) => {
  try {
    const {
      params: { productId },
    } = req;
    const brandListData = await getProductData({ productId });
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
exports.updateProduct = async (req, res, next) => {
  try {
    const {
      params: { productId },
      body: {
        name,
        description,
        categoryId,
        subCategoryId,
        brandId,
        hsnCode,
        modelNumber,
        warrenty,
        warrantyTerm,
        warrantyDescription,
        gstRate,
        productImageId,
        productManualId,
      },
    } = req;

    const objParams = {
      name,
      description,
      categoryId,
      subCategoryId,
      brandId,
      hsnCode,
      modelNumber,
      warrenty,
      warrantyTerm,
      warrantyDescription,
      gstRate,
      productId,
    };

    console.log("objParams :::::::::::::: ", objParams);

    const productListData = await updateProductData(objParams);
    // console.log("productImageId :::::::::::: ", productImageId);
    // console.log("productListData ::::::::::::::: ", productListData);
    // if (productImageId.length > 0) {
    //   for (let intI = 0; intI < productImageId.length; intI++) {
    //     await updateResourceWithImageDocVideo({
    //       imageDocVideoId: productImageId[intI],
    //       relatedId: productListData.id,
    //     });
    //   }
    //   // await updateResourceWithImageDocVideo({
    //   //   imageDocVideoId: brandImageId,
    //   //   relatedId: brandId,
    //   // });
    // }

    sendJsonResponse(
      req,
      res,
      200,
      productListData,
      true,
      "Product data updated successfully"
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
 * Updates the status of the specified brand.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.brandId - The ID of the brand to update.
 * @param {string} req.params.status - The new status for the brand.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the brand status is updated successfully.
 */
exports.updateProductStatus = async (req, res, next) => {
  try {
    const {
      params: { productId, status },
    } = req;
    await updateProductStatusData(productId, status);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Product status updated successfully"
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
exports.deleteProductById = async (req, res, next) => {
  try {
    const {
      params: { productId },
    } = req;
    await deleteProductData(productId);
    sendJsonResponse(req, res, 200, {}, true, "Product deleted successfully");
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
 * Uploads a brand image.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.brandId - The ID of the brand.
 * @param {Object} req.query - The request query parameters.
 * @param {string} req.query.typeX - The type of the uploaded file.
 * @param {Object} req.file - The uploaded file data.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the image is uploaded.
 */
exports.uploadProductImage = async (req, res, next) => {
  try {
    const {
      params: { productId },
      query: { typeX },
      file,
    } = req;

    const objParams = {
      relatedId: productId,
      typeX,
      uploadedFileData: file,
      resourceType: "PRODUCT_IMAGE",
    };
    const imageDovVideoData = await addImageDocVideoData(objParams);
    sendJsonResponse(
      req,
      res,
      200,
      imageDovVideoData,
      true,
      "Product image uploaded updated successfully"
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

exports.uploadProductPDF = async (req, res, next) => {
  try {
    const {
      params: { productId },
      query: { typeX },
      file,
    } = req;

    const objParams = {
      relatedId: productId,
      typeX,
      uploadedFileData: file,
      resourceType: "PRODUCT_PDF",
    };
    const imageDovVideoData = await addImageDocVideoData(objParams);
    sendJsonResponse(
      req,
      res,
      200,
      imageDovVideoData,
      true,
      "Product pdf uploaded updated successfully"
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
 * Deletes a brand image.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.brandId - The ID of the brand.
 * @param {string} req.params.imageId - The ID of the image to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the image is deleted.
 */
exports.deleteProductImage = async (req, res, next) => {
  try {
    const {
      params: { productId, imageId },
    } = req;

    const objParams = {
      imgDocVdoId: imageId,
      relatedId: productId,
      typeX: "IMG",
      resourceType: "PRODUCT_IMAGE",
    };
    const imageDovVideoData = await deleteImageDocVideoData(objParams);
    sendJsonResponse(
      req,
      res,
      200,
      imageDovVideoData,
      true,
      "Product image deleted successfully"
    );
  } catch (error) {
    console.log("error 123 :: ", error);
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
