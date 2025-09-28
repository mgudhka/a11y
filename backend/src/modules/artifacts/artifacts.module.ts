import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artifact } from '../../entities/artifact.entity';
import { ArtifactsService } from './artifacts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Artifact])],
  providers: [ArtifactsService],
  exports: [ArtifactsService],
})
export class ArtifactsModule {}