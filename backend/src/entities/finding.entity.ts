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
import { ScanRun } from './scan-run.entity';
import { FindingInstance } from './finding-instance.entity';
import { Waiver } from './waiver.entity';
import { Suppression } from './suppression.entity';

export enum ImpactLevel {
  CRITICAL = 'critical',
  SERIOUS = 'serious',
  MODERATE = 'moderate',
  MINOR = 'minor',
}

export enum FindingStatus {
  NEW = 'new',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  WONT_FIX = 'wont_fix',
  FALSE_POSITIVE = 'false_positive',
  WAIVED = 'waived',
  SUPPRESSED = 'suppressed',
}

@Entity('findings')
export class Finding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Accessibility rule information
  @Column()
  ruleId: string;

  @Column()
  ruleName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  helpText?: string;

  @Column({ nullable: true })
  helpUrl?: string;

  @Column({ type: 'enum', enum: ImpactLevel })
  impact: ImpactLevel;

  @Column({ type: 'enum', enum: FindingStatus, default: FindingStatus.NEW })
  status: FindingStatus;

  // WCAG information
  @Column({ type: 'text', array: true, default: [] })
  wcagTags: string[];

  @Column({ type: 'text', array: true, default: [] })
  wcagCriteria: string[];

  @Column({ nullable: true })
  wcagLevel?: string;

  // Engine information
  @Column()
  engine: string; // 'axe' | 'alfa'

  // Priority scoring (five-factor score)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priorityScore: number;

  @Column({ type: 'json', nullable: true })
  scoringFactors?: {
    impactWeight: number;
    frequencyWeight: number;
    userAffectWeight: number;
    complianceWeight: number;
    complexityWeight: number;
  };

  // Aggregated counts
  @Column({ default: 0 })
  instanceCount: number;

  @Column({ default: 0 })
  pageCount: number;

  @Column('uuid')
  scanRunId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ScanRun, (scanRun) => scanRun.findings)
  @JoinColumn({ name: 'scanRunId' })
  scanRun: ScanRun;

  @OneToMany(() => FindingInstance, (instance) => instance.finding)
  instances: FindingInstance[];

  @OneToMany(() => Waiver, (waiver) => waiver.finding)
  waivers: Waiver[];

  @OneToMany(() => Suppression, (suppression) => suppression.finding)
  suppressions: Suppression[];

  // Computed properties
  get isBlocked(): boolean {
    return this.status === FindingStatus.WAIVED || this.status === FindingStatus.SUPPRESSED;
  }

  get isResolved(): boolean {
    return [
      FindingStatus.RESOLVED,
      FindingStatus.WONT_FIX,
      FindingStatus.FALSE_POSITIVE,
    ].includes(this.status);
  }
}