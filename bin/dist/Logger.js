import { join } from "path";
import { writeFileSync } from "fs";
import { exit } from "process";
class Logger {
    constructor(_logDir, verbose) {
        this.logFileData = "";
        this.verbose = verbose;
        function exitHandler() {
            let logs = Logger.getInstance();
            writeFileSync(logs.logFilePath, logs.logFileData);
        }
        const date = new Date();
        const fileName = date.getDate() +
            "-" +
            date.getMonth() +
            "-" +
            date.getFullYear() +
            "-" +
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
    static getInstance(_logDir, verbose) {
        console.log("TEST LOGGER: " + _logDir);
        if (verbose === undefined) {
            console.log("no verbose modifier");
            verbose = false;
        }
        if (Logger.single_instance === null) {
            if (_logDir) {
                Logger.single_instance = new Logger(_logDir, verbose);
            }
            else {
                console.log("\x1b[31m%s\x1b[0m", "CRITICAL ERROR: Log directory is unspecified");
                exit(1);
            }
        }
        return Logger.single_instance;
    }
    log(message) {
        this.logFileData += message;
        if (this.verbose) {
            console.log(message);
        }
    }
    info(message) {
        message = "INFO: " + message + "\n";
        this.logFileData += message;
        if (this.verbose) {
            console.log("\x1b[95m%s\x1b[0m", message);
        }
    }
    warn(message) {
        message = "WARN: " + message + "\n";
        this.logFileData += message;
        console.log("\x1b[93m%s\x1b[0m", message);
    }
    error(message) {
        message = "ERROR: " + message + "\n";
        this.logFileData += message;
        console.log("\x1b[31m%s\x1b[0m", message);
    }
}
Logger.single_instance = null;
export default Logger;
