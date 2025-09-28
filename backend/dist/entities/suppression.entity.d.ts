import { Finding } from './finding.entity';
import { User } from './user.entity';
export declare enum SuppressionType {
    RULE_BASED = "rule_based",
    URL_BASED = "url_based",
    ELEMENT_BASED = "element_based",
    GLOBAL = "global"
}
export declare enum SuppressionStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    EXPIRED = "expired"
}
export declare class Suppression {
    id: string;
    name: string;
    description?: string;
    type: SuppressionType;
    status: SuppressionStatus;
    conditions: {
        ruleIds?: string[];
        urlPatterns?: string[];
        elementSelectors?: string[];
        impact?: string[];
        wcagCriteria?: string[];
    };
    expiresAt?: Date;
    reason?: string;
    findingId?: string;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    finding?: Finding;
    createdBy: User;
    get isActive(): boolean;
    get isExpired(): boolean;
    matches(finding: Finding, url?: string, selector?: string): boolean;
}
