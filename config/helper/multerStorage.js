const path = require("path");
const _ = require("lodash");
const slugify = require("slugify");

const multer = require("multer");

const { IMAGE_UPLOAD_MULTER_SETTINGS } = require("./constants");

exports.employeeProfilePicture = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads/${IMAGE_UPLOAD_MULTER_SETTINGS.EMP.path}`);
    },
    filename: function (req, file, cb) {
      const fileName = `${file.fieldname}_${slugify(
        path.parse(file.originalname).name
      )}_${_.now()}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  }),
});

exports.getMulterSettings = (type) => {
  console.log(
    "IMAGE_UPLOAD_MULTER_SETTINGS[type].path :::::::::::::: ",
    IMAGE_UPLOAD_MULTER_SETTINGS[type].path
  );
  const multerStorage = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, `./public/uploads/${IMAGE_UPLOAD_MULTER_SETTINGS[type].path}`);
      },
      filename: function (req, file, cb) {
        const fileName = `${file.fieldname}_${slugify(
          path.parse(file.originalname).name
        )}_${_.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
      },
    }),
  });

  console.log("multerStorage :::::::::::: ", multerStorage);

  return multerStorage;
};
