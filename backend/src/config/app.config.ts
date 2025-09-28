export default () => ({
  // Application
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    name: process.env.DB_NAME || 'a11y_platform',
  },
  
  // Redis (for BullMQ)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },
  
  // S3/MinIO Storage
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT || 'http://localhost:9000',
    accessKey: process.env.STORAGE_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.STORAGE_SECRET_KEY || 'minioadmin',
    bucket: process.env.STORAGE_BUCKET || 'a11y-artifacts',
    region: process.env.STORAGE_REGION || 'us-east-1',
    forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === 'true',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  
  // Scanning
  scanning: {
    defaultTimeout: parseInt(process.env.SCAN_TIMEOUT, 10) || 30000,
    defaultViewport: {
      width: parseInt(process.env.SCAN_VIEWPORT_WIDTH, 10) || 1280,
      height: parseInt(process.env.SCAN_VIEWPORT_HEIGHT, 10) || 720,
    },
    maxConcurrentScans: parseInt(process.env.MAX_CONCURRENT_SCANS, 10) || 5,
    maxCrawlDepth: parseInt(process.env.MAX_CRAWL_DEPTH, 10) || 3,
    userAgent: process.env.SCAN_USER_AGENT || 'A11y-Platform-Scanner/1.0',
  },
  
  // Webhooks
  webhook: {
    secret: process.env.WEBHOOK_SECRET || 'your-webhook-secret',
    timeout: parseInt(process.env.WEBHOOK_TIMEOUT, 10) || 5000,
    retries: parseInt(process.env.WEBHOOK_RETRIES, 10) || 3,
  },
  
  // External APIs
  retraced: {
    url: process.env.RETRACED_URL,
    apiKey: process.env.RETRACED_API_KEY,
    projectId: process.env.RETRACED_PROJECT_ID,
  },
});