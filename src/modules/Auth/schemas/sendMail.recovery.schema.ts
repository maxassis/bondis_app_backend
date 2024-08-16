import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const SendMailRecoverySchema = z.object({
  email: z.string().email(),
});

export class SendMailRecoveryDTO extends createZodDto(SendMailRecoverySchema) {}
