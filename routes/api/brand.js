var express = require("express");
var router = express.Router();

const {
  addBrand,
  getBrand,
  getBrandById,
  deleteBrandById,
  updateBrand,
  updateBrandStatus,
  uploadBrandImage,
  deleteBrandImage,
} = require("../../controller/brand.controller");

const {
  getMulterSettings,
  employeeProfilePicture,
} = require("../../config/helper/multerStorage");

router.post("/", addBrand);
router.get("/", getBrand);
router.get("/:brandId", getBrandById);
router.delete("/:brandId", deleteBrandById);
router.put("/:brandId", updateBrand);
router.patch("/change-status/:brandId/:status", updateBrandStatus);
router.post(
  "/uploadImage/:brandId",
  getMulterSettings("BRAND").single("brandImage"),
  uploadBrandImage
);
router.delete("/deleteImage/:brandId/:imageId", deleteBrandImage);

module.exports = router;
