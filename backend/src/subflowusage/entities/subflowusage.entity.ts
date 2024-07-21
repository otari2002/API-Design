import { Flow } from 'src/flow/entities/flow.entity';
import { SubFlow } from 'src/subflow/entities/subflow.entity';

export class SubFlowUsage {
  id: number;
  flowId: number;
  subFlowId: number;
  isConditionnal: boolean;
  condition?: string;
  order: number;
  Flow?: Flow;
  SubFlow?: SubFlow;
}
