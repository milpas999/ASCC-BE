// const moment = require("moment-timezone");
const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
// import utc from 'dayjs/plugin/utc' // ES 2015

var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
// import timezone from 'dayjs/plugin/timezone' // ES 2015

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Calcutta");

const arrDateTimeFormat = {
  DATE_TIME: "YYYY/MM/DD HH:mm:ss",
  DATE_TIME_PICKER_FORMAT: "dd/MM/y HH:mm",
  TIME_FORMAT: "HH:mm:ss",
};
exports.arrDateTimeFormat = arrDateTimeFormat;

const getCurrentDateTime = () => {
  return dayjs().format();
  // return moment().tz("Asia/Kolkata").format();
};
exports.getCurrentDateTime = getCurrentDateTime;

const getDisplayDateTimeFormat = (dateTime) => {
  return dayjs(dateTime).format(arrDateTimeFormat.DATE_TIME);
  // return moment(dateTime)
  //   .tz("Asia/Kolkata")
  //   .format(arrDateTimeFormat.DATE_TIME);
};
exports.getDisplayDateTimeFormat = getDisplayDateTimeFormat;

const getFormattedTime = (time) => {
  return dayjs(time).format(arrDateTimeFormat.TIME_FORMAT);
  // return moment(time).tz("Asia/Kolkata").format(arrDateTimeFormat.TIME_FORMAT);
};
exports.getFormattedTime = getFormattedTime;
