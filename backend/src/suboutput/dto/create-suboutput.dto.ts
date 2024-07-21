import { SourceType, ValueType } from '@prisma/client';

export class CreateSubOutputDto {
  name: string;
  source: SourceType;
  type: ValueType;
  validation?: string;
  subFlowId?: number;
  parentId?: number;
}
