
function readConfig(file) {
    try {
        return require("../config/" + (file || "development")).default;
    } catch (err) {
        console.error(`Could not open config file ${file}`); //eslint-disable-line no-console
        process.exit(-1);
    }

}

export {readConfig};
