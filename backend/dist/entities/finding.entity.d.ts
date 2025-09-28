import { ScanRun } from './scan-run.entity';
import { FindingInstance } from './finding-instance.entity';
import { Waiver } from './waiver.entity';
import { Suppression } from './suppression.entity';
export declare enum ImpactLevel {
    CRITICAL = "critical",
    SERIOUS = "serious",
    MODERATE = "moderate",
    MINOR = "minor"
}
export declare enum FindingStatus {
    NEW = "new",
    ACKNOWLEDGED = "acknowledged",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    WONT_FIX = "wont_fix",
    FALSE_POSITIVE = "false_positive",
    WAIVED = "waived",
    SUPPRESSED = "suppressed"
}
export declare class Finding {
    id: string;
    ruleId: string;
    ruleName: string;
    description: string;
    helpText?: string;
    helpUrl?: string;
    impact: ImpactLevel;
    status: FindingStatus;
    wcagTags: string[];
    wcagCriteria: string[];
    wcagLevel?: string;
    engine: string;
    priorityScore: number;
    scoringFactors?: {
        impactWeight: number;
        frequencyWeight: number;
        userAffectWeight: number;
        complianceWeight: number;
        complexityWeight: number;
    };
    instanceCount: number;
    pageCount: number;
    scanRunId: string;
    createdAt: Date;
    updatedAt: Date;
    scanRun: ScanRun;
    instances: FindingInstance[];
    waivers: Waiver[];
    suppressions: Suppression[];
    get isBlocked(): boolean;
    get isResolved(): boolean;
}
