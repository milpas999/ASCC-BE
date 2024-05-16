const path = require("path");
const _ = require("lodash");
const Jimp = require("jimp");
const fs = require("fs");

const { ImageDocVideo } = require("./../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { IMAGE_RESIZE_PARAMS } = require("../config/helper/constants");
const { getRawJson } = require("../config/helper/utility");
const { CustomError } = require("../config/helper/customError");

exports.updateResourceWithImageDocVideo = async (objParams) => {
  try {
    const { imageDocVideoId, relatedId } = objParams;
    const data = await ImageDocVideo.update(
      {
        relatedId,
      },
      {
        where: {
          id: imageDocVideoId,
        },
      }
    );

    return data;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.getImageDocVideoData = async (objParams) => {
  try {
    const { relatedId, typeX, resourceType, imgDocVdoId = 0 } = objParams;

    const imageDocVideoData = await ImageDocVideo.findAll({
      where: {
        relatedId,
        typeX,
        resourceType,
        ...(_.toInteger(imgDocVdoId) > 0 && { id: imgDocVdoId }),
        ...deleteOperation(),
      },
    });

    return imageDocVideoData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.addImageDocVideoData = async (objParams) => {
  try {
    const { relatedId, typeX, resourceType, uploadedFileData } = objParams;

    let arrResizedImageDataForDB = [];

    if (typeX === "IMG") {
      const resizeParams = IMAGE_RESIZE_PARAMS[resourceType];

      if (!_.isEmpty(resizeParams) && resizeParams.resized.length > 0) {
        arrResizedImageDataForDB = resizeParams.resized.map(
          (eachResizeParams) => {
            return generateImageRelatedData(
              uploadedFileData,
              eachResizeParams,
              resizeParams
            );
          }
        );

        Promise.all(
          arrResizedImageDataForDB.map(async (eachResizeParams) => {
            const resizedImageData = await resizeImageAsPerParams(
              uploadedFileData,
              eachResizeParams
            );
            return resizedImageData;
          })
        );
      }

      const objForOrigImg = {
        fileDirectory: uploadedFileData.destination,
        fileDirectoryForDB: uploadedFileData.destination.replace(/public/g, ""),
        targetFileUploadPath: uploadedFileData.path,
        targetFileUploadPathForDB: uploadedFileData.path.replace(/public/g, ""),
        fileNameForStorage: uploadedFileData.filename,
        dimensionKey: "ORIG",
        width: "0",
        height: "0",
      };

      arrResizedImageDataForDB.push(objForOrigImg);
    } else {
      arrResizedImageDataForDB.push({
        fileDirectory: uploadedFileData.destination,
        fileDirectoryForDB: uploadedFileData.destination.replace(/public/g, ""),
        targetFileUploadPath: uploadedFileData.path,
        targetFileUploadPathForDB: uploadedFileData.path.replace(/public/g, ""),
        fileNameForStorage: uploadedFileData.filename,
        dimensionKey: "ORIG",
      });
    }

    const transformedObject = {};

    arrResizedImageDataForDB.forEach((obj) => {
      const key = obj.dimensionKey;
      transformedObject[key] = obj;
    });

    const transformedObjectJson = JSON.stringify(transformedObject);

    const imageVdoDocData = await ImageDocVideo.create({
      relatedId,
      typeX,
      resourceType,
      metaData: JSON.stringify(uploadedFileData),
      resizedParams: transformedObjectJson,
    });

    return imageVdoDocData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

const generateImageRelatedData = (
  uploadedFileData,
  eachResizeParams,
  targetImageInfo
) => {
  try {
    const fileName = path.parse(uploadedFileData.filename).name;
    const extension = path.parse(uploadedFileData.filename).ext;
    const fileNameForStorage = `${fileName}_${eachResizeParams.width}X${eachResizeParams.height}${extension}`;

    const targetFileUploadPath = `${targetImageInfo.path}${fileNameForStorage}`;
    const targetFileUploadPathForDB = `${targetImageInfo.dbPath}${fileNameForStorage}`;

    return {
      fileDirectory: targetImageInfo.path,
      fileDirectoryForDB: targetImageInfo.dbPath,
      targetFileUploadPath,
      targetFileUploadPathForDB,
      fileNameForStorage,
      dimensionKey: `${eachResizeParams.width}X${eachResizeParams.height}`,
      width: `${eachResizeParams.width}`,
      height: `${eachResizeParams.height}`,
    };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

const resizeImageAsPerParams = async (uploadedFileData, eachResizeParams) => {
  try {
    const imageResource = await Jimp.read(uploadedFileData.path);

    await imageResource.scaleToFit(
      +eachResizeParams.width,
      +eachResizeParams.height
    );
    await imageResource.write(`${eachResizeParams.targetFileUploadPath}`);

    return {
      targetFileUploadPath: eachResizeParams.targetFileUploadPath,
      dimensionKey: `${eachResizeParams.width}X${eachResizeParams.height}`,
      width: `${+eachResizeParams.width}`,
      height: `${+eachResizeParams.height}`,
    };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteImageDocVideoData = async (objParams) => {
  try {
    const { relatedId, typeX, resourceType, imgDocVdoId } = objParams;

    const currentDateTime = getCurrentDateTime();

    await ImageDocVideo.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: imgDocVdoId,
        },
      }
    );

    const arrImgDocVdoData = await this.getImageDocVideoData({
      relatedId,
      typeX,
      resourceType,
      imgDocVdoId,
    });

    arrImgDocVdoData.map(async (objEachImgDocVdoData) => {
      const imgDocVdoDataRaw = await getRawJson(objEachImgDocVdoData);

      const { metaData, resizedParams } = imgDocVdoDataRaw;
      const objResizedParams = JSON.parse(resizedParams);

      // Loop through each dimension key in the object
      for (const key of Object.keys(objResizedParams)) {
        const image = objResizedParams[key];
        const imagePath = image.targetFileUploadPath;

        // Check if the file exists
        try {
          await fs.accessSync(imagePath, fs.constants.F_OK);
          // Delete the file
          await fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${imagePath}`);
        } catch (err) {
          console.log("err :::  ", err);
          // If the file doesn't exist, continue to the next iteration
          continue;
        }
      }
    });

    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};
