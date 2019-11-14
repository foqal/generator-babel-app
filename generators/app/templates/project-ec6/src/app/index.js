import {getInfo<% if (setupCleanup) { %>, setupAwaitMain<% } %>} from "./process";<% if (installNativeInjects) { %>
import "native-injects";<% } %><% if (setupConfig) { %>
import {readConfig} from "./config";<% } %><% if (setupLogging) { %>
import {createLogger} from "./logging";<% } %><% if (setupArgs) { %>
import {args} from "./args";<% } %>


async function run(stopping, args) {
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
        <% if (setupCleanup) { %>
        stopping.onCleanup(async () => {
            // Do something before stopping.
            // The process wont exit without waiting for this task to complete.
        });
        <% } %>
        // Your Code Here


        context.logger.info("Done");
    } catch (err) {
        context.logger.error({err}, "Unhandled Error");
    }<% } else { %>
    // Your Code Here
    <% } %>
}<% if (setupCleanup) { %>
<% if (setupArgs) { %>setupAwaitMain(run, args);<% } else { %>setupAwaitMain(run, process.argv);<% } %>
<% } else {%>
<% if (setupArgs) { %>run(args);<% } else { %>run(process.argv);<% } %>
<% } %>
