import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountRecoveryCodeTemplate } from 'src/templates-email/account.recovery.code.template';

@Injectable()
export class SendMailRecoveryUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  async sendMailRecovery(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const nanoid = customAlphabet('0123456789', 6);
    const code = nanoid();

    try {
      await this.cacheManager.set(`code-${email}`, code, 300000);

      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Confirme seu email',
        html: AccountRecoveryCodeTemplate(user.name, code),
      });
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw new InternalServerErrorException();
    }

    return { message: 'Email enviado com sucesso' };
  }
}
