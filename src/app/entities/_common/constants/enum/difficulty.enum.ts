import { registerGraphQLEnum } from '@entities/_common/decorators/register-graphql-enum';

export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

registerGraphQLEnum(Difficulty, {
  name: 'Difficulty',
  filterTypeOptions: {
    name: 'Difficulty',
    filePath: __filename
  }
});
