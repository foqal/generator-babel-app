
function getInfo() {
    if (process.env.npm_package_name) {
        return {
            name: process.env.npm_package_name,
            version: process.env.npm_package_version,
            description: process.env.npm_package_description
        };
    } else {
        const packageInfo = require("../package.json");
        return {
            name: packageInfo.name,
            version: packageInfo.version,
            description: packageInfo.description
        };
    }
}
export {getInfo};
