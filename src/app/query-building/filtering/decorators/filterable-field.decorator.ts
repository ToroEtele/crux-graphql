import { ReturnTypeFunc, ReturnTypeFuncValue } from 'type-graphql/build/typings/decorators/types';
import { Float, Int } from 'type-graphql';
import { kebabCase } from 'lodash';

import { ConnectionStringArrayFilterInput } from '../../connection/filtering/types/connection-string-array-filter.input';
import { ConnectionFloatArrayFilterInput } from '../../connection/filtering/types/connection-float-array-filter.input';
import { ConnectionIntArrayFilterInput } from '../../connection/filtering/types/connection-int-array-filter.input';
import { ConnectionBooleanFilterInput } from '../../connection/filtering/types/connection-boolean-filter.input';
import { ConnectionStringFilterInput } from '../../connection/filtering/types/connection-string-filter.input';
import { ConnectionFloatFilterInput } from '../../connection/filtering/types/connection-float-filter.input';
import { ConnectionDateFilterInput } from '../../connection/filtering/types/connection-date-filter.input';
import { ConnectionIntFilterInput } from '../../connection/filtering/types/connection-int-filter.input';

import { metadataManager, MetadataType } from '@common/metadata';
import { ReflectService } from '@app/reflection/reflect.service';

import { IFilterablePrimitiveFieldMetadata } from '../interfaces/filterable-primitive-field-metadata.interface';
import { IFilterableEnumFieldMetadata } from '../interfaces/filterable-enum-field-metadata.interface';
import { ReflectorPrimitiveType } from '@app/reflection/constants/primitive-type.enum';
import { FilterableFieldKind } from '../constants/filterable-field-kind.enum';

import { IFilterableUntypedFieldMetadata } from '../interfaces/filterable-untyped-field-metadata.interface';
import { SymbolKeysNotSupportedError } from '@errors/symbol-keys-not-supported.error';
import { InternalServerError } from '@errors/internal-server.error';

export interface IFilterableFieldArgs {
  returnTypeFunc?: ReturnTypeFunc;
  admin?: boolean;
  enum?: string;
  name?: string;
  untypedFilter?: boolean;
}

const returnTypeConnectionFilterMap = new Map<ReturnTypeFuncValue, Function>([
  [Boolean, ConnectionBooleanFilterInput],
  [Date, ConnectionDateFilterInput],
  [Float, ConnectionFloatFilterInput],
  [Int, ConnectionIntFilterInput],
  [String, ConnectionStringFilterInput]
]);

const reflectorPrimitiveTypeConnectionFilterMap = new Map<ReflectorPrimitiveType, Function>([
  [ReflectorPrimitiveType.Boolean, ConnectionBooleanFilterInput],
  [ReflectorPrimitiveType.Date, ConnectionDateFilterInput],
  [ReflectorPrimitiveType.Number, ConnectionFloatFilterInput],
  [ReflectorPrimitiveType.String, ConnectionStringFilterInput]
]);

function getConnectionFilterType(target: object, propertyKey: string, returnTypeFunc?: ReturnTypeFunc): Function {
  const reflectorPrimitiveType = ReflectService.getPropertyTypeName({ propertyKey, target });
  const returnType = returnTypeFunc?.();

  const connectionFilterType =
    (returnType && returnTypeConnectionFilterMap.get(returnType)) || reflectorPrimitiveTypeConnectionFilterMap.get(reflectorPrimitiveType);
  if (connectionFilterType) return connectionFilterType;

  if (Array.isArray(returnType)) {
    if (returnType[0] === String) return ConnectionStringArrayFilterInput;
    if (returnType[0] === Int) return ConnectionIntArrayFilterInput;
    if (returnType[0] === Float) return ConnectionFloatArrayFilterInput;

    throw new InternalServerError('Unsupported filterable array field!', {
      target,
      propertyKey,
      returnType
    });
  }

  throw new InternalServerError('Unsupported filterable field type!', {
    target,
    propertyKey,
    returnType
  });
}

export function FilterableField(args: IFilterableFieldArgs = {}): PropertyDecorator {
  function getFilterablePrimitiveFieldMetadata(target: object, propertyKey: string): IFilterablePrimitiveFieldMetadata {
    return {
      kind: FilterableFieldKind.Primitive,
      admin: args.admin ?? false,
      name: args.name ?? propertyKey,
      propertyKey,
      connectionFilterType: getConnectionFilterType(target, propertyKey, args.returnTypeFunc)
    };
  }

  function getUntypeFieldMetadata(_target: object, propertyKey: string): IFilterableUntypedFieldMetadata {
    return {
      kind: FilterableFieldKind.Untyped,
      admin: args.admin ?? false,
      name: args.name ?? propertyKey,
      propertyKey
    };
  }

  function getFilterableEnumFieldMetadata(_target: unknown, propertyKey: string): IFilterableEnumFieldMetadata {
    const connectionFilterName = `Connection${args.enum}Filter`;
    return {
      kind: FilterableFieldKind.Enum,
      name: args.name ?? propertyKey,
      propertyKey,
      connectionFilterType: `${connectionFilterName}Input`,
      connectionFilterFileName: `${kebabCase(connectionFilterName)}.input-type`,
      admin: args.admin ?? false
    };
  }

  return (target, propertyKey) => {
    if (typeof propertyKey === 'symbol') throw new SymbolKeysNotSupportedError();

    const filterableFieldMetadata = args.enum
      ? getFilterableEnumFieldMetadata(target, propertyKey)
      : args.untypedFilter
        ? getUntypeFieldMetadata(target, propertyKey)
        : getFilterablePrimitiveFieldMetadata(target, propertyKey);

    metadataManager.setPropertyMetadata(target.constructor, propertyKey, MetadataType.FieldFilterable, filterableFieldMetadata);
  };
}
