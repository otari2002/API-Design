import { BackendType, SubFlow } from '@prisma/client';

export class Backend {
  id: number;
  name?: string;
  prodUrl?: string;
  noProdUrl?: string;
  type: BackendType;
  subFlow?: SubFlow[];
}
