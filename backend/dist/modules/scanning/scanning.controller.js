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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanningController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scanning_service_1 = require("./scanning.service");
const create_scan_run_dto_1 = require("./dto/create-scan-run.dto");
const update_scan_run_dto_1 = require("./dto/update-scan-run.dto");
let ScanningController = class ScanningController {
    constructor(scanningService) {
        this.scanningService = scanningService;
    }
    create(createScanRunDto) {
        return this.scanningService.createScanRun(createScanRunDto);
    }
    findAll(projectId) {
        return this.scanningService.findAll(projectId);
    }
    findOne(id) {
        return this.scanningService.findOne(id);
    }
    update(id, updateScanRunDto) {
        return this.scanningService.update(id, updateScanRunDto);
    }
    cancel(id) {
        return this.scanningService.cancel(id);
    }
    remove(id) {
        return this.scanningService.delete(id);
    }
    getQueueStats() {
        return this.scanningService.getQueueStats();
    }
};
exports.ScanningController = ScanningController;
__decorate([
    (0, common_1.Post)('scans'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new scan run' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scan run created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scan_run_dto_1.CreateScanRunDto]),
    __metadata("design:returntype", void 0)
], ScanningController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('scans'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all scan runs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of scan runs' }),
    __param(0, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScanningController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('scans/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scan run by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scan run details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScanningController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('scans/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update scan run' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scan run updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_scan_run_dto_1.UpdateScanRunDto]),
    __metadata("design:returntype", void 0)
], ScanningController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('scans/:id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel scan run' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scan run cancelled' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScanningController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)('scans/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete scan run' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Scan run deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScanningController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('queue/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scan queue statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Queue statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScanningController.prototype, "getQueueStats", null);
exports.ScanningController = ScanningController = __decorate([
    (0, swagger_1.ApiTags)('scanning'),
    (0, common_1.Controller)('scanning'),
    __metadata("design:paramtypes", [scanning_service_1.ScanningService])
], ScanningController);
//# sourceMappingURL=scanning.controller.js.map