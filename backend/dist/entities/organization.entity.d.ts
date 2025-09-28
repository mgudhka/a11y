import { Project } from './project.entity';
import { User } from './user.entity';
import { AuditLog } from './audit-log.entity';
export declare class Organization {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    description?: string;
    active: boolean;
    settings?: Record<string, any>;
    allowedDomains: string[];
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    projects: Project[];
    auditLogs: AuditLog[];
}
