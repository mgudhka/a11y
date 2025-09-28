import { ScanType } from '../../../entities/scan-run.entity';
export declare class CreateScanRunDto {
    type: ScanType;
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
    projectId: string;
}
