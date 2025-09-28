import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { ScanRun } from '../entities/scan-run.entity';
import { Finding } from '../entities/finding.entity';
import { FindingInstance } from '../entities/finding-instance.entity';
import { Artifact } from '../entities/artifact.entity';
import { Waiver } from '../entities/waiver.entity';
import { Suppression } from '../entities/suppression.entity';
import { AuditLog } from '../entities/audit-log.entity';

export const databaseConfig = (configService: ConfigService) => ({
  type: 'postgres' as const,
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'admin'),
  password: configService.get('DB_PASSWORD', 'admin'),
  database: configService.get('DB_NAME', 'a11y_platform'),
  entities: [
    Organization,
    User,
    Project,
    ScanRun,
    Finding,
    FindingInstance,
    Artifact,
    Waiver,
    Suppression,
    AuditLog,
  ],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'a11y_platform',
  entities: [
    Organization,
    User,
    Project,
    ScanRun,
    Finding,
    FindingInstance,
    Artifact,
    Waiver,
    Suppression,
    AuditLog,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});