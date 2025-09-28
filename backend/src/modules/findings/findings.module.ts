import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Finding } from '../../entities/finding.entity';
import { FindingInstance } from '../../entities/finding-instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Finding, FindingInstance])],
})
export class FindingsModule {}