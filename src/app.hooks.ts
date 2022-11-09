// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { GeneralError } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';

export const errorHandler = (ctx: HookContext) => {
  if (ctx.error) {
    const error = ctx.error;

    // not an http error
    if (!error.code) {
      const newError = new GeneralError('INTERNAL_SERVER_ERROR');
      ctx.error = newError;
      return ctx;
    }

    if (error.code === 404 || process.env.NODE_ENV === 'production') {
      error.stack = null;
    }

    return ctx;
  }
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [errorHandler],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
