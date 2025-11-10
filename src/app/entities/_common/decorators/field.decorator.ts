import { AdvancedOptions, ReturnTypeFunc } from 'type-graphql/build/typings/decorators/types';
import { Field as GraphQLField } from 'type-graphql';
import Container from 'typedi';

import { LogService } from '@common/logging/log.service';

import { AuthorizedAdmin } from '@access-control/authorization/authorized-admin.decorator';

import { FilterableField } from '../../../query-building/filtering/decorators/filterable-field.decorator';
import { SortableField } from '../../../query-building/sorting/decorators/sortable-field.decorator';

type FieldOptions = AdvancedOptions & { enum?: string; filterable?: boolean; sortable?: boolean; admin?: boolean };

interface IFieldDecorator {
  (options?: FieldOptions): PropertyDecorator;
  (returnTypeFunction: ReturnTypeFunc, options?: FieldOptions): PropertyDecorator;
  (returnTypeFuncOrOptions?: FieldOptions | ReturnTypeFunc, maybeOptions?: FieldOptions): PropertyDecorator;
}

class FieldDecorator {
  private readonly options: FieldOptions;
  private readonly returnTypeFunc?: ReturnTypeFunc;

  constructor(returnTypeFuncOrOptions?: FieldOptions | ReturnTypeFunc, maybeOptions?: FieldOptions) {
    if (typeof returnTypeFuncOrOptions === 'function') {
      this.returnTypeFunc = returnTypeFuncOrOptions;
      this.options = maybeOptions ?? {};
    } else {
      this.options = returnTypeFuncOrOptions ?? {};
    }
  }

  public getDecorator(): PropertyDecorator {
    return (target, propertyKey) => {
      try {
        this.getWrappedDecorator()(target, propertyKey);
      } catch (err: any) {
        Container.get(LogService).error(err);
        throw new Error('failed in decorator. exiting...');
      }

      if (this.isOptionEnabled('admin')) AuthorizedAdmin()(target, propertyKey);
      if (this.isOptionEnabled('filterable')) {
        FilterableField({
          enum: this.options.enum,
          admin: this.isOptionEnabled('admin'),
          name: this.options.name,
          returnTypeFunc: this.returnTypeFunc
        })(target, propertyKey);
      }
      if (this.isOptionEnabled('sortable')) SortableField({ name: this.options.name })(target, propertyKey);
    };
  }

  private getWrappedDecorator(): PropertyDecorator {
    if (this.returnTypeFunc) {
      return GraphQLField(this.returnTypeFunc, this.options);
    }
    return GraphQLField(this.options);
  }

  public isOptionEnabled(option: keyof FieldOptions): boolean {
    return this.options[option] === true;
  }
}

export const Field: IFieldDecorator = (returnTypeFuncOrOptions?: FieldOptions | ReturnTypeFunc, maybeOptions?: FieldOptions) =>
  new FieldDecorator(returnTypeFuncOrOptions, maybeOptions).getDecorator();
