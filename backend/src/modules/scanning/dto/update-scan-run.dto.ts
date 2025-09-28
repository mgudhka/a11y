import { PartialType } from '@nestjs/swagger';
import { CreateScanRunDto } from './create-scan-run.dto';

export class UpdateScanRunDto extends PartialType(CreateScanRunDto) {}