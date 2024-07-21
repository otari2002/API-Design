import { PartialType } from '@nestjs/mapped-types';
import { CreateOutputDto } from './create-output.dto';

export class UpdateOutputDto extends PartialType(CreateOutputDto) {}
