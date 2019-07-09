import {getInfo} from "./info";<% if (installNativeInjects) { %>
import "native-injects";<% } %><% if (setupConfig) { %>
import {readConfig} from "./config";<% } %><% if (setupLogging) { %>
import {createLogger} from "./logging";<% } %><% if (setupArgs) { %>
import {args} from "./args";<% } %>

function run(args) {
    //Updated
    const info = getInfo();<% if (setupConfig) { %>
    const config = readConfig(args.config);<% } %><% if (setupLogging) { %>
    const logger = createLogger(config, args);<% } %>
    const context = {
        info,<% if (setupConfig) { %>
        config,<% } %><% if (setupLogging) { %>
        logger,<% } %><% if (setupArgs) { %>
        args<% } %>
    };<% if (setupLogging) { %>
    context.logger.info({app: info.name, version: info.version}, "Starting...");
    try {


        // Your Code Here


        context.logger.info("Done");
    } catch (err) {
        context.logger.error({err}, "Unhandled Error");
    }<% } else { %>
    // Your Code Here
    <% } %>
}

<% if (setupArgs) { %>run(args);<% } else { %>run(process.argv);<% } %>
