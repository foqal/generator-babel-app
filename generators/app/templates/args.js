
import {getInfo} from "./process";
import yargs from "yargs";


const args = yargs.usage('Usage: $0 <command> [options]')
                .version(getInfo().version || "UNKNOWN")
                <% if (setupConfig) { %>
                .option("config", {
                    description: 'The config file.',
                    default: "development"
                })
                <% } %>
                .option("verbose", {
                    description: 'More detailed logging',
                    alias: "v",
                    boolean: true
                })

                .argv;
export {args};
