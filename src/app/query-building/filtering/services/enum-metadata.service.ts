import { Service } from 'typedi';

import { IEnumFilterData } from '../types/enum-filter-data.interface';
import { FileUtil } from '@utils/storage-system/file.util';

@Service({ global: true })
export class EnumsMetadataService {
  private readonly registeredEnums: IEnumFilterData[] = [];
  private readonly getPathFromSrc = FileUtil.getFullPathFrom('crux-graphql/src');

  public register(enumData: IEnumFilterData): void {
    enumData.filePath = this.getPathFromSrc(enumData.filePath);
    this.registeredEnums.push(enumData);
  }

  public get enums(): IEnumFilterData[] {
    return this.registeredEnums;
  }
}
