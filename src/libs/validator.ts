import Ajv, { AnySchema } from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import logger from '../logger';

export function createAjv() {
  // NOTE: allErrors is required by ajv-errors
  return ajvErrors(
    addFormats(new Ajv({ allErrors: true }), [
      'date-time',
      'time',
      'date',
      'email',
      'hostname',
      'ipv4',
      'ipv6',
      'uri',
      'uri-reference',
      'uuid',
      'uri-template',
      'json-pointer',
      'relative-json-pointer',
      'regex',
    ])
  );
}

export const validator = createAjv();

export const addValidator = (schema: AnySchema, key: string) => {
  validator.addSchema(schema, key);
};

export const getValidator = <T>(key: string) => {
  const validate = validator.getSchema<T>(key);

  if (!validate) {
    logger.error(`ERROR retrieving schema!  key=${key}`);
    throw new Error(`SCHEMA_KEY_INVALID_${key}`);
  }

  return validate;
};
