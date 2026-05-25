import { Schema, Document, ToObjectOptions } from 'mongoose';

export function normalizeId(ret: Record<string, any>) {
  if (ret._id && typeof ret._id === 'object' && ret._id.toString) {
    if (typeof ret.id === 'undefined') {
      ret.id = ret._id.toString();
    }
  }
  
  if (typeof ret._id !== 'undefined') {
    delete ret._id;
  }
}

export function removePrivatePaths(ret: Record<string, any>, schema: Schema) {
  for (const path in schema.paths) {
    if (schema.paths[path].options && schema.paths[path].options.private) {
      if (typeof ret[path] !== 'undefined') {
        delete ret[path];
      }
    }
  }
}

export function removeVersion(ret: Record<string, any>) {
  if (typeof ret.__v !== 'undefined') {
    delete ret.__v;
  }
}

type MongoosePluginFunction<
  TDoc = any,
  TModel = any,
  TInstanceMethods = any,
  TQueryHelpers = any,
  TStaticMethods = any,
> = (
  schema: Schema<
    TDoc,
    TModel,
    TInstanceMethods,
    TQueryHelpers,
    any,
    any,
    any,
    any,
    any
  >,
  options?: any,
) => void;

export function toJSONPlugin<
  TDoc = any,
  TModel = any,
  TInstanceMethods = any,
  TQueryHelpers = any,
  TStaticMethods = any,
>(): MongoosePluginFunction<
  TDoc,
  TModel,
  TInstanceMethods,
  TQueryHelpers,
  TStaticMethods
> {
  return (schema: any): any => {
    let transform: any;

    if (schema.options.toJSON && schema.options.toJSON.transform) {
      transform = schema.options.toJSON.transform;
    }

    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
      transform: ((...args: any[]) => {
        const [doc, ret, options] = args as [
          Document | any,
          Record<string, any>,
          ToObjectOptions,
        ];
        removePrivatePaths(ret, schema);
        removeVersion(ret);
        normalizeId(ret);
        
        if (typeof transform === 'function') {
          return transform(doc, ret, options);
        }

        return ret;
      }) as any,
    });
  };
}
