import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { ScanRun, ScanStatus } from '../../entities/scan-run.entity';
import { CreateScanRunDto } from './dto/create-scan-run.dto';
import { UpdateScanRunDto } from './dto/update-scan-run.dto';
export declare class ScanningService {
    private scanRunRepository;
    private scanQueue;
    constructor(scanRunRepository: Repository<ScanRun>, scanQueue: Queue);
    createScanRun(createScanRunDto: CreateScanRunDto): Promise<ScanRun>;
    findAll(projectId?: string): Promise<ScanRun[]>;
    findOne(id: string): Promise<ScanRun>;
    update(id: string, updateScanRunDto: UpdateScanRunDto): Promise<ScanRun>;
    updateStatus(id: string, status: ScanStatus, errorMessage?: string): Promise<void>;
    updateSummary(id: string, summary: any): Promise<void>;
    cancel(id: string): Promise<ScanRun>;
    delete(id: string): Promise<void>;
    getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
}
