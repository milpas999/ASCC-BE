/**
 * CustomError is a custom error class that extends the built-in Error class.
 * It takes a message and status code in the constructor.
 * It sets the name to the constructor name and stores the status code.
 * This can be used to create custom errors with status codes.
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

exports.CustomError = CustomError;
