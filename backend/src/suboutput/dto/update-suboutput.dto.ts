import { PartialType } from '@nestjs/mapped-types';
import { CreateSuboutputDto } from './create-suboutput.dto';

export class UpdateSuboutputDto extends PartialType(CreateSuboutputDto) {}
