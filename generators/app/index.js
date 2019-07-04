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
                name: "description",
                message: "Project Description",
                default: ""
            },
            {
                name: "version",
                message: "Version",
                default: "0.0.1"
            },
        ];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }

    writing() {

        this.fs.copyTpl(
            this.templatePath('**'),
            this.destinationPath(path.join(this.props.name)),
            {
                name: this.props.name,
                description: this.props.description,
                version: this.props.version
            }
        );
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
        });
    }
};


module.exports = AppGenerator;
