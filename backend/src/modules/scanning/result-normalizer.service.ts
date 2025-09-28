import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finding } from '../../entities/finding.entity';
import { FindingInstance } from '../../entities/finding-instance.entity';
import { Suppression, SuppressionStatus } from '../../entities/suppression.entity';
import { ImpactLevel } from '../../entities/finding.entity';

@Injectable()
export class ResultNormalizerService {
  private readonly logger = new Logger(ResultNormalizerService.name);

  constructor(
    @InjectRepository(Finding)
    private findingRepository: Repository<Finding>,
    @InjectRepository(FindingInstance)
    private findingInstanceRepository: Repository<FindingInstance>,
    @InjectRepository(Suppression)
    private suppressionRepository: Repository<Suppression>,
  ) {}

  async saveFindings(scanRunId: string, rawFindings: any[]): Promise<void> {
    this.logger.log(`Processing ${rawFindings.length} raw findings for scan run ${scanRunId}`);

    // Get active suppressions for filtering
    const activeSuppressions = await this.suppressionRepository.find({
      where: { status: SuppressionStatus.ACTIVE },
      relations: ['finding'],
    });

    // Group findings by rule ID and aggregate instances
    const findingGroups = new Map<string, any>();

    for (const rawFinding of rawFindings) {
      const key = `${rawFinding.ruleId}:${rawFinding.engine}`;
      
      if (!findingGroups.has(key)) {
        findingGroups.set(key, {
          ...rawFinding,
          instances: [],
          pageUrls: new Set<string>(),
        });
      }

      const group = findingGroups.get(key);
      group.instances.push(...rawFinding.instances);
      
      // Track unique pages
      rawFinding.instances.forEach(instance => {
        group.pageUrls.add(instance.canonicalUrl);
      });
    }

    // Process each finding group
    for (const [key, findingGroup] of findingGroups) {
      try {
        // Apply suppressions
        const filteredInstances = this.applySuppressions(findingGroup.instances, activeSuppressions);
        
        if (filteredInstances.length === 0) {
          this.logger.debug(`Finding ${findingGroup.ruleId} completely suppressed`);
          continue;
        }

        // Calculate priority score
        const priorityScore = this.calculatePriorityScore(findingGroup, filteredInstances);

        // Create finding entity
        const finding = this.findingRepository.create({
          scanRunId,
          ruleId: findingGroup.ruleId,
          ruleName: findingGroup.ruleName,
          description: findingGroup.description,
          helpText: findingGroup.helpText,
          helpUrl: findingGroup.helpUrl,
          impact: findingGroup.impact as ImpactLevel,
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

        // Create finding instances
        const instances = filteredInstances.map(instance =>
          this.findingInstanceRepository.create({
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
          })
        );

        await this.findingInstanceRepository.save(instances);

        this.logger.debug(`Saved finding ${savedFinding.id} with ${instances.length} instances`);

      } catch (error) {
        this.logger.error(`Failed to save finding group ${key}:`, error);
      }
    }

    this.logger.log(`Completed processing findings for scan run ${scanRunId}`);
  }

  private applySuppressions(instances: any[], suppressions: Suppression[]): any[] {
    if (suppressions.length === 0) {
      return instances;
    }

    return instances.filter(instance => {
      // Check if any suppression applies to this instance
      for (const suppression of suppressions) {
        if (suppression.matches(
          { ruleId: instance.ruleId } as Finding,
          instance.url,
          instance.elementSelector
        )) {
          return false; // Instance is suppressed
        }
      }
      return true; // Instance is not suppressed
    });
  }

  private calculatePriorityScore(finding: any, instances: any[]): number {
    // Five-factor priority scoring algorithm
    const factors = this.getScoringFactors(finding, instances);
    
    const score = (
      factors.impactWeight +
      factors.frequencyWeight +
      factors.userAffectWeight +
      factors.complianceWeight +
      factors.complexityWeight
    ) / 5;

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  private getScoringFactors(finding: any, instances: any[]): any {
    // Impact factor (0-100): Based on WCAG impact level
    const impactWeight = this.getImpactWeight(finding.impact);

    // Frequency factor (0-100): Based on number of instances across pages
    const frequencyWeight = Math.min(100, instances.length * 2);

    // User affect factor (0-100): Based on WCAG level and criteria
    const userAffectWeight = this.getUserAffectWeight(finding.wcagLevel, finding.wcagCriteria);

    // Compliance factor (0-100): Based on WCAG requirements
    const complianceWeight = this.getComplianceWeight(finding.wcagLevel);

    // Complexity factor (0-100): Based on rule complexity and remediation effort
    const complexityWeight = this.getComplexityWeight(finding.ruleId);

    return {
      impactWeight,
      frequencyWeight,
      userAffectWeight,
      complianceWeight,
      complexityWeight,
    };
  }

  private getImpactWeight(impact: string): number {
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

  private getUserAffectWeight(wcagLevel?: string, wcagCriteria?: string[]): number {
    let weight = 50; // Base weight

    // Boost for critical accessibility criteria
    if (wcagCriteria?.some(criteria => ['1.1', '1.3', '2.1', '2.4'].includes(criteria))) {
      weight += 20;
    }

    // Boost for higher WCAG levels
    if (wcagLevel === 'AA') weight += 15;
    if (wcagLevel === 'AAA') weight += 10;

    return Math.min(100, weight);
  }

  private getComplianceWeight(wcagLevel?: string): number {
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

  private getComplexityWeight(ruleId: string): number {
    // This would be based on a database of rule complexities
    // For now, using some common patterns
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
    } else if (lowComplexityRules.some(rule => ruleId.includes(rule))) {
      return 30;
    }

    return 50; // Default complexity
  }
}