import { SubFlow } from 'src/subflow/entities/subflow.entity';
import { SourceType, ValueType } from '@prisma/client';

export class SubOutput {
  id: number;
  name?: string;
  source: SourceType;
  type: ValueType;
  validation?: string;
  subFlowId?: number;
  parentId?: number;
  subFlow?: SubFlow;
  parent?: SubOutput;
  children?: SubOutput[];
}
