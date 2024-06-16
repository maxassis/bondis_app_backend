import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    private readonly supabase: Supabase,
    private readonly prisma: PrismaService,
  ) {}

  async deleteAvatar(file: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.client.storage
        .from('avatars')
        .remove([file]);

      if (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      console.log('File deleted successfully:', data);
    } catch (error) {
      //
      if (error instanceof Error) {
        console.error('Error deleting file:', error.message);
      } else {
        console.error('error:', error);
      }
    }
  }
}
