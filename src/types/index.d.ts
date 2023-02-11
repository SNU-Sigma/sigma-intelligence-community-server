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
            /**
             * Files will be rotated every `rotate_every` milliseconds. Defaults to 3600000 (60 minutes).
             */
            rotate_every?: number
        })
    }

    export { S3StreamLogger }
}
