"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.AuditSeverity = exports.AuditAction = void 0;
const typeorm_1 = require("typeorm");
const organization_entity_1 = require("./organization.entity");
const user_entity_1 = require("./user.entity");
var AuditAction;
(function (AuditAction) {
    AuditAction["USER_LOGIN"] = "user.login";
    AuditAction["USER_LOGOUT"] = "user.logout";
    AuditAction["USER_CREATE"] = "user.create";
    AuditAction["USER_UPDATE"] = "user.update";
    AuditAction["USER_DELETE"] = "user.delete";
    AuditAction["USER_PASSWORD_CHANGE"] = "user.password.change";
    AuditAction["ORG_CREATE"] = "organization.create";
    AuditAction["ORG_UPDATE"] = "organization.update";
    AuditAction["ORG_DELETE"] = "organization.delete";
    AuditAction["PROJECT_CREATE"] = "project.create";
    AuditAction["PROJECT_UPDATE"] = "project.update";
    AuditAction["PROJECT_DELETE"] = "project.delete";
    AuditAction["PROJECT_ARCHIVE"] = "project.archive";
    AuditAction["SCAN_START"] = "scan.start";
    AuditAction["SCAN_COMPLETE"] = "scan.complete";
    AuditAction["SCAN_CANCEL"] = "scan.cancel";
    AuditAction["SCAN_DELETE"] = "scan.delete";
    AuditAction["FINDING_STATUS_CHANGE"] = "finding.status.change";
    AuditAction["FINDING_ASSIGN"] = "finding.assign";
    AuditAction["FINDING_COMMENT"] = "finding.comment";
    AuditAction["WAIVER_REQUEST"] = "waiver.request";
    AuditAction["WAIVER_APPROVE"] = "waiver.approve";
    AuditAction["WAIVER_REJECT"] = "waiver.reject";
    AuditAction["WAIVER_EXPIRE"] = "waiver.expire";
    AuditAction["SUPPRESSION_CREATE"] = "suppression.create";
    AuditAction["SUPPRESSION_UPDATE"] = "suppression.update";
    AuditAction["SUPPRESSION_DELETE"] = "suppression.delete";
    AuditAction["SUPPRESSION_ACTIVATE"] = "suppression.activate";
    AuditAction["SUPPRESSION_DEACTIVATE"] = "suppression.deactivate";
    AuditAction["API_KEY_CREATE"] = "api_key.create";
    AuditAction["API_KEY_DELETE"] = "api_key.delete";
    AuditAction["WEBHOOK_CREATE"] = "webhook.create";
    AuditAction["WEBHOOK_UPDATE"] = "webhook.update";
    AuditAction["WEBHOOK_DELETE"] = "webhook.delete";
    AuditAction["SYSTEM_BACKUP"] = "system.backup";
    AuditAction["SYSTEM_RESTORE"] = "system.restore";
    AuditAction["SYSTEM_MAINTENANCE"] = "system.maintenance";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["LOW"] = "low";
    AuditSeverity["MEDIUM"] = "medium";
    AuditSeverity["HIGH"] = "high";
    AuditSeverity["CRITICAL"] = "critical";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
let AuditLog = class AuditLog {
    get isSensitive() {
        return [
            AuditAction.USER_PASSWORD_CHANGE,
            AuditAction.API_KEY_CREATE,
            AuditAction.API_KEY_DELETE,
        ].includes(this.action);
    }
    get isSecurityRelated() {
        return [
            AuditAction.USER_LOGIN,
            AuditAction.USER_LOGOUT,
            AuditAction.USER_PASSWORD_CHANGE,
            AuditAction.API_KEY_CREATE,
            AuditAction.API_KEY_DELETE,
        ].includes(this.action) || this.severity === AuditSeverity.CRITICAL;
    }
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AuditAction }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AuditSeverity, default: AuditSeverity.LOW }),
    __metadata("design:type", String)
], AuditLog.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], AuditLog.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AuditLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization, (org) => org.auditLogs),
    (0, typeorm_1.JoinColumn)({ name: 'organizationId' }),
    __metadata("design:type", organization_entity_1.Organization)
], AuditLog.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], AuditLog.prototype, "user", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)('audit_logs')
], AuditLog);
//# sourceMappingURL=audit-log.entity.js.map