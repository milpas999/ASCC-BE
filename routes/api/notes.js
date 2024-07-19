var express = require("express");
const { createNotes, getNotes } = require("../../controller/notes.controller");

var router = express.Router();

router.post("/", createNotes);
router.get("/", getNotes);

module.exports = router;
