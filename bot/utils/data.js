const dayjs = require("dayjs");

const dateFormat = "DD-MM-YYYY";

const timeStampFormat = "DD-MM-YYYY HH:mm:ss";

const getCurrentTimeStamp = () => dayjs().format(timeStampFormat);

module.exports = { getCurrentTimeStamp };
