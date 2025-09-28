import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Finding } from './finding.entity';
import { Artifact } from './artifact.entity';

export enum ScanType {
  WEB_CRAWL = 'web_crawl',
  WEB_URLS = 'web_urls',
  API = 'api',
  MOBILE = 'mobile',
}

export enum ScanStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('scan_runs')
export class ScanRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ScanType })
  type: ScanType;

  @Column({ type: 'enum', enum: ScanStatus, default: ScanStatus.QUEUED })
  status: ScanStatus;

  @Column({ type: 'json' })
  configuration: {
    urls?: string[];
    crawlDepth?: number;
    includePatterns?: string[];
    excludePatterns?: string[];
    engines?: ('axe' | 'alfa')[];
    viewport?: { width: number; height: number };
    userAgent?: string;
  };

  @Column({ type: 'json', nullable: true })
  metadata?: {
    triggeredBy?: string;
    branch?: string;
    commit?: string;
    buildNumber?: string;
    environment?: string;
  };

  @Column({ nullable: true })
  startedAt?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'json', nullable: true })
  summary?: {
    totalPages: number;
    totalFindings: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    passed: number;
    inapplicable: number;
  };

  @Column('uuid')
  projectId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Project, (project) => project.scanRuns)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToMany(() => Finding, (finding) => finding.scanRun)
  findings: Finding[];

  @OneToMany(() => Artifact, (artifact) => artifact.scanRun)
  artifacts: Artifact[];

  // Computed properties
  get duration(): number | null {
    if (!this.startedAt || !this.completedAt) return null;
    return this.completedAt.getTime() - this.startedAt.getTime();
  }

  get isComplete(): boolean {
    return [ScanStatus.COMPLETED, ScanStatus.FAILED, ScanStatus.CANCELLED].includes(this.status);
  }
}