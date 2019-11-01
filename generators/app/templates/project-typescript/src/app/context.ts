import {getInfo, Info} from "./process";<% if (setupConfig) { %>
import {readConfig, Config} from "./config";<% } %><% if (setupLogging) { %>
import {createLogger, setupUnhandledErrors, Logger} from "./logging";<% } %><% if (setupArgs) { %>
import {Arguments} from "./args";<% } %>

interface Context {
    info: Info;<% if (setupConfig) { %>
    config: Config;<% } %><% if (setupLogging) { %>
    logger: Logger;<% } %><% if (setupArgs) { %>
    args: Arguments;<% } %>
}

function createContext(<% if (setupArgs) { %>args: Arguments<% } %>): Context {
    const info = getInfo();<% if (setupConfig) { %>
    const config = readConfig(<% if (setupArgs) { %>args.config<% } else { %>process.env.NODE_ENV<% } %>);<% } %><% if (setupLogging) { %>
    const logger = createLogger(<% if (setupConfig) { %>config, <% } %><% if (setupArgs) { %>args<% } %>);<% } %>
    const context = {
        info,<% if (setupConfig) { %>
        config,<% } %><% if (setupLogging) { %>
        logger,<% } %><% if (setupArgs) { %>
        args<% } %>
    } as Context;<% if (setupLogging) { %>
    setupUnhandledErrors(context.logger);<% } %>
    return context;
}

export {createContext};
