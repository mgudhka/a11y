import { Page } from 'playwright';
export interface AlfaResult {
    url: string;
    findings: any[];
    timestamp: string;
}
export declare class AlfaEngine {
    analyze(page: Page): Promise<AlfaResult>;
    normalizeFindings(results: AlfaResult): any[];
    private mapImpact;
    private extractWcagCriteria;
    private extractWcagLevel;
    private generateFingerprint;
}
