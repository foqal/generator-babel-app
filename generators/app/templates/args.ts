import {getInfo} from "./process";
import yargs from "yargs";

interface Arguments {
    config: string;
    verbose: boolean;
}

const args = yargs.usage('Usage: $0 <command> [options]')
                .version(getInfo().version || "UNKNOWN")
                .option("config", {
                    description: 'The config file.',
                    default: "development"
                })
                .option("verbose", {
                    description: 'More detailed logging',
                    alias: "v",
                    boolean: true
                })
                .argv;
export {args, Arguments};
