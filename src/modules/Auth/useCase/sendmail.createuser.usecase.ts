import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateUserTemplate } from 'src/templates-email/create.user.code.template';

@Injectable()
export class SendMailUseCase {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(name: string, email: string) {
    const nanoid = customAlphabet('0123456789', 6);
    const code = nanoid();

    try {
      await this.cacheManager.set(`code-${email}`, code, 300000);

      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Confirme seu email',
        html: CreateUserTemplate(name, code),
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new InternalServerErrorException();
    }

    return { message: 'Email enviado com sucesso' };
  }
}
