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
                name: "setupArgs",
                message: "Set up args?"
            }
        ];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }

    writing123() {

        const templateProperties = {
            name: this.props.name,
            description: this.props.description,
            version: this.props.version,
            ...this.props
        };


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

        if (this.props.setupArgs) {
            this.fs.copyTpl(
                this.templatePath('args.js'),
                this.destinationPath(path.join(this.props.name, "src/app/args.js")),
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
            if (this.props.setupArgs) {
                installs.push("yargs");
            }

            this.npmInstall(installs, { 'save': true });
        });
    }
};


module.exports = AppGenerator;
