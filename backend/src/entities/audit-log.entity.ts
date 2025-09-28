import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

export enum AuditAction {
  // User actions
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  USER_PASSWORD_CHANGE = 'user.password.change',

  // Organization actions
  ORG_CREATE = 'organization.create',
  ORG_UPDATE = 'organization.update',
  ORG_DELETE = 'organization.delete',

  // Project actions
  PROJECT_CREATE = 'project.create',
  PROJECT_UPDATE = 'project.update',
  PROJECT_DELETE = 'project.delete',
  PROJECT_ARCHIVE = 'project.archive',

  // Scan actions
  SCAN_START = 'scan.start',
  SCAN_COMPLETE = 'scan.complete',
  SCAN_CANCEL = 'scan.cancel',
  SCAN_DELETE = 'scan.delete',

  // Finding actions
  FINDING_STATUS_CHANGE = 'finding.status.change',
  FINDING_ASSIGN = 'finding.assign',
  FINDING_COMMENT = 'finding.comment',

  // Waiver actions
  WAIVER_REQUEST = 'waiver.request',
  WAIVER_APPROVE = 'waiver.approve',
  WAIVER_REJECT = 'waiver.reject',
  WAIVER_EXPIRE = 'waiver.expire',

  // Suppression actions
  SUPPRESSION_CREATE = 'suppression.create',
  SUPPRESSION_UPDATE = 'suppression.update',
  SUPPRESSION_DELETE = 'suppression.delete',
  SUPPRESSION_ACTIVATE = 'suppression.activate',
  SUPPRESSION_DEACTIVATE = 'suppression.deactivate',

  // Integration actions
  API_KEY_CREATE = 'api_key.create',
  API_KEY_DELETE = 'api_key.delete',
  WEBHOOK_CREATE = 'webhook.create',
  WEBHOOK_UPDATE = 'webhook.update',
  WEBHOOK_DELETE = 'webhook.delete',

  // System actions
  SYSTEM_BACKUP = 'system.backup',
  SYSTEM_RESTORE = 'system.restore',
  SYSTEM_MAINTENANCE = 'system.maintenance',
}

export enum AuditSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'enum', enum: AuditSeverity, default: AuditSeverity.LOW })
  severity: AuditSeverity;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  details?: {
    resourceType?: string;
    resourceId?: string;
    previousValues?: Record<string, any>;
    newValues?: Record<string, any>;
    metadata?: Record<string, any>;
  };

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ type: 'json', nullable: true })
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
  };

  @Column({ type: 'json', nullable: true })
  response?: {
    status?: number;
    headers?: Record<string, string>;
    body?: any;
  };

  @Column('uuid')
  organizationId: string;

  @Column('uuid', { nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Organization, (org) => org.auditLogs)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  // Computed properties
  get isSensitive(): boolean {
    return [
      AuditAction.USER_PASSWORD_CHANGE,
      AuditAction.API_KEY_CREATE,
      AuditAction.API_KEY_DELETE,
    ].includes(this.action);
  }

  get isSecurityRelated(): boolean {
    return [
      AuditAction.USER_LOGIN,
      AuditAction.USER_LOGOUT,
      AuditAction.USER_PASSWORD_CHANGE,
      AuditAction.API_KEY_CREATE,
      AuditAction.API_KEY_DELETE,
    ].includes(this.action) || this.severity === AuditSeverity.CRITICAL;
  }
}