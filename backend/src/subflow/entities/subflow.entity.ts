import { Backend } from 'src/backend/entities/backend.entity';
import { SubFlowUsage } from 'src/subflowusage/entities/subflowusage.entity';
import { RequestMapping } from 'src/requestmapping/entities/requestmapping.entity';
import { SubInput } from 'src/subinput/entities/subinput.entity';
import { SubOutput } from 'src/suboutput/entities/suboutput.entity';

export class SubFlow {
  id: number;
  name: string;
  backendId: number;
  backendPath: string;
  ssl: boolean;
  backend?: Backend;
  subFlowUsages?: SubFlowUsage[];
  requestMappings?: RequestMapping[];
  subInputs?: SubInput[];
  subOutputs?: SubOutput[];
}
