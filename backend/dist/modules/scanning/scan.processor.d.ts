import { Job } from 'bull';
import { ScanningService } from './scanning.service';
import { CrawlerService } from './crawler.service';
import { AxeEngine } from './engines/axe.engine';
import { AlfaEngine } from './engines/alfa.engine';
import { ResultNormalizerService } from './result-normalizer.service';
export declare class ScanProcessor {
    private readonly scanningService;
    private readonly crawlerService;
    private readonly axeEngine;
    private readonly alfaEngine;
    private readonly resultNormalizer;
    private readonly logger;
    constructor(scanningService: ScanningService, crawlerService: CrawlerService, axeEngine: AxeEngine, alfaEngine: AlfaEngine, resultNormalizer: ResultNormalizerService);
    processScan(job: Job<{
        scanRunId: string;
    }>): Promise<void>;
    private scanUrl;
    private canonicalizeUrl;
    private calculateSummary;
}
