import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly userService: UserService) {}

  async sendmail(req) {
    const userEmail = req.body.email;

    if (!userEmail) {
      throw new BadRequestException('Provide Email');
    }
    const emailExist = await this.userService.findOneByEmail(userEmail);

    if (!emailExist) {
      throw new NotFoundException('Email Not Found');
    }

    const randomNumber = Math.floor(1000000 + Math.random() * 999999);
    req.session.otp = randomNumber;

    const config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    };

    const transporter = nodeMailer.createTransport(config);

    const message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'forget password !!',
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Product Management System</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Hello, Use the following OTP to complete your Forgot Password procedures. OTP is valid for 5 minutes</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${randomNumber}</h2>
            <p style="font-size:0.9em;">Regards,<br />PMS</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>PMS portal</p>
              <p>Ahmadabad</p>
            </div>
          </div>
        </div> `,
    };
    const response = await transporter.sendMail(message);
    if (response.accepted) return { message: 'Email Send Successfully' };
  }
}
