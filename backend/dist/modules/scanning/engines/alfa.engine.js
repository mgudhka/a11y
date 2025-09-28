"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlfaEngine = void 0;
const common_1 = require("@nestjs/common");
let AlfaEngine = class AlfaEngine {
    async analyze(page) {
        const results = {
            url: page.url(),
            findings: [],
            timestamp: new Date().toISOString(),
        };
        return results;
    }
    normalizeFindings(results) {
        const findings = [];
        for (const finding of results.findings) {
            findings.push({
                ruleId: finding.rule?.id || 'unknown',
                ruleName: finding.rule?.name || 'Unknown Rule',
                description: finding.message || '',
                helpText: finding.rule?.description,
                helpUrl: finding.rule?.url,
                impact: this.mapImpact(finding.impact),
                engine: 'alfa',
                wcagTags: finding.rule?.tags?.filter((tag) => tag.includes('wcag')) || [],
                wcagCriteria: this.extractWcagCriteria(finding.rule?.tags || []),
                wcagLevel: this.extractWcagLevel(finding.rule?.tags || []),
                instances: finding.instances?.map((instance) => ({
                    url: results.url,
                    canonicalUrl: results.url,
                    elementSelector: instance.selector,
                    elementHtml: instance.html,
                    message: instance.message,
                    data: instance.data,
                    relatedNodes: instance.relatedNodes || [],
                    fingerprint: this.generateFingerprint(results.url, finding.rule?.id || 'unknown', instance.selector),
                })) || [],
            });
        }
        return findings;
    }
    mapImpact(impact) {
        switch (impact?.toLowerCase()) {
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
        return tags.filter(tag => /wcag\d+/.test(tag))
            .map(tag => tag.replace(/wcag(\d)(\d)/, '$1.$2'));
    }
    extractWcagLevel(tags) {
        if (tags.some(tag => tag.includes('aaa')))
            return 'AAA';
        if (tags.some(tag => tag.includes('aa')))
            return 'AA';
        if (tags.some(tag => tag.includes('a')))
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
exports.AlfaEngine = AlfaEngine;
exports.AlfaEngine = AlfaEngine = __decorate([
    (0, common_1.Injectable)()
], AlfaEngine);
//# sourceMappingURL=alfa.engine.js.map