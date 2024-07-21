import { SubFlow } from 'src/subflow/entities/subflow.entity';
import { SourceType, ValueType } from '@prisma/client';

export class SubInput {
  id: number;
  name: string;
  source: SourceType;
  type: ValueType;
  subFlowId: number;
  subFlow?: SubFlow;
}
