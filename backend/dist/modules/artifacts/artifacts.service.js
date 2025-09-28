"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const artifact_entity_1 = require("../../entities/artifact.entity");
let ArtifactsService = class ArtifactsService {
    constructor(artifactRepository, configService) {
        this.artifactRepository = artifactRepository;
        this.configService = configService;
        this.bucketName = this.configService.get('storage.bucket');
        this.s3Client = new client_s3_1.S3Client({
            endpoint: this.configService.get('storage.endpoint'),
            region: this.configService.get('storage.region'),
            credentials: {
                accessKeyId: this.configService.get('storage.accessKey'),
                secretAccessKey: this.configService.get('storage.secretKey'),
            },
            forcePathStyle: this.configService.get('storage.forcePathStyle', true),
        });
    }
    async uploadArtifact(scanRunId, type, data, metadata) {
        const storageKey = this.generateStorageKey(scanRunId, type, metadata.name);
        const uploadCommand = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: storageKey,
            Body: data,
            ContentType: metadata.mimeType,
        });
        await this.s3Client.send(uploadCommand);
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
    generateStorageKey(scanRunId, type, name) {
        const timestamp = new Date().getTime();
        const extension = name.split('.').pop() || 'bin';
        return `scans/${scanRunId}/${type}/${timestamp}_${name.replace(/[^a-zA-Z0-9.-]/g, '_')}.${extension}`;
    }
    getPublicUrl(storageKey) {
        const endpoint = this.configService.get('storage.endpoint');
        const bucket = this.bucketName;
        return `${endpoint}/${bucket}/${storageKey}`;
    }
    calculateChecksum(data) {
        const crypto = require('crypto');
        return crypto.createHash('md5').update(data).digest('hex');
    }
};
exports.ArtifactsService = ArtifactsService;
exports.ArtifactsService = ArtifactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(artifact_entity_1.Artifact)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], ArtifactsService);
//# sourceMappingURL=artifacts.service.js.map