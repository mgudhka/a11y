import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScanningService } from './scanning.service';
import { CreateScanRunDto } from './dto/create-scan-run.dto';
import { UpdateScanRunDto } from './dto/update-scan-run.dto';

@ApiTags('scanning')
@Controller('scanning')
export class ScanningController {
  constructor(private readonly scanningService: ScanningService) {}

  @Post('scans')
  @ApiOperation({ summary: 'Create a new scan run' })
  @ApiResponse({ status: 201, description: 'Scan run created successfully' })
  create(@Body() createScanRunDto: CreateScanRunDto) {
    return this.scanningService.createScanRun(createScanRunDto);
  }

  @Get('scans')
  @ApiOperation({ summary: 'Get all scan runs' })
  @ApiResponse({ status: 200, description: 'List of scan runs' })
  findAll(@Query('projectId') projectId?: string) {
    return this.scanningService.findAll(projectId);
  }

  @Get('scans/:id')
  @ApiOperation({ summary: 'Get scan run by ID' })
  @ApiResponse({ status: 200, description: 'Scan run details' })
  findOne(@Param('id') id: string) {
    return this.scanningService.findOne(id);
  }

  @Put('scans/:id')
  @ApiOperation({ summary: 'Update scan run' })
  @ApiResponse({ status: 200, description: 'Scan run updated' })
  update(@Param('id') id: string, @Body() updateScanRunDto: UpdateScanRunDto) {
    return this.scanningService.update(id, updateScanRunDto);
  }

  @Put('scans/:id/cancel')
  @ApiOperation({ summary: 'Cancel scan run' })
  @ApiResponse({ status: 200, description: 'Scan run cancelled' })
  cancel(@Param('id') id: string) {
    return this.scanningService.cancel(id);
  }

  @Delete('scans/:id')
  @ApiOperation({ summary: 'Delete scan run' })
  @ApiResponse({ status: 204, description: 'Scan run deleted' })
  remove(@Param('id') id: string) {
    return this.scanningService.delete(id);
  }

  @Get('queue/stats')
  @ApiOperation({ summary: 'Get scan queue statistics' })
  @ApiResponse({ status: 200, description: 'Queue statistics' })
  getQueueStats() {
    return this.scanningService.getQueueStats();
  }
}