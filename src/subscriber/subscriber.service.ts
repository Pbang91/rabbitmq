import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class SubscriberService implements OnModuleInit {
  private readonly channelWrapper: ChannelWrapper;
  private readonly CHANNEL: string;

  constructor(private readonly queueService: QueueService) {
    this.channelWrapper = this.queueService.channelWrapper;
    this.CHANNEL = this.queueService.CHANNEL;
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.CHANNEL);
        await channel.consume(this.CHANNEL, async (msg: any) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString());
            console.log('Received message', content);
            channel.ack(msg);
          }
        });
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
