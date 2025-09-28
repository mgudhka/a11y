import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ScanningService } from './scanning.service';
import { CrawlerService } from './crawler.service';
import { AxeEngine } from './engines/axe.engine';
import { AlfaEngine } from './engines/alfa.engine';
import { ResultNormalizerService } from './result-normalizer.service';
import { ScanStatus, ScanType } from '../../entities/scan-run.entity';

@Processor('scanning')
@Injectable()
export class ScanProcessor {
  private readonly logger = new Logger(ScanProcessor.name);

  constructor(
    private readonly scanningService: ScanningService,
    private readonly crawlerService: CrawlerService,
    private readonly axeEngine: AxeEngine,
    private readonly alfaEngine: AlfaEngine,
    private readonly resultNormalizer: ResultNormalizerService,
  ) {}

  @Process('process-scan')
  async processScan(job: Job<{ scanRunId: string }>) {
    const { scanRunId } = job.data;
    this.logger.log(`Processing scan run: ${scanRunId}`);

    try {
      // Update status to running
      await this.scanningService.updateStatus(scanRunId, ScanStatus.RUNNING);

      // Get scan run details
      const scanRun = await this.scanningService.findOne(scanRunId);
      if (!scanRun) {
        throw new Error(`Scan run ${scanRunId} not found`);
      }

      let urlsToScan: string[] = [];

      // Determine URLs to scan based on scan type
      if (scanRun.type === ScanType.WEB_CRAWL) {
        // Crawl to discover URLs
        const baseUrls = scanRun.configuration.urls || [];
        for (const baseUrl of baseUrls) {
          const crawledUrls = await this.crawlerService.crawl(
            baseUrl,
            scanRun.configuration.crawlDepth || 3,
            scanRun.configuration.includePatterns,
            scanRun.configuration.excludePatterns,
          );
          urlsToScan.push(...crawledUrls);
        }
      } else if (scanRun.type === ScanType.WEB_URLS) {
        // Use provided URLs directly
        urlsToScan = scanRun.configuration.urls || [];
      }

      // Remove duplicates and canonicalize URLs
      urlsToScan = [...new Set(urlsToScan.map(url => this.canonicalizeUrl(url)))];

      this.logger.log(`Scanning ${urlsToScan.length} URLs for scan run: ${scanRunId}`);

      const allFindings = [];
      const engines = scanRun.configuration.engines || ['axe'];

      // Scan each URL
      for (let i = 0; i < urlsToScan.length; i++) {
        const url = urlsToScan[i];
        
        try {
          // Update progress
          job.progress(Math.round((i / urlsToScan.length) * 100));

          const pageFindings = await this.scanUrl(url, engines, scanRun.configuration);
          allFindings.push(...pageFindings);

          this.logger.log(`Scanned ${url}: found ${pageFindings.length} findings`);
        } catch (error) {
          this.logger.error(`Failed to scan ${url}:`, error);
          // Continue with other URLs
        }
      }

      // Normalize and save findings
      await this.resultNormalizer.saveFindings(scanRunId, allFindings);

      // Calculate summary
      const summary = this.calculateSummary(allFindings, urlsToScan.length);
      await this.scanningService.updateSummary(scanRunId, summary);

      // Update status to completed
      await this.scanningService.updateStatus(scanRunId, ScanStatus.COMPLETED);

      this.logger.log(`Completed scan run: ${scanRunId} with ${allFindings.length} findings`);

    } catch (error) {
      this.logger.error(`Failed to process scan run ${scanRunId}:`, error);
      await this.scanningService.updateStatus(scanRunId, ScanStatus.FAILED, error.message);
      throw error;
    }
  }

  private async scanUrl(url: string, engines: string[], config: any) {
    const findings = [];

    // Use the crawler service to get a page instance
    const page = await this.crawlerService.createPage(config.viewport, config.userAgent);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });

      // Run each engine
      for (const engineName of engines) {
        if (engineName === 'axe') {
          const axeResults = await this.axeEngine.analyze(page);
          const normalizedFindings = this.axeEngine.normalizeFindings(axeResults);
          findings.push(...normalizedFindings);
        } else if (engineName === 'alfa') {
          const alfaResults = await this.alfaEngine.analyze(page);
          const normalizedFindings = this.alfaEngine.normalizeFindings(alfaResults);
          findings.push(...normalizedFindings);
        }
      }

      return findings;
    } finally {
      await page.close();
    }
  }

  private canonicalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Remove fragment and normalize
      parsed.hash = '';
      // Sort query parameters
      const searchParams = new URLSearchParams(parsed.search);
      const sortedParams = new URLSearchParams();
      Array.from(searchParams.keys()).sort().forEach(key => {
        sortedParams.set(key, searchParams.get(key));
      });
      parsed.search = sortedParams.toString();
      return parsed.toString();
    } catch {
      return url;
    }
  }

  private calculateSummary(findings: any[], pageCount: number) {
    const summary = {
      totalPages: pageCount,
      totalFindings: findings.length,
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      passed: 0, // This would come from passes in axe results
      inapplicable: 0, // This would come from inapplicable in axe results
    };

    findings.forEach(finding => {
      const instanceCount = finding.instances?.length || 0;
      switch (finding.impact) {
        case 'critical':
          summary.critical += instanceCount;
          break;
        case 'serious':
          summary.serious += instanceCount;
          break;
        case 'moderate':
          summary.moderate += instanceCount;
          break;
        case 'minor':
          summary.minor += instanceCount;
          break;
      }
    });

    return summary;
  }
}