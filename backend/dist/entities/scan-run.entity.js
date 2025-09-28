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
exports.ScanRun = exports.ScanStatus = exports.ScanType = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const finding_entity_1 = require("./finding.entity");
const artifact_entity_1 = require("./artifact.entity");
var ScanType;
(function (ScanType) {
    ScanType["WEB_CRAWL"] = "web_crawl";
    ScanType["WEB_URLS"] = "web_urls";
    ScanType["API"] = "api";
    ScanType["MOBILE"] = "mobile";
})(ScanType || (exports.ScanType = ScanType = {}));
var ScanStatus;
(function (ScanStatus) {
    ScanStatus["QUEUED"] = "queued";
    ScanStatus["RUNNING"] = "running";
    ScanStatus["COMPLETED"] = "completed";
    ScanStatus["FAILED"] = "failed";
    ScanStatus["CANCELLED"] = "cancelled";
})(ScanStatus || (exports.ScanStatus = ScanStatus = {}));
let ScanRun = class ScanRun {
    get duration() {
        if (!this.startedAt || !this.completedAt)
            return null;
        return this.completedAt.getTime() - this.startedAt.getTime();
    }
    get isComplete() {
        return [ScanStatus.COMPLETED, ScanStatus.FAILED, ScanStatus.CANCELLED].includes(this.status);
    }
};
exports.ScanRun = ScanRun;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ScanRun.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScanType }),
    __metadata("design:type", String)
], ScanRun.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScanStatus, default: ScanStatus.QUEUED }),
    __metadata("design:type", String)
], ScanRun.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], ScanRun.prototype, "configuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ScanRun.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ScanRun.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ScanRun.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ScanRun.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ScanRun.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ScanRun.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ScanRun.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ScanRun.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.scanRuns),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", project_entity_1.Project)
], ScanRun.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => finding_entity_1.Finding, (finding) => finding.scanRun),
    __metadata("design:type", Array)
], ScanRun.prototype, "findings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => artifact_entity_1.Artifact, (artifact) => artifact.scanRun),
    __metadata("design:type", Array)
], ScanRun.prototype, "artifacts", void 0);
exports.ScanRun = ScanRun = __decorate([
    (0, typeorm_1.Entity)('scan_runs')
], ScanRun);
//# sourceMappingURL=scan-run.entity.js.map