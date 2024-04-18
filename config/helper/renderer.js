// const constants = require("../config/constants");

exports.renderer = async (req, res, viewPath, objParam) => {
  // objParam.constants = constants;
  objParam.errors = req.flash('errors');
  objParam.success = req.flash('success');
  objParam.sessionUserData = req.session.userData;
  objParam.siteDefaultData = {};

  res.render(viewPath, objParam);
};

exports.viewRedirect = async (
  req,
  res,
  viewPath,
  objParams,
  flashType = 'errors'
) => {
  if (req.session) {
    req.flash(flashType, objParams.message);
  }
  //   res.redirect(`/${process.env.SERVER_FOLDER}${viewPath}/`);
  res.redirect(`${viewPath}/`);
  res.end();
};

exports.sendOnlyBooleanResponse = async (req, res, boolValue) => {
  res.send(boolValue);
  res.end();
};

exports.sendJsonResponse = async (
  req,
  res,
  statusCode,
  data,
  error,
  flagMsg
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.write(
    JSON.stringify({
      Result: data,
      Status: error,
      Message: flagMsg
    })
  );
  res.end();
};

exports.sendJsonResponseListingDataTable = async (
  req,
  res,
  statusCode,
  data,
  meta,
  error,
  flagMsg
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.write(
    JSON.stringify({
      data,
      meta,
      error,
      flagMsg
    })
  );
  res.end();
};
