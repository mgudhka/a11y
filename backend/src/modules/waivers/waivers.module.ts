import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Waiver } from '../../entities/waiver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Waiver])],
})
export class WaiversModule {}