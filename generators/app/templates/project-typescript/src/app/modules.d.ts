declare namespace NodeJS {
    /*eslint-disable @typescript-eslint/no-empty-interface*/
    export interface ProcessEnv {
        // Use this place to inject the expected environment variables. This allows you to
        // stronly type the properties in code.
        // @example using the following declaration:
        //```
        //    DATABASE: string;
        //```
        // you can use process.env.DATABASE.

        NODE_ENV: string;

    }
    /*eslint-enable @typescript-eslint/no-empty-interface*/
}


type Nullable<T> = T | null;
type UndefinableNullable<T> = T | null | undefined;
type Undefinable<T> = T | undefined;
