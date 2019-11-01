<% if (setupLogging) { %>
interface LoggingConfig {
    appName: string;
    stdoutLevel: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
    errorPath: string;
    color: boolean;
}
<% } %>
interface Config {
    detailedErrors: boolean;<% if (setupLogging) { %>
    logging: LoggingConfig;<% } %>
}

function readConfig(file?: string): Config {
    try {
        return require("../config/" + (file || "development")).default as Config;
    } catch (err) {
        throw new Error(`Could not open config file ${file}`);
    }

}

export {readConfig, Config<% if (setupLogging) { %>, LoggingConfig<% } %>};
