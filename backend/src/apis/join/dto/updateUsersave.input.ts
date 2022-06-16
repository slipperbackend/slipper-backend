import { InputType, PickType } from '@nestjs/graphql';
import { UpdateUserInput } from './updateUser.input';

@InputType()
export class UpdateUserSaveInput extends PickType(
  UpdateUserInput,
  ['nickname', 'imageUrl', 'introduce'],
  InputType,
) {}
