"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxeEngine = void 0;
const common_1 = require("@nestjs/common");
let AxeEngine = class AxeEngine {
    async analyze(page) {
        await page.addScriptTag({
            path: require.resolve('axe-core'),
        });
        const results = await page.evaluate(() => {
            return new Promise((resolve) => {
                window.axe.run(document, {
                    reporter: 'v2',
                    runOnly: {
                        type: 'tag',
                        values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
                    },
                }, (err, results) => {
                    if (err)
                        throw err;
                    resolve(results);
                });
            });
        });
        return {
            url: page.url(),
            violations: results.violations,
            passes: results.passes,
            incomplete: results.incomplete,
            inapplicable: results.inapplicable,
            timestamp: results.timestamp,
        };
    }
    normalizeFindings(results) {
        const findings = [];
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
                    canonicalUrl: results.url,
                    elementSelector: node.target.join(', '),
                    elementHtml: node.html,
                    message: node.failureSummary,
                    data: node.any.concat(node.all, node.none),
                    relatedNodes: node.relatedNodes?.map((rn) => rn.target.join(', ')) || [],
                    fingerprint: this.generateFingerprint(results.url, violation.id, node.target.join(', ')),
                })),
            });
        }
        return findings;
    }
    mapImpact(impact) {
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
    extractWcagCriteria(tags) {
        return tags.filter(tag => /^wcag\d{3}$/.test(tag))
            .map(tag => tag.replace('wcag', '').replace(/(\d)(\d)/, '$1.$2'));
    }
    extractWcagLevel(tags) {
        if (tags.includes('wcag2aaa'))
            return 'AAA';
        if (tags.includes('wcag2aa') || tags.includes('wcag21aa') || tags.includes('wcag22aa'))
            return 'AA';
        if (tags.includes('wcag2a'))
            return 'A';
        return undefined;
    }
    generateFingerprint(url, ruleId, selector) {
        const input = `${url}:${ruleId}:${selector}`;
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
};
exports.AxeEngine = AxeEngine;
exports.AxeEngine = AxeEngine = __decorate([
    (0, common_1.Injectable)()
], AxeEngine);
//# sourceMappingURL=axe.engine.js.map