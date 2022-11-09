import knex from 'knex';
import _ from 'lodash';
import { Application } from './declarations';

export const postProcessResponse = (result: any, queryContext: any) => {
  const snakeToCamelCase = (row: { [key: string]: any }) => _.mapKeys(row, (v, k) => _.camelCase(k));

  return Array.isArray(result) ? result.map(row => snakeToCamelCase(row)) : snakeToCamelCase(result);
};

export const wrapIdentifier = (value: any, origImpl: any, _queryContext: any) => {
  const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  return origImpl(camelToSnakeCase(value));
};

export default function (app: Application): void {
  const { client, connection } = app.get('postgres');
  const db = knex({
    client,
    connection,
    postProcessResponse,
    wrapIdentifier,
  });

  app.set('knexClient', db);
}
