import { BackendType } from '@prisma/client';
import { SubFlow } from 'src/subflow/entities/subflow.entity';

export class Backend {
  id: number;
  name?: string;
  prodUrl?: string;
  noProdUrl?: string;
  type: BackendType;
  subFlow?: SubFlow[];
}
