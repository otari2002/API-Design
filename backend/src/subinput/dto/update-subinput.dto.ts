import { PartialType } from '@nestjs/mapped-types';
import { CreateSubInputDto } from './create-subinput.dto';

export class UpdateSubInputDto extends PartialType(CreateSubInputDto) {}
