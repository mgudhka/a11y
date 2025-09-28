import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Artifact, ArtifactType } from '../../entities/artifact.entity';

@Injectable()
export class ArtifactsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    @InjectRepository(Artifact)
    private artifactRepository: Repository<Artifact>,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get('storage.bucket');
    this.s3Client = new S3Client({
      endpoint: this.configService.get('storage.endpoint'),
      region: this.configService.get('storage.region'),
      credentials: {
        accessKeyId: this.configService.get('storage.accessKey'),
        secretAccessKey: this.configService.get('storage.secretKey'),
      },
      forcePathStyle: this.configService.get('storage.forcePathStyle', true),
    });
  }

  async uploadArtifact(
    scanRunId: string,
    type: ArtifactType,
    data: Buffer,
    metadata: {
      name: string;
      mimeType: string;
      url: string;
      dimensions?: { width: number; height: number };
    }
  ): Promise<Artifact> {
    const storageKey = this.generateStorageKey(scanRunId, type, metadata.name);
    
    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
      Body: data,
      ContentType: metadata.mimeType,
    });

    await this.s3Client.send(uploadCommand);

    // Create artifact record
    const artifact = this.artifactRepository.create({
      scanRunId,
      type,
      name: metadata.name,
      mimeType: metadata.mimeType,
      size: data.length,
      url: metadata.url,
      storageKey,
      storageUrl: this.getPublicUrl(storageKey),
      metadata: {
        dimensions: metadata.dimensions,
        checksum: this.calculateChecksum(data),
      },
    });

    return this.artifactRepository.save(artifact);
  }

  private generateStorageKey(scanRunId: string, type: ArtifactType, name: string): string {
    const timestamp = new Date().getTime();
    const extension = name.split('.').pop() || 'bin';
    return `scans/${scanRunId}/${type}/${timestamp}_${name.replace(/[^a-zA-Z0-9.-]/g, '_')}.${extension}`;
  }

  private getPublicUrl(storageKey: string): string {
    const endpoint = this.configService.get('storage.endpoint');
    const bucket = this.bucketName;
    return `${endpoint}/${bucket}/${storageKey}`;
  }

  private calculateChecksum(data: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(data).digest('hex');
  }
}