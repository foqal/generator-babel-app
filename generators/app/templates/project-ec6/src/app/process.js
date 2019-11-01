
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

<% if (setupCleanup) { %>
class StoppingHandler {
    constructor(awaitList, stopPromise, stoppingCheck) {
        this.awaitList = awaitList;
        this.stopPromise = stopPromise;
        this.stoppingCheck = stoppingCheck;
    }

    onCleanup(promise) {
        this.awaitList.push(promise);
    }

    get isStopping() {
        return this.stoppingCheck();
    }

    get stop() {
        return this.stopPromise;
    }
}

async function setupAwaitMain(promise, ...args) {
    let stopping = false;
    let stopped = false;
    let processAccept = null;
    const stopPromise = new Promise(accept => {
        processAccept = accept;
    });

    const awaitList = [];

    const cleanup = async (code) => {
        stopping = true;
        await Promise.all(awaitList.map(handler => handler(code)));
        stopped = true;
        processAccept();
    };

    const exit = (code) => {
        if (stopping) {
            return !stopped;
        }

        if (awaitList.length > 0) {
            cleanup(code);
            return true;
        }
    };

    process.on("exit", exit.bind(this, {signal: "exit"}));
    process.on("SIGINT", exit.bind(this, {signal: "SIGINT"}));
    process.on("SIGTERM", exit.bind(this, {signal: "SIGTERM"}));

    const handler = new StoppingHandler(awaitList, stopPromise, () => stopping);

    await promise(handler, ...args);
    if (!stopping) {
        exit({signal: "done"});
    }
    await stopPromise;

}

export {getInfo, setupAwaitMain};
<% } else {%>
export {getInfo};
<% } %>
