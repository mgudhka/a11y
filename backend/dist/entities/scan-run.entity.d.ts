import { Project } from './project.entity';
import { Finding } from './finding.entity';
import { Artifact } from './artifact.entity';
export declare enum ScanType {
    WEB_CRAWL = "web_crawl",
    WEB_URLS = "web_urls",
    API = "api",
    MOBILE = "mobile"
}
export declare enum ScanStatus {
    QUEUED = "queued",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class ScanRun {
    id: string;
    type: ScanType;
    status: ScanStatus;
    configuration: {
        urls?: string[];
        crawlDepth?: number;
        includePatterns?: string[];
        excludePatterns?: string[];
        engines?: ('axe' | 'alfa')[];
        viewport?: {
            width: number;
            height: number;
        };
        userAgent?: string;
    };
    metadata?: {
        triggeredBy?: string;
        branch?: string;
        commit?: string;
        buildNumber?: string;
        environment?: string;
    };
    startedAt?: Date;
    completedAt?: Date;
    errorMessage?: string;
    summary?: {
        totalPages: number;
        totalFindings: number;
        critical: number;
        serious: number;
        moderate: number;
        minor: number;
        passed: number;
        inapplicable: number;
    };
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
    project: Project;
    findings: Finding[];
    artifacts: Artifact[];
    get duration(): number | null;
    get isComplete(): boolean;
}
