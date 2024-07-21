import { Flow } from 'src/flow/entities/flow.entity';
import { SubFlow } from 'src/subflow/entities/subflow.entity';
import { SourceType } from '@prisma/client';

export class RequestMapping {
  id: number;
  apigee?: string;
  backend?: string;
  type: SourceType;
  flowId?: number;
  subFlowId?: number;
  flow?: Flow;
  subFlow?: SubFlow;
}
