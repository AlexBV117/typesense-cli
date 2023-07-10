import { join } from "path";
import { writeFileSync } from "fs";

export default class logger {
  private static single_instance: logger | null = null;

  private logFilePath: string;
  private logFileData: string = "";

  private constructor(_logDir: string) {
    function exitHandler() {
      let logs = logger.getInstance();
      writeFileSync(logs.logFilePath, logs.logFileData);
    }
    const date = new Date();
    const fileName =
      date.getDate() +
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

  public static getInstance(_logDir?: string): logger {
    if (logger.single_instance === null) {
      if (_logDir) {
        logger.single_instance = new logger(_logDir);
      } else throw new Error("Log directory is unspecified");
    }
    return logger.single_instance;
  }

  public log(message: string) {
    this.logFileData += message;
    console.log(message);
  }
  public info(message: string) {
    message = "INFO: " + message + "\n";
    this.logFileData += message;
    console.log("\x1b[95m%s\x1b[0m", message);
  }
  public warn(message: string) {
    message = "WARN: " + message + "\n";
    this.logFileData += message;
    console.log("\x1b[93m%s\x1b[0m", message);
  }
  public error(message: string | unknown) {
    message = "ERROR: " + message + "\n";
    this.logFileData += message;
    console.log("\x1b[31m%s\x1b[0m", message);
  }
}
