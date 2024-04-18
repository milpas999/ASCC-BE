const moment = require("moment-timezone");

const arrDateTimeFormat = {
  DATE_TIME: "YYYY/MM/DD HH:mm:ss",
  DATE_TIME_PICKER_FORMAT: "dd/MM/y HH:mm",
};
exports.arrDateTimeFormat = arrDateTimeFormat;

const getCurrentDateTime = () => {
  return moment().tz("Asia/Kolkata").format();
};
exports.getCurrentDateTime = getCurrentDateTime;

const getDisplayDateTimeFormat = (dateTime) => {
  return moment(dateTime)
    .tz("Asia/Kolkata")
    .format(arrDateTimeFormat.DATE_TIME);
};
exports.getDisplayDateTimeFormat = getDisplayDateTimeFormat;
