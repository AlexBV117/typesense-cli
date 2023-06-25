import { join } from "path";
import { writeFileSync } from "fs";
export default class logger {
    constructor(_logDir) {
        this.logFileData = "";
        function exitHandler() {
            let logs = logger.getInstance();
            writeFileSync(logs.logFilePath, logs.logFileData);
        }
        const date = new Date();
        const fileName = date.getDate() +
            "" +
            date.getMonth() +
            "" +
            date.getFullYear() +
            "" +
            "(" +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds() +
            ").log";
        this.logFilePath = join(_logDir, ".typesense", ".log", fileName);
        process.on("beforeExit", exitHandler.bind(null));
    }
    static getInstance(_logDir) {
        if (logger.single_instance === null) {
            if (_logDir) {
                logger.single_instance = new logger(_logDir);
            }
            else
                throw new Error("Log directory is unspecified");
        }
        return logger.single_instance;
    }
    log(message) {
        this.logFileData += message;
        console.log(message);
    }
    info(message) {
        message = "INFO:" + message + "\n";
        this.logFileData += message;
        console.log("\x1b[95m%s\x1b[0m", message);
    }
    warn(message) {
        message = "WARN:" + message + "\n";
        this.logFileData += message;
        console.log("\x1b[93m%s\x1b[0m", message);
    }
    error(message) {
        message = "ERROR:" + message + "\n";
        this.logFileData += message;
        console.log("\x1b[31m%s\x1b[0m", message);
    }
}
logger.single_instance = null;
