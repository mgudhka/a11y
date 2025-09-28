import { ConfigService } from '@nestjs/config';
import { Page } from 'playwright';
export declare class CrawlerService {
    private configService;
    private readonly logger;
    private browser;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    createPage(viewport?: {
        width: number;
        height: number;
    }, userAgent?: string): Promise<Page>;
    crawl(baseUrl: string, maxDepth?: number, includePatterns?: string[], excludePatterns?: string[]): Promise<string[]>;
    private extractLinks;
    private shouldCrawlUrl;
    private matchesPattern;
    private normalizeUrl;
    private delay;
}
