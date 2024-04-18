const { body, param, validationResult } = require('express-validator');
const { sendJsonResponse } = require('./renderer');

const productCreateValidator = [
  body('name').notEmpty(),
  body('categoryId').notEmpty()
];
exports.productCreateValidator = productCreateValidator;

const productUpdateValidator = [
  body('name').notEmpty(),
  body('categoryId').notEmpty(),
  param('productId').notEmpty()
];
exports.productUpdateValidator = productUpdateValidator;

const categoryCreateValidator = body('name').notEmpty();
exports.categoryCreateValidator = categoryCreateValidator;

const categoryUpdateValidator = [
  body('name').notEmpty(),
  param('categoryId').notEmpty()
];
exports.categoryUpdateValidator = categoryUpdateValidator;

const requestValidate = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      sendJsonResponse(req, res, 400, result, false, 'Validation error');
    } else {
      next();
    }
  } catch (error) {
    console.log('Error in request validate :::: ', error);
  }
};
exports.requestValidate = requestValidate;

const userCreateValidator = [
  body('name').notEmpty(),
  body('mobileNumber').notEmpty(),
  body('address').notEmpty()
  // body('role').notEmpty()
];
exports.userCreateValidator = userCreateValidator;

/**
 * LOGIN MODULE VALIDATORS
 */
const userLoginValidator = [
  body('mobileNumber').notEmpty(),
  body('password').notEmpty()
];
exports.userLoginValidator = userLoginValidator;
