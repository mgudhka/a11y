import { IsEnum, IsString, IsOptional, IsObject, IsArray, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScanType } from '../../../entities/scan-run.entity';

export class CreateScanRunDto {
  @ApiProperty({ enum: ScanType, description: 'Type of scan to perform' })
  @IsEnum(ScanType)
  type: ScanType;

  @ApiProperty({ description: 'Scan configuration' })
  @IsObject()
  configuration: {
    urls?: string[];
    crawlDepth?: number;
    includePatterns?: string[];
    excludePatterns?: string[];
    engines?: ('axe' | 'alfa')[];
    viewport?: { width: number; height: number };
    userAgent?: string;
  };

  @ApiProperty({ description: 'Scan metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: {
    triggeredBy?: string;
    branch?: string;
    commit?: string;
    buildNumber?: string;
    environment?: string;
  };

  @ApiProperty({ description: 'Project ID' })
  @IsUUID()
  projectId: string;
}