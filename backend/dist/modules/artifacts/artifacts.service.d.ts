import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Artifact, ArtifactType } from '../../entities/artifact.entity';
export declare class ArtifactsService {
    private artifactRepository;
    private configService;
    private s3Client;
    private bucketName;
    constructor(artifactRepository: Repository<Artifact>, configService: ConfigService);
    uploadArtifact(scanRunId: string, type: ArtifactType, data: Buffer, metadata: {
        name: string;
        mimeType: string;
        url: string;
        dimensions?: {
            width: number;
            height: number;
        };
    }): Promise<Artifact>;
    private generateStorageKey;
    private getPublicUrl;
    private calculateChecksum;
}
