var express = require("express");
const {
  addAmc,
  getAmcList,
  getAmcById,
  updateAmc,
  updateAmcStatus,
  deleteAmc,
} = require("../../controller/amc.controller");
var router = express.Router();

router.post("/", addAmc);
router.get("/", getAmcList);
router.get("/:amcId", getAmcById);
router.put("/:amcId", updateAmc);
router.patch("/:amcId/:currentStatus", updateAmcStatus);
router.delete("/:amcId", deleteAmc);

module.exports = router;
