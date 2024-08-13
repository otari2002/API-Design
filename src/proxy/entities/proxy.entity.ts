import { Flow } from '@prisma/client';

export class Proxy {
  id: number;
  name: string;
  description?: string;
  flows?: Flow[];
}
