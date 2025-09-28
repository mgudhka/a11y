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
exports.Waiver = exports.WaiverReason = exports.WaiverStatus = void 0;
const typeorm_1 = require("typeorm");
const finding_entity_1 = require("./finding.entity");
const user_entity_1 = require("./user.entity");
var WaiverStatus;
(function (WaiverStatus) {
    WaiverStatus["PENDING"] = "pending";
    WaiverStatus["APPROVED"] = "approved";
    WaiverStatus["REJECTED"] = "rejected";
    WaiverStatus["EXPIRED"] = "expired";
})(WaiverStatus || (exports.WaiverStatus = WaiverStatus = {}));
var WaiverReason;
(function (WaiverReason) {
    WaiverReason["BUSINESS_EXCEPTION"] = "business_exception";
    WaiverReason["TECHNICAL_LIMITATION"] = "technical_limitation";
    WaiverReason["TEMPORARY_ISSUE"] = "temporary_issue";
    WaiverReason["FALSE_POSITIVE"] = "false_positive";
    WaiverReason["ACCEPTABLE_RISK"] = "acceptable_risk";
})(WaiverReason || (exports.WaiverReason = WaiverReason = {}));
let Waiver = class Waiver {
    get isActive() {
        return (this.status === WaiverStatus.APPROVED &&
            (!this.expiresAt || this.expiresAt > new Date()));
    }
    get isExpired() {
        return this.expiresAt ? this.expiresAt <= new Date() : false;
    }
};
exports.Waiver = Waiver;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Waiver.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: WaiverReason }),
    __metadata("design:type", String)
], Waiver.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Waiver.prototype, "justification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: WaiverStatus, default: WaiverStatus.PENDING }),
    __metadata("design:type", String)
], Waiver.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Waiver.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Waiver.prototype, "approverNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Waiver.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Waiver.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Waiver.prototype, "findingId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Waiver.prototype, "requestedById", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Waiver.prototype, "approvedById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Waiver.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Waiver.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => finding_entity_1.Finding, (finding) => finding.waivers),
    (0, typeorm_1.JoinColumn)({ name: 'findingId' }),
    __metadata("design:type", finding_entity_1.Finding)
], Waiver.prototype, "finding", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'requestedById' }),
    __metadata("design:type", user_entity_1.User)
], Waiver.prototype, "requestedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'approvedById' }),
    __metadata("design:type", user_entity_1.User)
], Waiver.prototype, "approvedBy", void 0);
exports.Waiver = Waiver = __decorate([
    (0, typeorm_1.Entity)('waivers')
], Waiver);
//# sourceMappingURL=waiver.entity.js.map