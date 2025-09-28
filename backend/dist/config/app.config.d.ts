declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    redis: {
        host: string;
        port: number;
        password: string;
        db: number;
    };
    storage: {
        endpoint: string;
        accessKey: string;
        secretKey: string;
        bucket: string;
        region: string;
        forcePathStyle: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    scanning: {
        defaultTimeout: number;
        defaultViewport: {
            width: number;
            height: number;
        };
        maxConcurrentScans: number;
        maxCrawlDepth: number;
        userAgent: string;
    };
    webhook: {
        secret: string;
        timeout: number;
        retries: number;
    };
    retraced: {
        url: string;
        apiKey: string;
        projectId: string;
    };
};
export default _default;
