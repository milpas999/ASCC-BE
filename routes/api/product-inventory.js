var express = require("express");
var router = express.Router();

const {
  addProductInventory,
  getTotalProductsInInventory,
  getProductInventoryById,
  deleteProductInventoryInfo,
  updateProductInventory,
  updateProductInventoryStatus,
  getProductInventoryDetail,
} = require("../../controller/productInventory.controller");

router.post("/", addProductInventory);
router.get("/", getTotalProductsInInventory);
router.get("/:productInventoryId", getProductInventoryById);
router.get("/detail/:productId", getProductInventoryDetail);
router.delete("/:productInventoryId", deleteProductInventoryInfo);
router.put("/:productInventoryId", updateProductInventory);
router.patch(
  "/change-status/:productInventoryId/:status",
  updateProductInventoryStatus
);

module.exports = router;
