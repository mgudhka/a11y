import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import appConfig from './config/app.config';
import { databaseConfig } from './config/database.config';
import { ScanningModule } from './modules/scanning/scanning.module';
import { FindingsModule } from './modules/findings/findings.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { WaiversModule } from './modules/waivers/waivers.module';
import { SuppressionsModule } from './modules/suppressions/suppressions.module';
import { ArtifactsModule } from './modules/artifacts/artifacts.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    
    // Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
          db: configService.get('redis.db'),
        },
      }),
      inject: [ConfigService],
    }),
    
    // Feature modules
    OrganizationsModule,
    UsersModule,
    ProjectsModule,
    ScanningModule,
    FindingsModule,
    WaiversModule,
    SuppressionsModule,
    ArtifactsModule,
    AuditLogsModule,
    WebhooksModule,
  ],
})
export class AppModule {}