import { ScanningService } from './scanning.service';
import { CreateScanRunDto } from './dto/create-scan-run.dto';
import { UpdateScanRunDto } from './dto/update-scan-run.dto';
export declare class ScanningController {
    private readonly scanningService;
    constructor(scanningService: ScanningService);
    create(createScanRunDto: CreateScanRunDto): Promise<import("../../entities/scan-run.entity").ScanRun>;
    findAll(projectId?: string): Promise<import("../../entities/scan-run.entity").ScanRun[]>;
    findOne(id: string): Promise<import("../../entities/scan-run.entity").ScanRun>;
    update(id: string, updateScanRunDto: UpdateScanRunDto): Promise<import("../../entities/scan-run.entity").ScanRun>;
    cancel(id: string): Promise<import("../../entities/scan-run.entity").ScanRun>;
    remove(id: string): Promise<void>;
    getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
}
