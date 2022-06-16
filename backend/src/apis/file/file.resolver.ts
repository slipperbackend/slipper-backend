import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  @Mutation(() => [String])
  uploadBoardImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    const type = 'board';
    return this.fileService.upload({ files, type });
  }

  @Mutation(() => [String])
  uploadProfileImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    const type = 'profile';
    return this.fileService.upload({ files, type });
  }

  @Mutation(() => [String])
  uploadBusinessImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    const type = 'business';
    return this.fileService.upload({ files, type });
  }
}
