import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Finding } from './finding.entity';

@Entity('finding_instances')
export class FindingInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Page information
  @Column()
  url: string;

  @Column()
  canonicalUrl: string;

  @Column({ nullable: true })
  pageTitle?: string;

  // Element information
  @Column({ type: 'text', nullable: true })
  elementSelector?: string;

  @Column({ type: 'text', nullable: true })
  elementHtml?: string;

  @Column({ type: 'text', nullable: true })
  elementText?: string;

  @Column({ type: 'json', nullable: true })
  elementBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Issue details
  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'json', nullable: true })
  data?: any;

  // Context information
  @Column({ type: 'text', array: true, default: [] })
  relatedNodes: string[];

  @Column({ type: 'json', nullable: true })
  environment?: {
    userAgent?: string;
    viewportSize?: { width: number; height: number };
    colorScheme?: string;
  };

  // Fingerprinting for deduplication
  @Column()
  fingerprint: string;

  @Column('uuid')
  findingId: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Finding, (finding) => finding.instances)
  @JoinColumn({ name: 'findingId' })
  finding: Finding;
}