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
exports.FindingInstance = void 0;
const typeorm_1 = require("typeorm");
const finding_entity_1 = require("./finding.entity");
let FindingInstance = class FindingInstance {
};
exports.FindingInstance = FindingInstance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FindingInstance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FindingInstance.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FindingInstance.prototype, "canonicalUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FindingInstance.prototype, "pageTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FindingInstance.prototype, "elementSelector", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FindingInstance.prototype, "elementHtml", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FindingInstance.prototype, "elementText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], FindingInstance.prototype, "elementBounds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FindingInstance.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], FindingInstance.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], FindingInstance.prototype, "relatedNodes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], FindingInstance.prototype, "environment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FindingInstance.prototype, "fingerprint", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], FindingInstance.prototype, "findingId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FindingInstance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => finding_entity_1.Finding, (finding) => finding.instances),
    (0, typeorm_1.JoinColumn)({ name: 'findingId' }),
    __metadata("design:type", finding_entity_1.Finding)
], FindingInstance.prototype, "finding", void 0);
exports.FindingInstance = FindingInstance = __decorate([
    (0, typeorm_1.Entity)('finding_instances')
], FindingInstance);
//# sourceMappingURL=finding-instance.entity.js.map