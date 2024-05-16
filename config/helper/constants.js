exports.IMAGE_UPLOAD_MULTER_SETTINGS = {
  EMP: {
    path: "images/employeeProfilePicture/",
  },
  BRAND: {
    path: "images/brandImages/",
  },
  PRODUCT_IMAGE: {
    path: "images/productImages/",
  },
  PRODUCT_PDF: {
    path: "documents/product/",
  }

  //   usersProfilePicture: {
  //     path: "images/userprofileimage/",
  //   },
  //   defaultProfilePicture: {
  //     path: "images/",
  //   },
  //   usersConditionSupportDocument: {
  //     path: "images/condition_support_document/",
  //   },
  //   identificationDocument: {
  //     path: "images/identification_document/",
  //   },
  //   caseManagementDocument: {
  //     path: "images/case_management_document/",
  //   },
  //   prescriptionUploadDocument: {
  //     path: "images/prescription_upload_document/",
  //   },
  //   packageLogoImage: {
  //     path: "images/packageLogo_image/",
  //   },
};

exports.IMAGE_RESIZE_PARAMS = {
  BRAND: {
    path: "public/uploads/images/brandImages/resized/",
    dbPath: "uploads/images/brandImages/resized/",
    resized: [
      {
        height: 200,
        width: 200,
      },
      {
        height: 400,
        width: 400,
      },
      {
        height: 100,
        width: 100,
      },
      {
        height: 50,
        width: 50,
      },
    ],
  },
  EMP: {
    path: "public/uploads/images/employeeProfilePicture/resized/",
    dbPath: "uploads/images/employeeProfilePicture/resized/",
    resized: [
      {
        height: 200,
        width: 200,
      },
      {
        height: 400,
        width: 400,
      },
      {
        height: 100,
        width: 100,
      },
      {
        height: 50,
        width: 50,
      },
    ],
  },
  PRODUCT_IMAGE: {
    path: "public/uploads/images/productImages/resized/",
    dbPath: "uploads/images/productImages/resized/",
    resized: [
      {
        height: 200,
        width: 200,
      },
      {
        height: 400,
        width: 400,
      },
      {
        height: 100,
        width: 100,
      },
      {
        height: 50,
        width: 50,
      },
    ],
  },
};
