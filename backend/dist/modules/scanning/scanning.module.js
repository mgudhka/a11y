"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanningModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const scan_run_entity_1 = require("../../entities/scan-run.entity");
const finding_entity_1 = require("../../entities/finding.entity");
const finding_instance_entity_1 = require("../../entities/finding-instance.entity");
const artifact_entity_1 = require("../../entities/artifact.entity");
const scanning_service_1 = require("./scanning.service");
const scanning_controller_1 = require("./scanning.controller");
const scan_processor_1 = require("./scan.processor");
const axe_engine_1 = require("./engines/axe.engine");
const alfa_engine_1 = require("./engines/alfa.engine");
const crawler_service_1 = require("./crawler.service");
const result_normalizer_service_1 = require("./result-normalizer.service");
const artifacts_module_1 = require("../artifacts/artifacts.module");
let ScanningModule = class ScanningModule {
};
exports.ScanningModule = ScanningModule;
exports.ScanningModule = ScanningModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([scan_run_entity_1.ScanRun, finding_entity_1.Finding, finding_instance_entity_1.FindingInstance, artifact_entity_1.Artifact]),
            bull_1.BullModule.registerQueue({
                name: 'scanning',
            }),
            artifacts_module_1.ArtifactsModule,
        ],
        providers: [
            scanning_service_1.ScanningService,
            scan_processor_1.ScanProcessor,
            axe_engine_1.AxeEngine,
            alfa_engine_1.AlfaEngine,
            crawler_service_1.CrawlerService,
            result_normalizer_service_1.ResultNormalizerService,
        ],
        controllers: [scanning_controller_1.ScanningController],
        exports: [scanning_service_1.ScanningService],
    })
], ScanningModule);
//# sourceMappingURL=scanning.module.js.map