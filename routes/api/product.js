var express = require("express");
var router = express.Router();

const {
  addProduct,
  getProduct,
  getProductById,
  deleteProductById,
  updateProduct,
  updateProductStatus,
  uploadProductImage,
  deleteProductImage,
  uploadProductPDF,
} = require("../../controller/product.controller");

const { getMulterSettings } = require("../../config/helper/multerStorage");

router.post("/", addProduct);
router.get("/", getProduct);
router.get("/:productId", getProductById);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProductById);
router.patch("/change-status/:productId/:status", updateProductStatus);
router.post(
  "/uploadImage/:productId",
  getMulterSettings("PRODUCT_IMAGE").single("productImage"),
  uploadProductImage
);
router.post(
  "/uploadPDF/:productId",
  getMulterSettings("PRODUCT_PDF").single("productPDF"),
  uploadProductPDF
);
router.delete("/deleteImage/:productId/:imageId", deleteProductImage);

module.exports = router;
