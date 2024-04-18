// exports.loginCheck = require("./loginCheck");

const loginCheck = require("./loginCheck");

// Export all functions from loginCheck and authorizationCheck
module.exports = {
  ...loginCheck,
  // Add any other functions or exports from index.js if needed
};
