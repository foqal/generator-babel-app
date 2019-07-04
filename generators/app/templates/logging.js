import bunyan from "bunyan";

const DEFAULT_CONFIG = {
    appName: "<%= name %>",
    stdoutLevel: "debug",
    errorPath: "/var/tmp/<%= name %>-error.log",
    color: true
};


function createLogger(config, args) {
    const logConfig = config && config.logging || DEFAULT_CONFIG;

    let stdoutLevel = logConfig.stdoutLevel;
    if (args) {
        stdoutLevel = args.verbose ? "DEBUG" : stdoutLevel;
    }

    const logger = bunyan.createLogger({
        name: logConfig.appName,
        serializers: bunyan.stdSerializers,
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

    ["debug", "info", "error", "warn", "trace"].forEach(name => {
        logger[name] = logger[name].bind(logger);
    });

    return logger;
}


export {createLogger};
