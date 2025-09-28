import { ScanRun } from './scan-run.entity';
export declare enum ArtifactType {
    SCREENSHOT = "screenshot",
    PAGE_SOURCE = "page_source",
    HAR_FILE = "har_file",
    SCAN_REPORT = "scan_report",
    ACCESSIBILITY_TREE = "accessibility_tree",
    PERFORMANCE_METRICS = "performance_metrics"
}
export declare class Artifact {
    id: string;
    name: string;
    type: ArtifactType;
    mimeType: string;
    size: number;
    url: string;
    storageKey: string;
    storageUrl: string;
    metadata?: {
        dimensions?: {
            width: number;
            height: number;
        };
        duration?: number;
        compression?: string;
        encoding?: string;
        checksum?: string;
    };
    scanRunId: string;
    createdAt: Date;
    updatedAt: Date;
    scanRun: ScanRun;
}
