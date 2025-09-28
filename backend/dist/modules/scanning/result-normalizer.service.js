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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ResultNormalizerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultNormalizerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const finding_entity_1 = require("../../entities/finding.entity");
const finding_instance_entity_1 = require("../../entities/finding-instance.entity");
const suppression_entity_1 = require("../../entities/suppression.entity");
let ResultNormalizerService = ResultNormalizerService_1 = class ResultNormalizerService {
    constructor(findingRepository, findingInstanceRepository, suppressionRepository) {
        this.findingRepository = findingRepository;
        this.findingInstanceRepository = findingInstanceRepository;
        this.suppressionRepository = suppressionRepository;
        this.logger = new common_1.Logger(ResultNormalizerService_1.name);
    }
    async saveFindings(scanRunId, rawFindings) {
        this.logger.log(`Processing ${rawFindings.length} raw findings for scan run ${scanRunId}`);
        const activeSuppressions = await this.suppressionRepository.find({
            where: { status: suppression_entity_1.SuppressionStatus.ACTIVE },
            relations: ['finding'],
        });
        const findingGroups = new Map();
        for (const rawFinding of rawFindings) {
            const key = `${rawFinding.ruleId}:${rawFinding.engine}`;
            if (!findingGroups.has(key)) {
                findingGroups.set(key, {
                    ...rawFinding,
                    instances: [],
                    pageUrls: new Set(),
                });
            }
            const group = findingGroups.get(key);
            group.instances.push(...rawFinding.instances);
            rawFinding.instances.forEach(instance => {
                group.pageUrls.add(instance.canonicalUrl);
            });
        }
        for (const [key, findingGroup] of findingGroups) {
            try {
                const filteredInstances = this.applySuppressions(findingGroup.instances, activeSuppressions);
                if (filteredInstances.length === 0) {
                    this.logger.debug(`Finding ${findingGroup.ruleId} completely suppressed`);
                    continue;
                }
                const priorityScore = this.calculatePriorityScore(findingGroup, filteredInstances);
                const finding = this.findingRepository.create({
                    scanRunId,
                    ruleId: findingGroup.ruleId,
                    ruleName: findingGroup.ruleName,
                    description: findingGroup.description,
                    helpText: findingGroup.helpText,
                    helpUrl: findingGroup.helpUrl,
                    impact: findingGroup.impact,
                    engine: findingGroup.engine,
                    wcagTags: findingGroup.wcagTags,
                    wcagCriteria: findingGroup.wcagCriteria,
                    wcagLevel: findingGroup.wcagLevel,
                    priorityScore,
                    instanceCount: filteredInstances.length,
                    pageCount: findingGroup.pageUrls.size,
                    scoringFactors: this.getScoringFactors(findingGroup, filteredInstances),
                });
                const savedFinding = await this.findingRepository.save(finding);
                const instances = filteredInstances.map(instance => this.findingInstanceRepository.create({
                    findingId: savedFinding.id,
                    url: instance.url,
                    canonicalUrl: instance.canonicalUrl,
                    pageTitle: instance.pageTitle,
                    elementSelector: instance.elementSelector,
                    elementHtml: instance.elementHtml,
                    elementText: instance.elementText,
                    elementBounds: instance.elementBounds,
                    message: instance.message,
                    data: instance.data,
                    relatedNodes: instance.relatedNodes,
                    environment: instance.environment,
                    fingerprint: instance.fingerprint,
                }));
                await this.findingInstanceRepository.save(instances);
                this.logger.debug(`Saved finding ${savedFinding.id} with ${instances.length} instances`);
            }
            catch (error) {
                this.logger.error(`Failed to save finding group ${key}:`, error);
            }
        }
        this.logger.log(`Completed processing findings for scan run ${scanRunId}`);
    }
    applySuppressions(instances, suppressions) {
        if (suppressions.length === 0) {
            return instances;
        }
        return instances.filter(instance => {
            for (const suppression of suppressions) {
                if (suppression.matches({ ruleId: instance.ruleId }, instance.url, instance.elementSelector)) {
                    return false;
                }
            }
            return true;
        });
    }
    calculatePriorityScore(finding, instances) {
        const factors = this.getScoringFactors(finding, instances);
        const score = (factors.impactWeight +
            factors.frequencyWeight +
            factors.userAffectWeight +
            factors.complianceWeight +
            factors.complexityWeight) / 5;
        return Math.round(score * 100) / 100;
    }
    getScoringFactors(finding, instances) {
        const impactWeight = this.getImpactWeight(finding.impact);
        const frequencyWeight = Math.min(100, instances.length * 2);
        const userAffectWeight = this.getUserAffectWeight(finding.wcagLevel, finding.wcagCriteria);
        const complianceWeight = this.getComplianceWeight(finding.wcagLevel);
        const complexityWeight = this.getComplexityWeight(finding.ruleId);
        return {
            impactWeight,
            frequencyWeight,
            userAffectWeight,
            complianceWeight,
            complexityWeight,
        };
    }
    getImpactWeight(impact) {
        switch (impact) {
            case 'critical':
                return 100;
            case 'serious':
                return 75;
            case 'moderate':
                return 50;
            case 'minor':
                return 25;
            default:
                return 0;
        }
    }
    getUserAffectWeight(wcagLevel, wcagCriteria) {
        let weight = 50;
        if (wcagCriteria?.some(criteria => ['1.1', '1.3', '2.1', '2.4'].includes(criteria))) {
            weight += 20;
        }
        if (wcagLevel === 'AA')
            weight += 15;
        if (wcagLevel === 'AAA')
            weight += 10;
        return Math.min(100, weight);
    }
    getComplianceWeight(wcagLevel) {
        switch (wcagLevel) {
            case 'A':
                return 80;
            case 'AA':
                return 100;
            case 'AAA':
                return 90;
            default:
                return 60;
        }
    }
    getComplexityWeight(ruleId) {
        const highComplexityRules = [
            'color-contrast',
            'focus-order-semantics',
            'keyboard',
            'aria-valid-attr-value',
        ];
        const lowComplexityRules = [
            'html-has-lang',
            'image-alt',
            'label',
            'link-name',
        ];
        if (highComplexityRules.some(rule => ruleId.includes(rule))) {
            return 80;
        }
        else if (lowComplexityRules.some(rule => ruleId.includes(rule))) {
            return 30;
        }
        return 50;
    }
};
exports.ResultNormalizerService = ResultNormalizerService;
exports.ResultNormalizerService = ResultNormalizerService = ResultNormalizerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(finding_entity_1.Finding)),
    __param(1, (0, typeorm_1.InjectRepository)(finding_instance_entity_1.FindingInstance)),
    __param(2, (0, typeorm_1.InjectRepository)(suppression_entity_1.Suppression)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ResultNormalizerService);
//# sourceMappingURL=result-normalizer.service.js.map