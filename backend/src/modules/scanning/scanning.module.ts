import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScanRun } from '../../entities/scan-run.entity';
import { Finding } from '../../entities/finding.entity';
import { FindingInstance } from '../../entities/finding-instance.entity';
import { Artifact } from '../../entities/artifact.entity';
import { ScanningService } from './scanning.service';
import { ScanningController } from './scanning.controller';
import { ScanProcessor } from './scan.processor';
import { AxeEngine } from './engines/axe.engine';
import { AlfaEngine } from './engines/alfa.engine';
import { CrawlerService } from './crawler.service';
import { ResultNormalizerService } from './result-normalizer.service';
import { ArtifactsModule } from '../artifacts/artifacts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScanRun, Finding, FindingInstance, Artifact]),
    BullModule.registerQueue({
      name: 'scanning',
    }),
    ArtifactsModule,
  ],
  providers: [
    ScanningService,
    ScanProcessor,
    AxeEngine,
    AlfaEngine,
    CrawlerService,
    ResultNormalizerService,
  ],
  controllers: [ScanningController],
  exports: [ScanningService],
})
export class ScanningModule {}