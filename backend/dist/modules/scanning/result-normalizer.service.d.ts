import { Repository } from 'typeorm';
import { Finding } from '../../entities/finding.entity';
import { FindingInstance } from '../../entities/finding-instance.entity';
import { Suppression } from '../../entities/suppression.entity';
export declare class ResultNormalizerService {
    private findingRepository;
    private findingInstanceRepository;
    private suppressionRepository;
    private readonly logger;
    constructor(findingRepository: Repository<Finding>, findingInstanceRepository: Repository<FindingInstance>, suppressionRepository: Repository<Suppression>);
    saveFindings(scanRunId: string, rawFindings: any[]): Promise<void>;
    private applySuppressions;
    private calculatePriorityScore;
    private getScoringFactors;
    private getImpactWeight;
    private getUserAffectWeight;
    private getComplianceWeight;
    private getComplexityWeight;
}
