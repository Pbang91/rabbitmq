import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class QueueService {
  public readonly channelWrapper: ChannelWrapper;
  public readonly CHANNEL: string;
  private readonly MQ_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.CHANNEL = this.configService.get<string>('RABBITMQ_CHANNEL');
    this.MQ_URL = `amqp://${this.configService.get<string>(
      'RABBITMQ_DEFAULT_USER',
    )}:${this.configService.get<string>('RABBITMQ_DEFAULT_PASS')}@localhost`;

    /**
     * amqp ref: https://amqp-node.github.io/amqplib/channel_api.html#overview
     *  - assertQueue ref: https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue
     */
    const connection = amqp.connect([this.MQ_URL]);
    this.channelWrapper = connection.createChannel({
      setup: async (channer: Channel) => {
        try {
          console.log('Asserting queue', this.CHANNEL);
          await channer.assertQueue(this.CHANNEL);
          console.log('Queue asserted', this.CHANNEL);
        } catch (e) {
          console.error('queue error', e);
          throw new InternalServerErrorException();
        }
      },
    });
  }
}
