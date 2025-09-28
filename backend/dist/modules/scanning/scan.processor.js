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
var ScanProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const scanning_service_1 = require("./scanning.service");
const crawler_service_1 = require("./crawler.service");
const axe_engine_1 = require("./engines/axe.engine");
const alfa_engine_1 = require("./engines/alfa.engine");
const result_normalizer_service_1 = require("./result-normalizer.service");
const scan_run_entity_1 = require("../../entities/scan-run.entity");
let ScanProcessor = ScanProcessor_1 = class ScanProcessor {
    constructor(scanningService, crawlerService, axeEngine, alfaEngine, resultNormalizer) {
        this.scanningService = scanningService;
        this.crawlerService = crawlerService;
        this.axeEngine = axeEngine;
        this.alfaEngine = alfaEngine;
        this.resultNormalizer = resultNormalizer;
        this.logger = new common_1.Logger(ScanProcessor_1.name);
    }
    async processScan(job) {
        const { scanRunId } = job.data;
        this.logger.log(`Processing scan run: ${scanRunId}`);
        try {
            await this.scanningService.updateStatus(scanRunId, scan_run_entity_1.ScanStatus.RUNNING);
            const scanRun = await this.scanningService.findOne(scanRunId);
            if (!scanRun) {
                throw new Error(`Scan run ${scanRunId} not found`);
            }
            let urlsToScan = [];
            if (scanRun.type === scan_run_entity_1.ScanType.WEB_CRAWL) {
                const baseUrls = scanRun.configuration.urls || [];
                for (const baseUrl of baseUrls) {
                    const crawledUrls = await this.crawlerService.crawl(baseUrl, scanRun.configuration.crawlDepth || 3, scanRun.configuration.includePatterns, scanRun.configuration.excludePatterns);
                    urlsToScan.push(...crawledUrls);
                }
            }
            else if (scanRun.type === scan_run_entity_1.ScanType.WEB_URLS) {
                urlsToScan = scanRun.configuration.urls || [];
            }
            urlsToScan = [...new Set(urlsToScan.map(url => this.canonicalizeUrl(url)))];
            this.logger.log(`Scanning ${urlsToScan.length} URLs for scan run: ${scanRunId}`);
            const allFindings = [];
            const engines = scanRun.configuration.engines || ['axe'];
            for (let i = 0; i < urlsToScan.length; i++) {
                const url = urlsToScan[i];
                try {
                    job.progress(Math.round((i / urlsToScan.length) * 100));
                    const pageFindings = await this.scanUrl(url, engines, scanRun.configuration);
                    allFindings.push(...pageFindings);
                    this.logger.log(`Scanned ${url}: found ${pageFindings.length} findings`);
                }
                catch (error) {
                    this.logger.error(`Failed to scan ${url}:`, error);
                }
            }
            await this.resultNormalizer.saveFindings(scanRunId, allFindings);
            const summary = this.calculateSummary(allFindings, urlsToScan.length);
            await this.scanningService.updateSummary(scanRunId, summary);
            await this.scanningService.updateStatus(scanRunId, scan_run_entity_1.ScanStatus.COMPLETED);
            this.logger.log(`Completed scan run: ${scanRunId} with ${allFindings.length} findings`);
        }
        catch (error) {
            this.logger.error(`Failed to process scan run ${scanRunId}:`, error);
            await this.scanningService.updateStatus(scanRunId, scan_run_entity_1.ScanStatus.FAILED, error.message);
            throw error;
        }
    }
    async scanUrl(url, engines, config) {
        const findings = [];
        const page = await this.crawlerService.createPage(config.viewport, config.userAgent);
        try {
            await page.goto(url, { waitUntil: 'networkidle' });
            for (const engineName of engines) {
                if (engineName === 'axe') {
                    const axeResults = await this.axeEngine.analyze(page);
                    const normalizedFindings = this.axeEngine.normalizeFindings(axeResults);
                    findings.push(...normalizedFindings);
                }
                else if (engineName === 'alfa') {
                    const alfaResults = await this.alfaEngine.analyze(page);
                    const normalizedFindings = this.alfaEngine.normalizeFindings(alfaResults);
                    findings.push(...normalizedFindings);
                }
            }
            return findings;
        }
        finally {
            await page.close();
        }
    }
    canonicalizeUrl(url) {
        try {
            const parsed = new URL(url);
            parsed.hash = '';
            const searchParams = new URLSearchParams(parsed.search);
            const sortedParams = new URLSearchParams();
            Array.from(searchParams.keys()).sort().forEach(key => {
                sortedParams.set(key, searchParams.get(key));
            });
            parsed.search = sortedParams.toString();
            return parsed.toString();
        }
        catch {
            return url;
        }
    }
    calculateSummary(findings, pageCount) {
        const summary = {
            totalPages: pageCount,
            totalFindings: findings.length,
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0,
            passed: 0,
            inapplicable: 0,
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
};
exports.ScanProcessor = ScanProcessor;
__decorate([
    (0, bull_1.Process)('process-scan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScanProcessor.prototype, "processScan", null);
exports.ScanProcessor = ScanProcessor = ScanProcessor_1 = __decorate([
    (0, bull_1.Processor)('scanning'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scanning_service_1.ScanningService,
        crawler_service_1.CrawlerService,
        axe_engine_1.AxeEngine,
        alfa_engine_1.AlfaEngine,
        result_normalizer_service_1.ResultNormalizerService])
], ScanProcessor);
//# sourceMappingURL=scan.processor.js.map