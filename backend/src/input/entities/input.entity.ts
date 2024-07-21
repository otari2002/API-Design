import { Flow } from 'src/flow/entities/flow.entity';
import { SourceType, ValueType } from '@prisma/client';

export class Input {
  id: number;
  name: string;
  source: SourceType;
  type: ValueType;
  validation?: string;
  parentId?: number;
  flowId: number;
  flow?: Flow;
  parent?: Input;
  children?: Input[];
}
