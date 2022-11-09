import { BadRequest, NotFound } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params } from '@feathersjs/feathers';
import { KnexServiceOptions, Service } from 'feathers-knex';
import { Application } from '../../declarations';
import { isValidNonEmptyArray, isValidNonEmptyString } from '../../libs/utils';
import { getValidator } from '../../libs/validator';
import logger from '../../logger';
import { User, UserCreate, UserUpdate, UserPatch } from './users.model';

export class Users extends Service<User> {
  table = 'users';

  constructor(options: Partial<KnexServiceOptions>, _app: Application) {
    super({ ...options, name: 'users' });
  }

  async find(_params?: Params): Promise<User[] | Paginated<User>> {
    return await this.Model.table(this.table).select('*');
  }

  async get(id: Id, _params?: Params): Promise<User> {
    if (!isValidNonEmptyString(id)) {
      throw new BadRequest('ARG_INVALID_USER_ID');
    }

    let user;
    try {
      user = await this.Model.table(this.table).select('*').where('id', id);
    } catch (err) {
      logger.error(`ERROR retrieving user!  id=${id}, err=${err}`);
      throw new Error('DB_ERROR_GET_USER');
    }

    if (!isValidNonEmptyArray(user)) {
      throw new NotFound('USER_NOT_FOUND');
    }

    return user[0];
  }

  async create(user: UserCreate, _params?: Params): Promise<User> {
    const validate = getValidator<UserCreate>('UserCreate');
    if (!validate(user)) {
      throw new BadRequest('ARG_INVALID_USER_PAYLOAD', validate.errors);
    }

    try {
      return (await this.Model.table<User>(this.table).insert(user).returning('*'))[0];
    } catch (err) {
      logger.error(`ERROR creating user!  user=${JSON.stringify(user)}, err=${err}`);
      throw new Error('DB_ERROR_CREATE_USER');
    }
  }

  async update(id: Id, user: UserUpdate, params?: Params): Promise<User> {
    if (!isValidNonEmptyString(id)) {
      throw new BadRequest('ARG_INVALID_USER_ID');
    }

    const validate = getValidator<UserUpdate>('UserUpdate');
    if (!validate(user)) {
      throw new BadRequest('ARG_INVALID_USER_PAYLOAD', validate.errors);
    }

    try {
      const existing = await this.get(id);
      const update: Partial<User> = {
        ...existing,
        firstName: null,
        lastName: null,
        ...user,
        updatedAt: new Date().toISOString(),
      };

      return (await this.Model.table<User>(this.table).update(update).where('id', id).returning('*'))[0];
    } catch (err) {
      logger.error(`ERROR updating user!  id=${id}, user=${JSON.stringify(user)}, err=${err}`);
      throw new Error('DB_ERROR_UPDATE_USER');
    }
  }

  async patch(id: Id, user: UserPatch, params?: Params): Promise<User> {
    if (!isValidNonEmptyString(id)) {
      throw new BadRequest('ARG_INVALID_USER_ID');
    }

    const validate = getValidator<UserPatch>('UserPatch');
    if (!validate(user)) {
      throw new BadRequest('ARG_INVALID_USER_PAYLOAD', validate.errors);
    }

    try {
      // make sure record exists
      await this.get(id);

      const update: Partial<User> = {
        ...user,
        updatedAt: new Date().toISOString(),
      };

      return (await this.Model.table<User>(this.table).update(update).where('id', id).returning('*'))[0];
    } catch (err) {
      logger.error(`ERROR patching user!  id=${id}, user=${JSON.stringify(user)}, err=${err}`);
      throw new Error('DB_ERROR_PATCH_USER');
    }
  }

  async remove(id: NullableId, params?: Params): Promise<User> {
    if (!isValidNonEmptyString(id)) {
      throw new BadRequest('ARG_INVALID_USER_ID');
    }

    try {
      return (await this.Model.table<User>(this.table).delete('*').where('id', id))[0];
    } catch (err) {
      logger.error(`ERROR removing user!  id=${id}, err=${err}`);
      throw new Error('DB_ERROR_REMOVE_USER');
    }
  }
}
