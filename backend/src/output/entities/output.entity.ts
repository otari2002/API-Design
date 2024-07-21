import { Flow } from 'src/flow/entities/flow.entity';
import { SourceType } from '@prisma/client';

export class Output {
  id: number;
  name: string;
  source: SourceType;
  validation?: string;
  flowId?: number;
  Flow?: Flow;
}
