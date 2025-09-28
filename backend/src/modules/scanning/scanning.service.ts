import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { ScanRun, ScanType, ScanStatus } from '../../entities/scan-run.entity';
import { CreateScanRunDto } from './dto/create-scan-run.dto';
import { UpdateScanRunDto } from './dto/update-scan-run.dto';

@Injectable()
export class ScanningService {
  constructor(
    @InjectRepository(ScanRun)
    private scanRunRepository: Repository<ScanRun>,
    @InjectQueue('scanning') private scanQueue: Queue,
  ) {}

  async createScanRun(createScanRunDto: CreateScanRunDto): Promise<ScanRun> {
    const scanRun = this.scanRunRepository.create(createScanRunDto);
    const savedScanRun = await this.scanRunRepository.save(scanRun);

    // Add to queue for processing
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

  async findAll(projectId?: string): Promise<ScanRun[]> {
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

  async findOne(id: string): Promise<ScanRun> {
    return this.scanRunRepository.findOne({
      where: { id },
      relations: ['project', 'findings', 'artifacts'],
    });
  }

  async update(id: string, updateScanRunDto: UpdateScanRunDto): Promise<ScanRun> {
    await this.scanRunRepository.update(id, updateScanRunDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: ScanStatus, errorMessage?: string): Promise<void> {
    const updateData: any = { status };
    
    if (status === ScanStatus.RUNNING && !errorMessage) {
      updateData.startedAt = new Date();
    }
    
    if (status === ScanStatus.COMPLETED || status === ScanStatus.FAILED) {
      updateData.completedAt = new Date();
    }

    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    await this.scanRunRepository.update(id, updateData);
  }

  async updateSummary(id: string, summary: any): Promise<void> {
    await this.scanRunRepository.update(id, { summary });
  }

  async cancel(id: string): Promise<ScanRun> {
    const scanRun = await this.findOne(id);
    
    if (scanRun.status === ScanStatus.QUEUED) {
      // Remove from queue if still queued
      const jobs = await this.scanQueue.getJobs(['waiting', 'delayed']);
      const job = jobs.find(j => j.data.scanRunId === id);
      if (job) {
        await job.remove();
      }
    }

    await this.updateStatus(id, ScanStatus.CANCELLED);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
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
}