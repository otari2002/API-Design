import { SourceType, ValueType } from '@prisma/client';

export class CreateInputDto {
  name: string;
  source: SourceType;
  type: ValueType;
  validation?: string;
  parentId?: number;
  flowId: number;
}
