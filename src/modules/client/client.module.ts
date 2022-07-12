import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ClientController } from './client.controller';
import { Client } from './client.entity';
import { ClientService } from './client.service';
import { OAuthHostName } from './oauth-hostname.entity';

@Module({
  providers: [ClientService],
  exports: [ClientService],
  controllers: [ClientController],
  imports: [TypeOrmModule.forFeature([Client, OAuthHostName]), UserModule],
})
export class ClientModule {}
