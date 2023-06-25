import Settings from "./Settings";
import logger from "./logger";
export default class RunTime {
    constructor() {
        this.settings = Settings.getInstance();
        this.logger = logger.getInstance(this.settings.getHome());
    }
    static getInstance() {
        if (RunTime.single_instance === null) {
            RunTime.single_instance = new RunTime();
        }
        return RunTime.single_instance;
    }
}
RunTime.single_instance = null;
