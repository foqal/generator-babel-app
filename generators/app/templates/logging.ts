import * as Logger from "bunyan";<% if (setupConfig) { %>
import {Config, LoggingConfig} from "./config";<% } %><% if (setupArgs) { %>
import {Arguments} from "./args";<% } %>

const DEFAULT_CONFIG = {
    appName: "tmp",
    stdoutLevel: "debug",
    errorPath: "/var/tmp/tmp-error.log",
    color: true
};

function setupUnhandledErrors(logger: Logger): void {
    process.on("unhandledRejection", (reason: any) => { //eslint-disable-line @typescript-eslint/no-explicit-any
        logger.error({reason}, "Unhandled promise error");
    });
    process.on("uncaughtException", (err: Error) => {
        logger.error({err}, "Unhandled Exception");
    });
}

function createLogger(<% if (setupConfig) { %>config: Config, <% } %><% if (setupArgs) { %>args: Arguments<% } %>): Logger {
<% if (setupConfig) { %>
    const logConfig = (config && config.logging || DEFAULT_CONFIG) as LoggingConfig;
    let stdoutLevel = logConfig.stdoutLevel;
<% } else { %>
    const logConfig = DEFAULT_CONFIG;
    <% if (setupArgs) { %>let<% } else { %>const<% } %> stdoutLevel = logConfig.stdoutLevel as ("trace" | "debug" | "info" | "warn" | "error" | "fatal");
<% } %>
<% if (setupArgs) { %>
    if (args) {
        stdoutLevel = args.verbose ? "debug" : stdoutLevel;
    }<% } %>
    const logger = Logger.createLogger({
        name: logConfig.appName,
        serializers: Logger.stdSerializers,
        streams: [
            {
                level: stdoutLevel,
                stream: process.stdout // log INFO and above to stdout
            },
            {
                level: 'error',
                path: logConfig.errorPath  // log ERROR and above to a file
            }
        ]
    });
    logger.trace = logger.trace.bind(logger);
    logger.debug = logger.debug.bind(logger);
    logger.info = logger.info.bind(logger);
    logger.warn = logger.warn.bind(logger);
    logger.error = logger.error.bind(logger);
    logger.fatal = logger.fatal.bind(logger);
    setupUnhandledErrors(logger);

    return logger;
}


export {createLogger, Logger};
