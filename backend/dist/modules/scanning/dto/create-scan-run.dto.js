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
exports.CreateScanRunDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const scan_run_entity_1 = require("../../../entities/scan-run.entity");
class CreateScanRunDto {
}
exports.CreateScanRunDto = CreateScanRunDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: scan_run_entity_1.ScanType, description: 'Type of scan to perform' }),
    (0, class_validator_1.IsEnum)(scan_run_entity_1.ScanType),
    __metadata("design:type", String)
], CreateScanRunDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Scan configuration' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateScanRunDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Scan metadata', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateScanRunDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateScanRunDto.prototype, "projectId", void 0);
//# sourceMappingURL=create-scan-run.dto.js.map