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
exports.Artifact = exports.ArtifactType = void 0;
const typeorm_1 = require("typeorm");
const scan_run_entity_1 = require("./scan-run.entity");
var ArtifactType;
(function (ArtifactType) {
    ArtifactType["SCREENSHOT"] = "screenshot";
    ArtifactType["PAGE_SOURCE"] = "page_source";
    ArtifactType["HAR_FILE"] = "har_file";
    ArtifactType["SCAN_REPORT"] = "scan_report";
    ArtifactType["ACCESSIBILITY_TREE"] = "accessibility_tree";
    ArtifactType["PERFORMANCE_METRICS"] = "performance_metrics";
})(ArtifactType || (exports.ArtifactType = ArtifactType = {}));
let Artifact = class Artifact {
};
exports.Artifact = Artifact;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Artifact.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artifact.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ArtifactType }),
    __metadata("design:type", String)
], Artifact.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artifact.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Artifact.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artifact.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artifact.prototype, "storageKey", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artifact.prototype, "storageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Artifact.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Artifact.prototype, "scanRunId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Artifact.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Artifact.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => scan_run_entity_1.ScanRun, (scanRun) => scanRun.artifacts),
    (0, typeorm_1.JoinColumn)({ name: 'scanRunId' }),
    __metadata("design:type", scan_run_entity_1.ScanRun)
], Artifact.prototype, "scanRun", void 0);
exports.Artifact = Artifact = __decorate([
    (0, typeorm_1.Entity)('artifacts')
], Artifact);
//# sourceMappingURL=artifact.entity.js.map