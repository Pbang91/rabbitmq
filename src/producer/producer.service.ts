import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class ProducerService {
  private readonly channelWrapper: ChannelWrapper;
  private readonly CHANNEL: string;

  constructor(private readonly queueService: QueueService) {
    this.channelWrapper = this.queueService.channelWrapper;
    this.CHANNEL = this.queueService.CHANNEL;
  }

  async addQueue(msg: any) {
    try {
      console.log('Sending message to queue:', msg);
      await this.channelWrapper.sendToQueue(
        this.CHANNEL,
        Buffer.from(JSON.stringify(msg)),
      );
      console.log('Send Queue');
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
