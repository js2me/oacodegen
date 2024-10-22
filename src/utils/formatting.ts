import { typeGuard } from 'yammies/type-guard';

export const stringifyValue = (value: any) => {
  if (typeGuard.isObject(value)) return JSON.stringify(value);

  if (typeGuard.isString(value)) return `"${value}"`;

  if (value != null && 'toString' in value) {
    return value.toString();
  }

  return value;
};
