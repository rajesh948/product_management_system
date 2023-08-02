import { Controller, Post, Req } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post('send')
  sendmail(@Req() req) {
    return this.emailService.sendmail(req);
  }
}
