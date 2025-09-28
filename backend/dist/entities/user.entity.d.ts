import { Organization } from './organization.entity';
import { Project } from './project.entity';
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ORG_ADMIN = "org_admin",
    MANAGER = "manager",
    DEVELOPER = "developer",
    VIEWER = "viewer"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    preferences?: Record<string, any>;
    emailVerified: boolean;
    lastLoginAt?: Date;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    organization: Organization;
    ownedProjects: Project[];
    get fullName(): string;
    get isAdmin(): boolean;
}
