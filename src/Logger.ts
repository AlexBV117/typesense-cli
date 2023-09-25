import { join } from "path";
import { writeFileSync } from "fs";
import { exit } from "process";

export default class Logger {
  private static single_instance: Logger | null = null;

  private logFilePath: string;
  private verbose: boolean;
  private logFileData: string = "";

  private constructor(_logDir: string, verbose: boolean) {
    this.verbose = verbose;
    function exitHandler() {
      let logs = Logger.getInstance();
      writeFileSync(logs.logFilePath, logs.logFileData);
    }
    const date = new Date();
    const fileName =
      date.getDate() +
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

  public static getInstance(_logDir?: string, verbose?: boolean): Logger {
    console.log("TEST LOGGER: " + _logDir);
    if (verbose === undefined) {
      console.log("no verbose modifier");
      verbose = false;
    }
    if (Logger.single_instance === null) {
      if (_logDir) {
        Logger.single_instance = new Logger(_logDir, verbose);
      } else {
        console.log(
          "\x1b[31m%s\x1b[0m",
          "CRITICAL ERROR: Log directory is unspecified"
        );
        exit(1);
      }
    }
    return Logger.single_instance;
  }

  public log(message: string) {
    this.logFileData += message;
    if (this.verbose) {
      console.log(message);
    }
  }
  public info(message: string) {
    message = "INFO: " + message + "\n";
    this.logFileData += message;
    if (this.verbose) {
      console.log("\x1b[95m%s\x1b[0m", message);
    }
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
