import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suppression } from '../../entities/suppression.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suppression])],
})
export class SuppressionsModule {}