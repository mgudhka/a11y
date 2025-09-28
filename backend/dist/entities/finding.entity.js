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
exports.Finding = exports.FindingStatus = exports.ImpactLevel = void 0;
const typeorm_1 = require("typeorm");
const scan_run_entity_1 = require("./scan-run.entity");
const finding_instance_entity_1 = require("./finding-instance.entity");
const waiver_entity_1 = require("./waiver.entity");
const suppression_entity_1 = require("./suppression.entity");
var ImpactLevel;
(function (ImpactLevel) {
    ImpactLevel["CRITICAL"] = "critical";
    ImpactLevel["SERIOUS"] = "serious";
    ImpactLevel["MODERATE"] = "moderate";
    ImpactLevel["MINOR"] = "minor";
})(ImpactLevel || (exports.ImpactLevel = ImpactLevel = {}));
var FindingStatus;
(function (FindingStatus) {
    FindingStatus["NEW"] = "new";
    FindingStatus["ACKNOWLEDGED"] = "acknowledged";
    FindingStatus["IN_PROGRESS"] = "in_progress";
    FindingStatus["RESOLVED"] = "resolved";
    FindingStatus["WONT_FIX"] = "wont_fix";
    FindingStatus["FALSE_POSITIVE"] = "false_positive";
    FindingStatus["WAIVED"] = "waived";
    FindingStatus["SUPPRESSED"] = "suppressed";
})(FindingStatus || (exports.FindingStatus = FindingStatus = {}));
let Finding = class Finding {
    get isBlocked() {
        return this.status === FindingStatus.WAIVED || this.status === FindingStatus.SUPPRESSED;
    }
    get isResolved() {
        return [
            FindingStatus.RESOLVED,
            FindingStatus.WONT_FIX,
            FindingStatus.FALSE_POSITIVE,
        ].includes(this.status);
    }
};
exports.Finding = Finding;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Finding.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Finding.prototype, "ruleId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Finding.prototype, "ruleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Finding.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "helpText", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "helpUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ImpactLevel }),
    __metadata("design:type", String)
], Finding.prototype, "impact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: FindingStatus, default: FindingStatus.NEW }),
    __metadata("design:type", String)
], Finding.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Finding.prototype, "wcagTags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Finding.prototype, "wcagCriteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Finding.prototype, "wcagLevel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Finding.prototype, "engine", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Finding.prototype, "priorityScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Finding.prototype, "scoringFactors", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Finding.prototype, "instanceCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Finding.prototype, "pageCount", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Finding.prototype, "scanRunId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Finding.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Finding.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => scan_run_entity_1.ScanRun, (scanRun) => scanRun.findings),
    (0, typeorm_1.JoinColumn)({ name: 'scanRunId' }),
    __metadata("design:type", scan_run_entity_1.ScanRun)
], Finding.prototype, "scanRun", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => finding_instance_entity_1.FindingInstance, (instance) => instance.finding),
    __metadata("design:type", Array)
], Finding.prototype, "instances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => waiver_entity_1.Waiver, (waiver) => waiver.finding),
    __metadata("design:type", Array)
], Finding.prototype, "waivers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => suppression_entity_1.Suppression, (suppression) => suppression.finding),
    __metadata("design:type", Array)
], Finding.prototype, "suppressions", void 0);
exports.Finding = Finding = __decorate([
    (0, typeorm_1.Entity)('findings')
], Finding);
//# sourceMappingURL=finding.entity.js.map