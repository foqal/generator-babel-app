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
                type: "list",
                name: "language",
                message: "Language",
                choices: ["Typescript", "ECMA Script"]
            },
            {
                type: "list",
                name: "projectType",
                message: "Project Type",
                choices: ["Deployable", "Library"]
            },
            {
                type: "confirm",
                name: "installNativeInjects",
                message: "Install Native Injects?"
            },
            {
                type: "confirm",
                name: "setupLogging",
                message: "Set up logging?",
                when: input => input.projectType == "Deployable"
            },
            {
                type: "confirm",
                name: "setupConfig",
                message: "Set up Config?",
                when: input => input.projectType == "Deployable"
            },
            {
                type: "checkbox",
                name: "environments",
                message: "Environments",
                default: ["development", "staging", "production"],
                choices: () => ["development", "staging", "beta", "production"],
                when: input => input.setupConfig
            },
            {
                type: "confirm",
                name: "setupArgs",
                message: "Set up args?",
                when: input => input.projectType == "Deployable"
            },
            {
                type: "confirm",
                name: "setupCleanup",
                message: "Set up cleanup?",
                when: input => input.projectType == "Deployable"
            }
        ];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }

    writing() {
        const isTypescript = this.props.language == "Typescript";
        const templateProperties = {
            name: this.props.name,
            description: this.props.description,
            version: this.props.version,
            isTypescript,
            environments: [],
            projectType: "Deployable",
            installNativeInjects: false,
            setupLogging: false,
            setupConfig: false,
            setupArgs: false,
            setupCleanup: false,

            ...this.props
        };

        const projectPath = isTypescript ? "project-typescript" : "project-ec6";
        const extension = isTypescript ? ".ts" : ".js"
        let options;
        if (this.props.projectType == "Library") {
            options = {
                globOptions: {
                    ignore: ["**/bin/*", "**/src/app/*"]
                }
            }
        }
        this.fs.copyTpl(
            this.templatePath(projectPath + '/**'),
            this.destinationPath(this.props.name),
            templateProperties,
            null,
            options
        );

        if (this.props.projectType == "Library") {
            this.fs.copyTpl(
                this.templatePath(projectPath + '/src/app/**'),
                this.destinationPath(this.props.name + "/src/lib"),
                templateProperties
            );
        }


        this.fs.copyTpl(
            this.templatePath(projectPath + '/src/.*'),
            this.destinationPath(path.join(this.props.name, "src")),
            templateProperties
        );

        this.fs.copyTpl(
            this.templatePath(projectPath + '/.gitignore'),
            this.destinationPath(path.join(this.props.name, ".gitignore")),
            templateProperties
        );

        if (this.props.setupLogging) {
            this.fs.copyTpl(
                this.templatePath(`logging${extension}`),
                this.destinationPath(path.join(this.props.name, `src/app/logging${extension}`)),
                templateProperties
            );
        }

        if (this.props.setupArgs) {
            this.fs.copyTpl(
                this.templatePath(`args${extension}`),
                this.destinationPath(path.join(this.props.name, `src/app/args${extension}`)),
                templateProperties
            );
        }

        if (this.props.setupConfig) {
            this.props.environments.forEach(environment => {
                if (environment == "development") {
                    this.fs.copyTpl(
                        this.templatePath("config/development.js"),
                        this.destinationPath(path.join(this.props.name, "src/config/development.js")),
                        templateProperties
                    );
                } else {
                    this.fs.copyTpl(
                        this.templatePath("config/default.js"),
                        this.destinationPath(path.join(this.props.name, `src/config/${environment}.js`)),
                        templateProperties
                    );
                }

            })

            this.fs.copyTpl(
                this.templatePath(`config${extension}`),
                this.destinationPath(path.join(this.props.name, `src/app/config${extension}`)),
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
            const devInstalls = [];
            if (this.props.installNativeInjects) {
                installs.push("native-injects");
            }
            if (this.props.setupLogging) {
                installs.push("bunyan");
                devInstalls.push("@types/bunyan");
            }
            if (this.props.setupArgs) {
                installs.push("yargs");
            }

            this.npmInstall(installs, { 'save': true });
            this.npmInstall(devInstalls, { 'save-dev': true });

        });
    }
};


module.exports = AppGenerator;
