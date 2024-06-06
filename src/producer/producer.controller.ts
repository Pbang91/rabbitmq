import { Body, Controller, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('/producer')
export class ProducerController {
  constructor(private readonly service: ProducerService) {}

  @Post()
  async requestAny(@Body() msg: any) {
    await this.service.addQueue(msg);
  }
}
