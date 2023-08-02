import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [UserModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
