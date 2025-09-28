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

export enum SuppressionType {
  RULE_BASED = 'rule_based',
  URL_BASED = 'url_based',
  ELEMENT_BASED = 'element_based',
  GLOBAL = 'global',
}

export enum SuppressionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

@Entity('suppressions')
export class Suppression {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: SuppressionType })
  type: SuppressionType;

  @Column({ type: 'enum', enum: SuppressionStatus, default: SuppressionStatus.ACTIVE })
  status: SuppressionStatus;

  @Column({ type: 'json' })
  conditions: {
    ruleIds?: string[];
    urlPatterns?: string[];
    elementSelectors?: string[];
    impact?: string[];
    wcagCriteria?: string[];
  };

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column('uuid', { nullable: true })
  findingId?: string;

  @Column('uuid')
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Finding, (finding) => finding.suppressions, { nullable: true })
  @JoinColumn({ name: 'findingId' })
  finding?: Finding;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  // Computed properties
  get isActive(): boolean {
    return (
      this.status === SuppressionStatus.ACTIVE &&
      (!this.expiresAt || this.expiresAt > new Date())
    );
  }

  get isExpired(): boolean {
    return this.expiresAt ? this.expiresAt <= new Date() : false;
  }

  // Methods
  matches(finding: Finding, url?: string, selector?: string): boolean {
    if (!this.isActive) return false;

    const { conditions } = this;

    // Check rule IDs
    if (conditions.ruleIds?.length && !conditions.ruleIds.includes(finding.ruleId)) {
      return false;
    }

    // Check impact levels
    if (conditions.impact?.length && !conditions.impact.includes(finding.impact)) {
      return false;
    }

    // Check WCAG criteria
    if (conditions.wcagCriteria?.length) {
      const hasMatch = conditions.wcagCriteria.some(criteria =>
        finding.wcagCriteria.includes(criteria)
      );
      if (!hasMatch) return false;
    }

    // Check URL patterns
    if (conditions.urlPatterns?.length && url) {
      const hasMatch = conditions.urlPatterns.some(pattern => {
        try {
          return new RegExp(pattern).test(url);
        } catch {
          return url.includes(pattern);
        }
      });
      if (!hasMatch) return false;
    }

    // Check element selectors
    if (conditions.elementSelectors?.length && selector) {
      const hasMatch = conditions.elementSelectors.some(selectorPattern => {
        try {
          return new RegExp(selectorPattern).test(selector);
        } catch {
          return selector.includes(selectorPattern);
        }
      });
      if (!hasMatch) return false;
    }

    return true;
  }
}