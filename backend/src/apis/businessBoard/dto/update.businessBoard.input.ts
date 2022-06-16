import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBusinessBoardInput } from './create.businessBoard.input';

@InputType()
export class updateBusinessBoardInput extends PartialType(
  CreateBusinessBoardInput,
) {}
