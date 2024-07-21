import { BackendType } from '@prisma/client';

export class CreateBackendDto {
  name?: string;
  prodUrl?: string;
  noProdUrl?: string;
  type: BackendType;
}
