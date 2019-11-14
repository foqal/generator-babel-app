interface Info {
    name: string;
    version?: string;
    description?: string;
}

function getInfo(): Info {
    if (process.env.npm_package_name) {
        return {
            name: process.env.npm_package_name,
            version: process.env.npm_package_version,
            description: process.env.npm_package_description
        };
    } else {
        const packageInfo = require("../package.json"); //eslint-disable-line @typescript-eslint/no-var-requires
        return {
            name: packageInfo.name,
            version: packageInfo.version,
            description: packageInfo.description
        };
    }
}

<% if (setupCleanup) { %>

type ExitHandler = (code: ExitCode) => Promise<void>;
type AwaitList = Array<ExitHandler>;
class StoppingHandler {
    awaitList: AwaitList;
    stopPromise: Promise<void>;
    stoppingCheck: () => boolean;

    constructor(awaitList: AwaitList, stopPromise: Promise<void>, stoppingCheck: () => boolean) {
        this.awaitList = awaitList;
        this.stopPromise = stopPromise;
        this.stoppingCheck = stoppingCheck;
    }

    onCleanup(promise: ExitHandler): void {
        this.awaitList.push(promise);
    }

    get isStopping(): boolean {
        return this.stoppingCheck();
    }

    get stop(): Promise<void> {
        return this.stopPromise;
    }
}

interface ExitCode {
    signal: string;
}

interface ExitCode {
    signal: string;
}

async function setupAwaitMain(promise: (...args: any[]) => Promise<void>, ...args: any[]): Promise<void>{ //eslint-disable-line @typescript-eslint/no-explicit-any
    let stopping = false;
    let stopped = false;
    let processAccept: () => void;
    const stopPromise = new Promise<void>(accept => {
        processAccept = accept;
    });

    const awaitList: AwaitList = [];

    const cleanup = async (code: ExitCode): Promise<void> => {
        stopping = true;
        await Promise.all(awaitList.map(handler => handler(code)));
        stopped = true;
        processAccept();
    };

    const exit = (code: ExitCode): boolean => {
        if (stopping) {
            return !stopped;
        }

        if (awaitList.length > 0) {
            cleanup(code);
            return true;
        }
        return false;
    };

    process.on("exit", exit.bind(null, {signal: "exit"}));
    process.on("SIGINT", exit.bind(null, {signal: "SIGINT"}));
    process.on("SIGTERM", exit.bind(null, {signal: "SIGTERM"}));

    const handler = new StoppingHandler(awaitList, stopPromise, () => stopping);

    await promise(handler, ...args);
    if (!stopping) {
        exit({signal: "done"});
    }
    await stopPromise;

}

export {getInfo, setupAwaitMain, StoppingHandler, Info};
<% } else {%>
export {getInfo, Info};
<% } %>
