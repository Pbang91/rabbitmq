import { Module } from '@nestjs/common';
import { SubscriberModule } from './subscriber/subscriber.module';
import { ProducerModule } from './producer/producer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProducerModule,
    SubscriberModule,
  ],
})
export class AppModule {}
