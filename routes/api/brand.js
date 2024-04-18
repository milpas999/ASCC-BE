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
} = require("../../controller/brand.controller");

const {
  getMulterSettings,
  employeeProfilePicture,
} = require("../../config/helper/multerStorage");

console.log(
  'getMulterSettings("BRAND") ::::::::::::::: ',
  getMulterSettings("BRAND")
);

console.log("employeeProfilePicture ::::::::::::: ", employeeProfilePicture);

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

module.exports = router;
