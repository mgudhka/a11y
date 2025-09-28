"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.databaseConfig = void 0;
const typeorm_1 = require("typeorm");
const organization_entity_1 = require("../entities/organization.entity");
const user_entity_1 = require("../entities/user.entity");
const project_entity_1 = require("../entities/project.entity");
const scan_run_entity_1 = require("../entities/scan-run.entity");
const finding_entity_1 = require("../entities/finding.entity");
const finding_instance_entity_1 = require("../entities/finding-instance.entity");
const artifact_entity_1 = require("../entities/artifact.entity");
const waiver_entity_1 = require("../entities/waiver.entity");
const suppression_entity_1 = require("../entities/suppression.entity");
const audit_log_entity_1 = require("../entities/audit-log.entity");
const databaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'admin'),
    password: configService.get('DB_PASSWORD', 'admin'),
    database: configService.get('DB_NAME', 'a11y_platform'),
    entities: [
        organization_entity_1.Organization,
        user_entity_1.User,
        project_entity_1.Project,
        scan_run_entity_1.ScanRun,
        finding_entity_1.Finding,
        finding_instance_entity_1.FindingInstance,
        artifact_entity_1.Artifact,
        waiver_entity_1.Waiver,
        suppression_entity_1.Suppression,
        audit_log_entity_1.AuditLog,
    ],
    migrations: ['dist/database/migrations/*.js'],
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
});
exports.databaseConfig = databaseConfig;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'a11y_platform',
    entities: [
        organization_entity_1.Organization,
        user_entity_1.User,
        project_entity_1.Project,
        scan_run_entity_1.ScanRun,
        finding_entity_1.Finding,
        finding_instance_entity_1.FindingInstance,
        artifact_entity_1.Artifact,
        waiver_entity_1.Waiver,
        suppression_entity_1.Suppression,
        audit_log_entity_1.AuditLog,
    ],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
});
//# sourceMappingURL=database.config.js.map