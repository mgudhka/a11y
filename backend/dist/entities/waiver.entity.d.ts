import { Finding } from './finding.entity';
import { User } from './user.entity';
export declare enum WaiverStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export declare enum WaiverReason {
    BUSINESS_EXCEPTION = "business_exception",
    TECHNICAL_LIMITATION = "technical_limitation",
    TEMPORARY_ISSUE = "temporary_issue",
    FALSE_POSITIVE = "false_positive",
    ACCEPTABLE_RISK = "acceptable_risk"
}
export declare class Waiver {
    id: string;
    reason: WaiverReason;
    justification: string;
    status: WaiverStatus;
    expiresAt?: Date;
    approverNotes?: string;
    approvedAt?: Date;
    conditions?: {
        urlPatterns?: string[];
        elementSelectors?: string[];
        timeframe?: {
            start: Date;
            end: Date;
        };
    };
    findingId: string;
    requestedById: string;
    approvedById?: string;
    createdAt: Date;
    updatedAt: Date;
    finding: Finding;
    requestedBy: User;
    approvedBy?: User;
    get isActive(): boolean;
    get isExpired(): boolean;
}
