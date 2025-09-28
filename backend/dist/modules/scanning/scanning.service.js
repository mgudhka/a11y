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
exports.ScanningService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const typeorm_2 = require("typeorm");
const scan_run_entity_1 = require("../../entities/scan-run.entity");
let ScanningService = class ScanningService {
    constructor(scanRunRepository, scanQueue) {
        this.scanRunRepository = scanRunRepository;
        this.scanQueue = scanQueue;
    }
    async createScanRun(createScanRunDto) {
        const scanRun = this.scanRunRepository.create(createScanRunDto);
        const savedScanRun = await this.scanRunRepository.save(scanRun);
        await this.scanQueue.add('process-scan', {
            scanRunId: savedScanRun.id,
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        });
        return savedScanRun;
    }
    async findAll(projectId) {
        const query = this.scanRunRepository
            .createQueryBuilder('scanRun')
            .leftJoinAndSelect('scanRun.project', 'project')
            .leftJoinAndSelect('scanRun.findings', 'findings')
            .orderBy('scanRun.createdAt', 'DESC');
        if (projectId) {
            query.where('scanRun.projectId = :projectId', { projectId });
        }
        return query.getMany();
    }
    async findOne(id) {
        return this.scanRunRepository.findOne({
            where: { id },
            relations: ['project', 'findings', 'artifacts'],
        });
    }
    async update(id, updateScanRunDto) {
        await this.scanRunRepository.update(id, updateScanRunDto);
        return this.findOne(id);
    }
    async updateStatus(id, status, errorMessage) {
        const updateData = { status };
        if (status === scan_run_entity_1.ScanStatus.RUNNING && !errorMessage) {
            updateData.startedAt = new Date();
        }
        if (status === scan_run_entity_1.ScanStatus.COMPLETED || status === scan_run_entity_1.ScanStatus.FAILED) {
            updateData.completedAt = new Date();
        }
        if (errorMessage) {
            updateData.errorMessage = errorMessage;
        }
        await this.scanRunRepository.update(id, updateData);
    }
    async updateSummary(id, summary) {
        await this.scanRunRepository.update(id, { summary });
    }
    async cancel(id) {
        const scanRun = await this.findOne(id);
        if (scanRun.status === scan_run_entity_1.ScanStatus.QUEUED) {
            const jobs = await this.scanQueue.getJobs(['waiting', 'delayed']);
            const job = jobs.find(j => j.data.scanRunId === id);
            if (job) {
                await job.remove();
            }
        }
        await this.updateStatus(id, scan_run_entity_1.ScanStatus.CANCELLED);
        return this.findOne(id);
    }
    async delete(id) {
        await this.scanRunRepository.delete(id);
    }
    async getQueueStats() {
        const [waiting, active, completed, failed] = await Promise.all([
            this.scanQueue.getWaiting(),
            this.scanQueue.getActive(),
            this.scanQueue.getCompleted(),
            this.scanQueue.getFailed(),
        ]);
        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
        };
    }
};
exports.ScanningService = ScanningService;
exports.ScanningService = ScanningService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(scan_run_entity_1.ScanRun)),
    __param(1, (0, bull_1.InjectQueue)('scanning')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], ScanningService);
//# sourceMappingURL=scanning.service.js.map