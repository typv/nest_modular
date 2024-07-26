import { Controller, Get } from '@nestjs/common';
import { SotatekUserService } from './sotatek-user.service';

@Controller('sotatek-user')
export class SotatekUserController {
  constructor(private readonly sotatekUserService: SotatekUserService) {}

  @Get()
  getHello(): string {
    return "hello sotatek-user";
  }
}
