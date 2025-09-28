import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AxeEngine {
  async analyze(page: Page): Promise<AxeResult> {
    // Inject axe-core into the page
    await page.addScriptTag({
      path: require.resolve('axe-core'),
    });

    // Run axe analysis
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        (window as any).axe.run(
          document,
          {
            reporter: 'v2',
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
            },
          },
          (err: any, results: axeCore.AxeResults) => {
            if (err) throw err;
            resolve(results);
          }
        );
      });
    }) as axeCore.AxeResults;

    return {
      url: page.url(),
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      inapplicable: results.inapplicable,
      timestamp: results.timestamp,
    };
  }

  normalizeFindings(results: AxeResult): any[] {
    const findings = [];

    // Process violations
    for (const violation of results.violations) {
      findings.push({
        ruleId: violation.id,
        ruleName: violation.help,
        description: violation.description,
        helpText: violation.help,
        helpUrl: violation.helpUrl,
        impact: this.mapImpact(violation.impact),
        engine: 'axe',
        wcagTags: violation.tags.filter(tag => tag.includes('wcag')),
        wcagCriteria: this.extractWcagCriteria(violation.tags),
        wcagLevel: this.extractWcagLevel(violation.tags),
        instances: violation.nodes.map(node => ({
          url: results.url,
          canonicalUrl: results.url, // TODO: implement URL canonicalization
          elementSelector: node.target.join(', '),
          elementHtml: node.html,
          message: node.failureSummary,
          data: node.any.concat(node.all, node.none),
          relatedNodes: (node as any).relatedNodes?.map((rn: any) => rn.target.join(', ')) || [],
          fingerprint: this.generateFingerprint(results.url, violation.id, node.target.join(', ')),
        })),
      });
    }

    return findings;
  }

  private mapImpact(impact?: string): string {
    switch (impact) {
      case 'critical':
        return 'critical';
      case 'serious':
        return 'serious';
      case 'moderate':
        return 'moderate';
      case 'minor':
        return 'minor';
      default:
        return 'minor';
    }
  }

  private extractWcagCriteria(tags: string[]): string[] {
    return tags.filter(tag => /^wcag\d{3}$/.test(tag))
             .map(tag => tag.replace('wcag', '').replace(/(\d)(\d)/, '$1.$2'));
  }

  private extractWcagLevel(tags: string[]): string | undefined {
    if (tags.includes('wcag2aaa')) return 'AAA';
    if (tags.includes('wcag2aa') || tags.includes('wcag21aa') || tags.includes('wcag22aa')) return 'AA';
    if (tags.includes('wcag2a')) return 'A';
    return undefined;
  }

  private generateFingerprint(url: string, ruleId: string, selector: string): string {
    const input = `${url}:${ruleId}:${selector}`;
    // Simple hash function - in production, use crypto.createHash
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}