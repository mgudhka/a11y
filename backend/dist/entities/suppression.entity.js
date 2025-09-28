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
exports.Suppression = exports.SuppressionStatus = exports.SuppressionType = void 0;
const typeorm_1 = require("typeorm");
const finding_entity_1 = require("./finding.entity");
const user_entity_1 = require("./user.entity");
var SuppressionType;
(function (SuppressionType) {
    SuppressionType["RULE_BASED"] = "rule_based";
    SuppressionType["URL_BASED"] = "url_based";
    SuppressionType["ELEMENT_BASED"] = "element_based";
    SuppressionType["GLOBAL"] = "global";
})(SuppressionType || (exports.SuppressionType = SuppressionType = {}));
var SuppressionStatus;
(function (SuppressionStatus) {
    SuppressionStatus["ACTIVE"] = "active";
    SuppressionStatus["INACTIVE"] = "inactive";
    SuppressionStatus["EXPIRED"] = "expired";
})(SuppressionStatus || (exports.SuppressionStatus = SuppressionStatus = {}));
let Suppression = class Suppression {
    get isActive() {
        return (this.status === SuppressionStatus.ACTIVE &&
            (!this.expiresAt || this.expiresAt > new Date()));
    }
    get isExpired() {
        return this.expiresAt ? this.expiresAt <= new Date() : false;
    }
    matches(finding, url, selector) {
        if (!this.isActive)
            return false;
        const { conditions } = this;
        if (conditions.ruleIds?.length && !conditions.ruleIds.includes(finding.ruleId)) {
            return false;
        }
        if (conditions.impact?.length && !conditions.impact.includes(finding.impact)) {
            return false;
        }
        if (conditions.wcagCriteria?.length) {
            const hasMatch = conditions.wcagCriteria.some(criteria => finding.wcagCriteria.includes(criteria));
            if (!hasMatch)
                return false;
        }
        if (conditions.urlPatterns?.length && url) {
            const hasMatch = conditions.urlPatterns.some(pattern => {
                try {
                    return new RegExp(pattern).test(url);
                }
                catch {
                    return url.includes(pattern);
                }
            });
            if (!hasMatch)
                return false;
        }
        if (conditions.elementSelectors?.length && selector) {
            const hasMatch = conditions.elementSelectors.some(selectorPattern => {
                try {
                    return new RegExp(selectorPattern).test(selector);
                }
                catch {
                    return selector.includes(selectorPattern);
                }
            });
            if (!hasMatch)
                return false;
        }
        return true;
    }
};
exports.Suppression = Suppression;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Suppression.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Suppression.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Suppression.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SuppressionType }),
    __metadata("design:type", String)
], Suppression.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SuppressionStatus, default: SuppressionStatus.ACTIVE }),
    __metadata("design:type", String)
], Suppression.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], Suppression.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Suppression.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Suppression.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Suppression.prototype, "findingId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Suppression.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Suppression.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Suppression.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => finding_entity_1.Finding, (finding) => finding.suppressions, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'findingId' }),
    __metadata("design:type", finding_entity_1.Finding)
], Suppression.prototype, "finding", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Suppression.prototype, "createdBy", void 0);
exports.Suppression = Suppression = __decorate([
    (0, typeorm_1.Entity)('suppressions')
], Suppression);
//# sourceMappingURL=suppression.entity.js.map