declare module 's3-streamlogger' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface S3StreamLogger extends NodeJS.WritableStream {}

    class S3StreamLogger {
        constructor(param: {
            region: string
            bucket: string
            folder: string
            access_key_id: string
            secret_access_key: string
        })
    }

    export = S3StreamLogger
}
