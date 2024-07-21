import { SourceType, ValueType } from '@prisma/client';

export class CreateSubInputDto {
  name: string;
  source: SourceType;
  type: ValueType;
  subFlowId: number;
}
