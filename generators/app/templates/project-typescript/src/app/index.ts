<% if (setupCleanup) { %>import {setupAwaitMain, StoppingHandler} from "./process";<% } %><% if (installNativeInjects) { %>
import "native-injects";<% } %><% if (setupArgs) { %>
import {args, Arguments} from "./args";<% } %>
import {createContext} from "./context";


async function run(<% if (setupCleanup) { %>stopping: StoppingHandler, <% } %><% if (setupArgs) { %>args: Arguments<% } %>): Promise<void> {
    const context = createContext(<% if (setupArgs) { %>args<% } %>);
    <% if (setupLogging) { %>
    context.logger.info({app: context.info.name, version: context.info.version}, "Starting...");
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
<% if (setupCleanup) { %>
    stopping.onCleanup(async () => {
        // Do something before stopping.
        // The process wont exit without waiting for this task to complete.
    });
<% } %>
    // Your Code Here
    <% } %>
}<% if (setupCleanup) { %>
<% if (setupArgs) { %>setupAwaitMain(run, args);<% } else { %>setupAwaitMain(run);<% } %>
<% } else {%>
<% if (setupArgs) { %>run(args);<% } else { %>run();<% } %>
<% } %>
