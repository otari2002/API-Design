import { SourceType } from '@prisma/client';

export class CreateOutputDto {
  name: string;
  source: SourceType;
  validation?: string;
  flowId?: number;
}
