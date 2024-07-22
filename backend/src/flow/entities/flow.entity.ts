import { Proxy } from 'src/proxy/entities/proxy.entity';
import { Input } from 'src/input/entities/input.entity';
import { Output } from 'src/output/entities/output.entity';
import { SubFlowUsage } from 'src/subflowusage/entities/subflowusage.entity';
import { RequestMapping } from 'src/requestmapping/entities/requestmapping.entity';
import { ApigeeInstance } from '@prisma/client';

export class Flow {
  id: number;
  name: string;
  subject?: string;
  description?: string;
  proxyId: number;
  instanceApigee?: ApigeeInstance;
  domain: string;
  verb: string;
  path: string;
  Proxy: Proxy;
  Input?: Input[];
  Output?: Output[];
  SubFlowUsage?: SubFlowUsage[];
  RequestMapping?: RequestMapping[];
}
