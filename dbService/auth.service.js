const _ = require("lodash");
const { Users, UserToken } = require("./../models");

exports.getUserById = async (userId) => {
  try {
    const user = await Users.findOne({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

/**
 * Gets a user by their mobile number.
 *
 * @param {string} mobileNumber - The mobile number of the user to find.
 * @returns {Promise<User|Error>} A promise that resolves to the found user or rejects with an error.
 */
exports.getUserByMobileNumber = async (mobileNumber) => {
  try {
    const user = await Users.findOne({
      where: {
        mobileNumber,
      },
    });

    return user;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

/**
 * Registers a new user in the database.
 *
 * @param {Object} objParams - Object containing user details.
 * @param {string} objParams.mobileNumber - User's mobile number.
 * @param {string} objParams.password - User's password.
 * @param {string} objParams.name - User's name.
 * @param {string} objParams.email - User's email.
 *
 * @returns {Promise<User>} Promise resolving to the new user object.
 * @throws {Error} If a user with the given mobile number already exists.
 */
exports.registerUser = async (objParams) => {
  try {
    const { mobileNumber, password, name, email } = objParams;

    const existingUser = await Users.findOne({
      where: {
        mobileNumber,
      },
    });

    console.log("existingUser :: ", existingUser);
    if (!_.isEmpty(existingUser)) {
      throw new Error("User with same mobile already exists");
    }

    const newUser = await Users.create({
      email,
      name,
      mobileNumber,
      userGroupId: 1,
      status: "A",
    });

    const hashedPassword = newUser.generateHash(password);

    newUser.password = hashedPassword;

    await newUser.save();

    return newUser;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

/**
 * Registers a new FCM token for the user with the given GUID, or updates
 * the existing token if one exists.
 *
 * @param {Object} objParams - The parameters.
 * @param {string} objParams.fcmToken - The FCM token to register.
 * @param {string} objParams.guuid - The GUID of the user to register the token for.
 */
exports.registerFCMTokenService = async (objParams) => {
  try {
    const { fcmToken, guuid } = objParams;

    const existingToken = await UserToken.findOne({
      where: { guuid, status: "A" },
    });

    if (_.isEmpty(existingToken)) {
      await UserToken.create({
        guuId: guuid,
        fcmTokem: fcmToken,
        status: "A",
      });
    } else {
      existingToken.fcmTokem = fcmToken;
      existingToken.status = "A";
      await existingToken.save();
    }

    return {};
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.registerAuthTokenService = async (objParams) => {
  try {
    const { userId, authToken, guuid } = objParams;

    const existingToken = await UserToken.findOne({
      where: { guuid, status: "A" },
    });

    if (_.isEmpty(existingToken)) {
      await UserToken.create({
        userId: userId,
        guuId: guuid,
        authTokem: authToken,
        status: "A",
      });
    } else {
      existingToken.userId = userId;
      existingToken.authTokem = authToken;
      existingToken.status = "A";
      await existingToken.save();
    }

    return {};
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};
