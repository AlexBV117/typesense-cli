import Settings from "./Settings";
import logger from "./logger";

export default class RunTime {
  private static single_instance: RunTime | null = null;

  public logger: logger;
  public settings: Settings;

  private constructor() {
    this.settings = Settings.getInstance();
    this.logger = logger.getInstance(this.settings.getHome());
  }

  public static getInstance(): RunTime {
    if (RunTime.single_instance === null) {
      RunTime.single_instance = new RunTime();
    }
    return RunTime.single_instance;
  }
}
