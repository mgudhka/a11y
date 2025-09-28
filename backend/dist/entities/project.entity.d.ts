import { Organization } from './organization.entity';
import { User } from './user.entity';
import { ScanRun } from './scan-run.entity';
export declare enum ProjectStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
export declare class Project {
    id: string;
    name: string;
    slug: string;
    description?: string;
    status: ProjectStatus;
    configuration?: {
        scannerSettings?: Record<string, any>;
        thresholds?: {
            critical?: number;
            serious?: number;
            moderate?: number;
            minor?: number;
        };
        notifications?: {
            email?: boolean;
            webhook?: boolean;
        };
    };
    urls: string[];
    organizationId: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    organization: Organization;
    owner: User;
    scanRuns: ScanRun[];
}
