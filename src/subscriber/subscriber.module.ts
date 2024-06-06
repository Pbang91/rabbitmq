import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [SubscriberService],
})
export class SubscriberModule {}
