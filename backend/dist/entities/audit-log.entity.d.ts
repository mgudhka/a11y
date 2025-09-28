import { Organization } from './organization.entity';
import { User } from './user.entity';
export declare enum AuditAction {
    USER_LOGIN = "user.login",
    USER_LOGOUT = "user.logout",
    USER_CREATE = "user.create",
    USER_UPDATE = "user.update",
    USER_DELETE = "user.delete",
    USER_PASSWORD_CHANGE = "user.password.change",
    ORG_CREATE = "organization.create",
    ORG_UPDATE = "organization.update",
    ORG_DELETE = "organization.delete",
    PROJECT_CREATE = "project.create",
    PROJECT_UPDATE = "project.update",
    PROJECT_DELETE = "project.delete",
    PROJECT_ARCHIVE = "project.archive",
    SCAN_START = "scan.start",
    SCAN_COMPLETE = "scan.complete",
    SCAN_CANCEL = "scan.cancel",
    SCAN_DELETE = "scan.delete",
    FINDING_STATUS_CHANGE = "finding.status.change",
    FINDING_ASSIGN = "finding.assign",
    FINDING_COMMENT = "finding.comment",
    WAIVER_REQUEST = "waiver.request",
    WAIVER_APPROVE = "waiver.approve",
    WAIVER_REJECT = "waiver.reject",
    WAIVER_EXPIRE = "waiver.expire",
    SUPPRESSION_CREATE = "suppression.create",
    SUPPRESSION_UPDATE = "suppression.update",
    SUPPRESSION_DELETE = "suppression.delete",
    SUPPRESSION_ACTIVATE = "suppression.activate",
    SUPPRESSION_DEACTIVATE = "suppression.deactivate",
    API_KEY_CREATE = "api_key.create",
    API_KEY_DELETE = "api_key.delete",
    WEBHOOK_CREATE = "webhook.create",
    WEBHOOK_UPDATE = "webhook.update",
    WEBHOOK_DELETE = "webhook.delete",
    SYSTEM_BACKUP = "system.backup",
    SYSTEM_RESTORE = "system.restore",
    SYSTEM_MAINTENANCE = "system.maintenance"
}
export declare enum AuditSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare class AuditLog {
    id: string;
    action: AuditAction;
    severity: AuditSeverity;
    description?: string;
    details?: {
        resourceType?: string;
        resourceId?: string;
        previousValues?: Record<string, any>;
        newValues?: Record<string, any>;
        metadata?: Record<string, any>;
    };
    ipAddress?: string;
    userAgent?: string;
    request?: {
        method?: string;
        url?: string;
        headers?: Record<string, string>;
        body?: any;
    };
    response?: {
        status?: number;
        headers?: Record<string, string>;
        body?: any;
    };
    organizationId: string;
    userId?: string;
    createdAt: Date;
    organization: Organization;
    user?: User;
    get isSensitive(): boolean;
    get isSecurityRelated(): boolean;
}
