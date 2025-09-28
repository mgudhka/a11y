import { Page } from 'playwright';
import * as axeCore from 'axe-core';
export interface AxeResult {
    url: string;
    violations: axeCore.Result[];
    passes: axeCore.Result[];
    incomplete: axeCore.Result[];
    inapplicable: axeCore.Result[];
    timestamp: string;
}
export declare class AxeEngine {
    analyze(page: Page): Promise<AxeResult>;
    normalizeFindings(results: AxeResult): any[];
    private mapImpact;
    private extractWcagCriteria;
    private extractWcagLevel;
    private generateFingerprint;
}
