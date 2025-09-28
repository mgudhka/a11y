"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const app_config_1 = require("./config/app.config");
const database_config_1 = require("./config/database.config");
const scanning_module_1 = require("./modules/scanning/scanning.module");
const findings_module_1 = require("./modules/findings/findings.module");
const projects_module_1 = require("./modules/projects/projects.module");
const organizations_module_1 = require("./modules/organizations/organizations.module");
const users_module_1 = require("./modules/users/users.module");
const waivers_module_1 = require("./modules/waivers/waivers.module");
const suppressions_module_1 = require("./modules/suppressions/suppressions.module");
const artifacts_module_1 = require("./modules/artifacts/artifacts.module");
const audit_logs_module_1 = require("./modules/audit-logs/audit-logs.module");
const webhooks_module_1 = require("./modules/webhooks/webhooks.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.databaseConfig,
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('redis.host'),
                        port: configService.get('redis.port'),
                        password: configService.get('redis.password'),
                        db: configService.get('redis.db'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            organizations_module_1.OrganizationsModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            scanning_module_1.ScanningModule,
            findings_module_1.FindingsModule,
            waivers_module_1.WaiversModule,
            suppressions_module_1.SuppressionsModule,
            artifacts_module_1.ArtifactsModule,
            audit_logs_module_1.AuditLogsModule,
            webhooks_module_1.WebhooksModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map