import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium, Browser, BrowserContext, Page } from 'playwright';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private browser: Browser;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Initialize browser instance
    this.browser = await chromium.launch({
      headless: true,
      args: ['--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox'],
    });
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async createPage(
    viewport = { width: 1280, height: 720 },
    userAgent?: string,
  ): Promise<Page> {
    if (!this.browser) {
      await this.onModuleInit();
    }

    const context = await this.browser.newContext({
      viewport,
      userAgent: userAgent || this.configService.get('scanning.userAgent'),
    });

    const page = await context.newPage();

    // Set default timeout
    page.setDefaultTimeout(this.configService.get('scanning.defaultTimeout', 30000));

    return page;
  }

  async crawl(
    baseUrl: string,
    maxDepth: number = 3,
    includePatterns?: string[],
    excludePatterns?: string[],
  ): Promise<string[]> {
    const discoveredUrls = new Set<string>();
    const visitedUrls = new Set<string>();
    const urlQueue: { url: string; depth: number }[] = [{ url: baseUrl, depth: 0 }];

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

          // Extract links if we haven't reached max depth
          if (depth < maxDepth) {
            const links = await this.extractLinks(page, baseUrl);
            
            for (const link of links) {
              if (!visitedUrls.has(link)) {
                urlQueue.push({ url: link, depth: depth + 1 });
              }
            }
          }

          this.logger.debug(`Crawled ${url} (depth ${depth}), found ${discoveredUrls.size} URLs so far`);

        } finally {
          await page.close();
        }

      } catch (error) {
        this.logger.warn(`Failed to crawl ${url}: ${error.message}`);
        // Continue with other URLs
      }

      // Respect rate limiting
      await this.delay(100);
    }

    this.logger.log(`Crawl completed. Discovered ${discoveredUrls.size} URLs`);
    return Array.from(discoveredUrls);
  }

  private async extractLinks(page: Page, baseUrl: string): Promise<string[]> {
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      return anchors.map(anchor => (anchor as HTMLAnchorElement).href);
    });

    const parsedBaseUrl = new URL(baseUrl);
    const validLinks = [];

    for (const link of links) {
      try {
        const parsedLink = new URL(link);
        
        // Only include links from the same domain
        if (parsedLink.hostname === parsedBaseUrl.hostname) {
          validLinks.push(this.normalizeUrl(parsedLink.toString()));
        }
      } catch {
        // Invalid URL, skip
      }
    }

    return [...new Set(validLinks)]; // Remove duplicates
  }

  private shouldCrawlUrl(
    url: string,
    baseUrl: string,
    includePatterns?: string[],
    excludePatterns?: string[],
  ): boolean {
    try {
      const parsedUrl = new URL(url);
      const parsedBaseUrl = new URL(baseUrl);

      // Must be same domain
      if (parsedUrl.hostname !== parsedBaseUrl.hostname) {
        return false;
      }

      // Check exclude patterns first
      if (excludePatterns?.length) {
        for (const pattern of excludePatterns) {
          if (this.matchesPattern(url, pattern)) {
            return false;
          }
        }
      }

      // Check include patterns
      if (includePatterns?.length) {
        return includePatterns.some(pattern => this.matchesPattern(url, pattern));
      }

      // Default to include if no patterns specified
      return true;
    } catch {
      return false;
    }
  }

  private matchesPattern(url: string, pattern: string): boolean {
    try {
      const regex = new RegExp(pattern);
      return regex.test(url);
    } catch {
      // If pattern is not a valid regex, do a simple string match
      return url.includes(pattern);
    }
  }

  private normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Remove fragment
      parsed.hash = '';
      // Remove trailing slash from pathname (unless it's just "/")
      if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
        parsed.pathname = parsed.pathname.slice(0, -1);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}