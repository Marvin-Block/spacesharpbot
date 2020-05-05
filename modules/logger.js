const winston = require("winston");
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const config = require("../config/config.json")
module.exports.run = async(loglevel, logmessage, loglabel) => {
    try {
        const myFormat = printf(({ level, message, label, timestamp }) => {
            return `${timestamp} ${level} in ${label}: ${message}`;
        });

        const logger = createLogger({
            format: combine(
                timestamp(),
                myFormat
            ),
            transports: [
                new winston.transports.File({ filename: config.logDir + 'combined.log' })
            ]
        });

        logger.log({
            level: loglevel,
            message: logmessage,
            label: loglabel
        });
    } catch (err) {
        logger.log({
            level: "Error",
            message: err,
        });
    }
};