import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Finding } from './finding.entity';
import { User } from './user.entity';

export enum WaiverStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum WaiverReason {
  BUSINESS_EXCEPTION = 'business_exception',
  TECHNICAL_LIMITATION = 'technical_limitation',
  TEMPORARY_ISSUE = 'temporary_issue',
  FALSE_POSITIVE = 'false_positive',
  ACCEPTABLE_RISK = 'acceptable_risk',
}

@Entity('waivers')
export class Waiver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: WaiverReason })
  reason: WaiverReason;

  @Column({ type: 'text' })
  justification: string;

  @Column({ type: 'enum', enum: WaiverStatus, default: WaiverStatus.PENDING })
  status: WaiverStatus;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  approverNotes?: string;

  @Column({ nullable: true })
  approvedAt?: Date;

  @Column({ type: 'json', nullable: true })
  conditions?: {
    urlPatterns?: string[];
    elementSelectors?: string[];
    timeframe?: {
      start: Date;
      end: Date;
    };
  };

  @Column('uuid')
  findingId: string;

  @Column('uuid')
  requestedById: string;

  @Column('uuid', { nullable: true })
  approvedById?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Finding, (finding) => finding.waivers)
  @JoinColumn({ name: 'findingId' })
  finding: Finding;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requestedById' })
  requestedBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approvedById' })
  approvedBy?: User;

  // Computed properties
  get isActive(): boolean {
    return (
      this.status === WaiverStatus.APPROVED &&
      (!this.expiresAt || this.expiresAt > new Date())
    );
  }

  get isExpired(): boolean {
    return this.expiresAt ? this.expiresAt <= new Date() : false;
  }
}