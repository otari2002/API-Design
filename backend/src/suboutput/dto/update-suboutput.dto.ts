import { PartialType } from '@nestjs/mapped-types';
import { CreateSubOutputDto } from './create-suboutput.dto';

export class UpdateSubOutputDto extends PartialType(CreateSubOutputDto) {}
