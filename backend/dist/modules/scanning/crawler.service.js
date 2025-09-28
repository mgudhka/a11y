"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CrawlerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const playwright_1 = require("playwright");
let CrawlerService = CrawlerService_1 = class CrawlerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CrawlerService_1.name);
    }
    async onModuleInit() {
        this.browser = await playwright_1.chromium.launch({
            headless: true,
            args: ['--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox'],
        });
    }
    async onModuleDestroy() {
        if (this.browser) {
            await this.browser.close();
        }
    }
    async createPage(viewport = { width: 1280, height: 720 }, userAgent) {
        if (!this.browser) {
            await this.onModuleInit();
        }
        const context = await this.browser.newContext({
            viewport,
            userAgent: userAgent || this.configService.get('scanning.userAgent'),
        });
        const page = await context.newPage();
        page.setDefaultTimeout(this.configService.get('scanning.defaultTimeout', 30000));
        return page;
    }
    async crawl(baseUrl, maxDepth = 3, includePatterns, excludePatterns) {
        const discoveredUrls = new Set();
        const visitedUrls = new Set();
        const urlQueue = [{ url: baseUrl, depth: 0 }];
        this.logger.log(`Starting crawl of ${baseUrl} with max depth ${maxDepth}`);
        while (urlQueue.length > 0) {
            const { url, depth } = urlQueue.shift();
            if (visitedUrls.has(url) || depth > maxDepth) {
                continue;
            }
            if (!this.shouldCrawlUrl(url, baseUrl, includePatterns, excludePatterns)) {
                continue;
            }
            try {
                visitedUrls.add(url);
                discoveredUrls.add(url);
                const page = await this.createPage();
                try {
                    await page.goto(url, {
                        waitUntil: 'networkidle',
                        timeout: 30000,
                    });
                    if (depth < maxDepth) {
                        const links = await this.extractLinks(page, baseUrl);
                        for (const link of links) {
                            if (!visitedUrls.has(link)) {
                                urlQueue.push({ url: link, depth: depth + 1 });
                            }
                        }
                    }
                    this.logger.debug(`Crawled ${url} (depth ${depth}), found ${discoveredUrls.size} URLs so far`);
                }
                finally {
                    await page.close();
                }
            }
            catch (error) {
                this.logger.warn(`Failed to crawl ${url}: ${error.message}`);
            }
            await this.delay(100);
        }
        this.logger.log(`Crawl completed. Discovered ${discoveredUrls.size} URLs`);
        return Array.from(discoveredUrls);
    }
    async extractLinks(page, baseUrl) {
        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a[href]'));
            return anchors.map(anchor => anchor.href);
        });
        const parsedBaseUrl = new URL(baseUrl);
        const validLinks = [];
        for (const link of links) {
            try {
                const parsedLink = new URL(link);
                if (parsedLink.hostname === parsedBaseUrl.hostname) {
                    validLinks.push(this.normalizeUrl(parsedLink.toString()));
                }
            }
            catch {
            }
        }
        return [...new Set(validLinks)];
    }
    shouldCrawlUrl(url, baseUrl, includePatterns, excludePatterns) {
        try {
            const parsedUrl = new URL(url);
            const parsedBaseUrl = new URL(baseUrl);
            if (parsedUrl.hostname !== parsedBaseUrl.hostname) {
                return false;
            }
            if (excludePatterns?.length) {
                for (const pattern of excludePatterns) {
                    if (this.matchesPattern(url, pattern)) {
                        return false;
                    }
                }
            }
            if (includePatterns?.length) {
                return includePatterns.some(pattern => this.matchesPattern(url, pattern));
            }
            return true;
        }
        catch {
            return false;
        }
    }
    matchesPattern(url, pattern) {
        try {
            const regex = new RegExp(pattern);
            return regex.test(url);
        }
        catch {
            return url.includes(pattern);
        }
    }
    normalizeUrl(url) {
        try {
            const parsed = new URL(url);
            parsed.hash = '';
            if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
                parsed.pathname = parsed.pathname.slice(0, -1);
            }
            return parsed.toString();
        }
        catch {
            return url;
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.CrawlerService = CrawlerService;
exports.CrawlerService = CrawlerService = CrawlerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CrawlerService);
//# sourceMappingURL=crawler.service.js.map