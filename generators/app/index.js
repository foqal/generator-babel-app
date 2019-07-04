'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require("path");
const ncu = require('npm-check-updates');

class AppGenerator extends Generator {
    prompting() {
        this.log(
            yosay(`Welcome to ${chalk.red('Foqal Project Generator')} generator!`)
        );

        const prompts = [
            {
                name: "name",
                message: "Project Name",
                default: path.basename(process.cwd())
            },
            {
                type: "input",
                name: "description",
                message: "Project Description",
                default: ""
            },
            {
                type: "input",
                name: "version",
                message: "Version",
                default: "0.0.1"
            },
            {
                type: "confirm",
                name: "installNativeInjects",
                message: "Install Native Injects?"
            },
            {
                type: "confirm",
                name: "setupLogging",
                message: "Set up logging?"
            },
            {
                type: "confirm",
                name: "setupConfig",
                message: "Set up Config?"
            },
            {
                type: "confirm",
                name: "installYargs",
                message: "Install Yargs?"
            }
        ];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }

    writing() {

        const imports = [];
        const contextStrings = ["info"];
        const preContext = [];
        const body = [];
        const templateProperties = {
            name: this.props.name,
            description: this.props.description,
            version: this.props.version,
            startScript: "babel-node ./app $@"
        };
        if (this.props.installNativeInjects) {
            imports.push(`import \"native-injects\";`);
        }
        if (this.props.setupConfig) {
            imports.push(`import {readConfig} from "./config";`);
            preContext.push(`const config = readConfig(args.config);`);
            contextStrings.push(`config`);
        }

        if (this.props.setupLogging) {
            imports.push(`import {createLogger} from "./logging";`);
            if (this.props.setupConfig) {
                preContext.push(`const logger = createLogger(config, args);`);
            } else {
                preContext.push(`const logger = createLogger(null, args);`);
            }
            contextStrings.push(`logger`);
            body.push(`    context.logger.info({app: info.name, version: info.version}, "Starting...");`)
            body.push(`\n\n    // Code Here\n\n    context.logger.info(\"Done\");`)

            templateProperties.startScript = "babel-node ./app $@ | bunyan -l DEBUG  -o short"
        }

        if (this.props.installYargs) {
            imports.push(`import yargs from \"yargs\";`);
            contextStrings.push(`args`);
            templateProperties.footer = `const args = yargs.usage('Usage: $0 <command> [options]')
                .version(process.env.npm_package_version || "UNKNOWN")
                ${this.props.setupLogging ? (`
                .option("config", {
                    description: 'The config file.',
                    default: "development"
                })
                `) : ""}
                .option("verbose", {
                    description: 'More detailed logging',
                    alias: "v",
                    boolean: true
                })

                .argv;
run(args);
            `
        } else {
            templateProperties.footer = "run(args);";
        }
        let bodyText = `    ${preContext.join("\n    ")}\n` +
                       `    const context = {\n        ${contextStrings.join(",\n        ")}\n    };\n` +
                        body.join("\n");
        templateProperties.imports = imports.join("\n");
        templateProperties.body = bodyText;

        this.fs.copyTpl(
            this.templatePath('project/**'),
            this.destinationPath(path.join(this.props.name)),
            templateProperties
        );
        this.fs.copyTpl(
            this.templatePath('project/src/.*'),
            this.destinationPath(path.join(this.props.name, "src")),
            templateProperties
        );

        if (this.props.setupLogging) {
            this.fs.copyTpl(
                this.templatePath('logging.js'),
                this.destinationPath(path.join(this.props.name, "src/app/logging.js")),
                templateProperties
            );
        }

        if (this.props.setupConfig) {
            this.fs.copyTpl(
                this.templatePath('config/**'),
                this.destinationPath(path.join(this.props.name, "src/config")),
                templateProperties
            );
            this.fs.copyTpl(
                this.templatePath('config.js'),
                this.destinationPath(path.join(this.props.name, "src/app/config.js")),
                templateProperties
            );
        }
    }

    install() {
        const done = this.async();
        ncu.run({
            upgrade: true,
            jsonUpgraded: true,
            packageManager: 'npm',
            silent: true,
            packageFile: this.destinationPath(path.join(this.props.name, "src", "package.json"))
        }).then((upgraded) => {
            done(null, upgraded);
            process.chdir(this.destinationPath(path.join(this.props.name, "src")));
            this.npmInstall();
            const installs = [];
            if (this.props.installNativeInjects) {
                installs.push("native-injects");
            }
            if (this.props.setupLogging) {
                installs.push("bunyan");
            }
            if (this.props.installYargs) {
                installs.push("yargs");
            }

            this.npmInstall(installs, { 'save': true });
        });
    }
};


module.exports = AppGenerator;
