import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ConfirmCodeUseCase {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async confirmCode(code: string, email: string) {
    const cachedCode = await this.cacheManager.get<string>(`code-${email}`);

    if (!cachedCode || code !== cachedCode) {
      throw new HttpException('Codigo invalido', HttpStatus.UNAUTHORIZED);
    }

    await this.cacheManager.del(`code-${email}`);

    return { message: `O codigo ${code}, esta correto` };
  }
}
