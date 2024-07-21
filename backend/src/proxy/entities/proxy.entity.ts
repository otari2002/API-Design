import { Flow } from 'src/flow/entities/flow.entity';

export class Proxy {
  id: number;
  name: string;
  description?: string;
  flow?: Flow[];
}
