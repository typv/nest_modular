import { Module } from '@nestjs/common';
import { SotatekUserService } from './sotatek-user.service';
import { SotatekUserController } from './sotatek-user.controller';

@Module({
  controllers: [SotatekUserController],
  providers: [SotatekUserService],
})
export class SotatekUserModule {}
