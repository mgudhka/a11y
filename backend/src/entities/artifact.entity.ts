import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScanRun } from './scan-run.entity';

export enum ArtifactType {
  SCREENSHOT = 'screenshot',
  PAGE_SOURCE = 'page_source',
  HAR_FILE = 'har_file',
  SCAN_REPORT = 'scan_report',
  ACCESSIBILITY_TREE = 'accessibility_tree',
  PERFORMANCE_METRICS = 'performance_metrics',
}

@Entity('artifacts')
export class Artifact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ArtifactType })
  type: ArtifactType;

  @Column()
  mimeType: string;

  @Column()
  size: number; // in bytes

  @Column()
  url: string; // URL where artifact was captured

  @Column()
  storageKey: string; // S3 key or file path

  @Column()
  storageUrl: string; // Public URL for accessing the artifact

  @Column({ type: 'json', nullable: true })
  metadata?: {
    dimensions?: { width: number; height: number };
    duration?: number;
    compression?: string;
    encoding?: string;
    checksum?: string;
  };

  @Column('uuid')
  scanRunId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ScanRun, (scanRun) => scanRun.artifacts)
  @JoinColumn({ name: 'scanRunId' })
  scanRun: ScanRun;
}