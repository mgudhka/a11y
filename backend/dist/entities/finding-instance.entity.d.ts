import { Finding } from './finding.entity';
export declare class FindingInstance {
    id: string;
    url: string;
    canonicalUrl: string;
    pageTitle?: string;
    elementSelector?: string;
    elementHtml?: string;
    elementText?: string;
    elementBounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    message?: string;
    data?: any;
    relatedNodes: string[];
    environment?: {
        userAgent?: string;
        viewportSize?: {
            width: number;
            height: number;
        };
        colorScheme?: string;
    };
    fingerprint: string;
    findingId: string;
    createdAt: Date;
    finding: Finding;
}
