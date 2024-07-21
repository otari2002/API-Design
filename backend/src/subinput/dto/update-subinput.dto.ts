import { PartialType } from '@nestjs/mapped-types';
import { CreateSubinputDto } from './create-subinput.dto';

export class UpdateSubinputDto extends PartialType(CreateSubinputDto) {}
