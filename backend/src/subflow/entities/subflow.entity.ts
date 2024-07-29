import { Backend } from 'src/backend/entities/backend.entity';
import { RequestMapping, SubFlowUsage, SubInput, SubOutput } from '@prisma/client';

export class SubFlow {
  id: number;
  name: string;
  backendId: number;
  backendPath: string;
  ssl: boolean;
  backend: Backend;
  subFlowUsages?: SubFlowUsage[];
  requestMappings?: RequestMapping[];
  subInputs?: SubInput[];
  subOutputs?: SubOutput[];
}
