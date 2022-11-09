import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import app from '../../src/app';
import { getValidator } from '../../src/libs/validator';
import { Users } from '../../src/services/users/users.class';
import { User, UserCreate } from '../../src/services/users/users.model';
import moment from 'moment';
import { SinonSpy, spy, SinonStub, stub, restore, resetHistory } from 'sinon';
import { randomUUID } from 'crypto';
import { BadRequest, GeneralError, NotFound } from '@feathersjs/errors';
import logger from '../../src/logger';

use(sinonChai);
use(chaiAsPromised);

describe('users service', () => {
  describe('service initialization', () => {
    it('registered the service', () => {
      const service = app.service('users');

      expect(service).to.exist;
    });

    it('loaded the users validators', () => {
      let errs: (Error | undefined)[];

      const schemas = ['UserCreate', 'UserUpdate', 'UserPatch'];
      errs = schemas.map(schema => {
        let err: Error | undefined;
        try {
          getValidator(schema);
        } catch (error) {
          err = error as any;
        }

        return err;
      });

      errs.forEach(err => {
        expect(err).to.be.undefined;
      });
    });
  });

  describe('users class', () => {
    let service: Users;
    let testUser: User;
    let table: string;
    let tableStub: SinonStub;
    let errorSpy: SinonSpy;

    before(() => {
      service = app.service('users');
      table = service.table;
    });

    beforeEach(async () => {
      await service.Model.table(table).delete();

      const user: Partial<User> = {
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      testUser = (await service.Model.table(table).insert<User>(user).returning('*'))[0];

      // stubs
      tableStub = stub(service.Model, 'table');
      tableStub.callThrough();

      // spies
      errorSpy = spy(logger, 'error');
    });

    afterEach(async () => {
      restore();
      resetHistory();

      await service.Model.table(table).delete();
    });

    describe('find', () => {
      it('should find the testUser', async () => {
        return expect(service.find()).to.eventually.eql([testUser]);
      });
    });

    describe('get', () => {
      it('should get user by id', async () => {
        return expect(service.get(testUser.id)).to.eventually.eql(testUser);
      });

      it('should throw if given an invalid id', async () => {
        return expect(service.get('')).to.eventually.be.rejectedWith(BadRequest, 'ARG_INVALID_USER_ID');
      });

      it('should throw if an error is thrown from the db', async () => {
        tableStub.rejects('UNEXPECTED_ERROR');

        let err: Error | undefined;
        try {
          await service.get(testUser.id);
        } catch (error) {
          err = error as any;
        }

        expect(err).to.be.an.instanceOf(GeneralError);
        expect(errorSpy.args[0][0]).to.include('ERROR retrieving user!');
      });

      it('should return NotFound if the user does not exist', async () => {
        return expect(service.get(randomUUID())).to.eventually.be.rejectedWith(NotFound, 'USER_NOT_FOUND');
      });
    });

    describe('create', async () => {
      it('should create a new user', async () => {
        const userPayload: UserCreate = {
          email: 'someNewUser@test.com',
        };

        const newUser = await service.create(userPayload);

        expect(newUser.id).to.not.be.undefined;
        expect(newUser.email).to.eql(userPayload.email);
        expect(newUser.firstName).to.be.null;
        expect(newUser.lastName).to.be.null;
        expect(moment(newUser.createdAt).isValid()).to.be.true;
        expect(moment(newUser.updatedAt).isValid()).to.be.true;
      });

      it('should throw if given an invalid payload', async () => {
        return expect(service.create({} as any)).to.eventually.be.rejectedWith('ARG_INVALID_USER_PAYLOAD');
      });

      it('should throw if a user with the same email already exists', async () => {
        let err: Error | undefined;
        try {
          await service.create({ email: testUser.email });
        } catch (error) {
          err = error as any;
        }

        expect(err).to.be.an.instanceOf(GeneralError);
        expect(errorSpy.args[0][0]).to.include('ERROR creating user!');
      });
    });

    describe('update', () => {
      it('should throw if given an invalid id', async () => {
        return expect(service.update('', {} as any)).to.eventually.be.rejectedWith(BadRequest, 'ARG_INVALID_USER_ID');
      });

      it('should throw if given an invalid user', async () => {
        return expect(service.update(randomUUID(), { email: 'not valid' } as any)).to.eventually.be.rejectedWith(
          BadRequest,
          'ARG_INVALID_USER_PAYLOAD'
        );
      });

      it('should throw if id does not exist', async () => {
        let err: Error | undefined;
        try {
          await service.update(randomUUID(), { email: 'test@test.com' });
        } catch (error) {
          err = error as any;
        }

        expect(err).to.be.an.instanceOf(GeneralError);
        expect(errorSpy.args[0][0]).to.include('ERROR updating user!');
      });

      it('should update user', async () => {
        const email = 'newEmail@email.com';
        const updated = await service.update(testUser.id, { email });

        expect(updated.id).to.eql(testUser.id);
        expect(updated.email).to.eql(email);
        expect(updated.firstName).to.be.null;
        expect(updated.lastName).to.be.null;
        expect(updated.createdAt).to.eql(testUser.createdAt);
        expect(moment(updated.updatedAt).isAfter(updated.createdAt)).to.be.true;
      });
    });

    describe('patch', () => {
      it('should throw if given an invalid id', async () => {
        return expect(service.patch('', {} as any)).to.eventually.be.rejectedWith(BadRequest, 'ARG_INVALID_USER_ID');
      });

      it('should throw if given an invalid user', async () => {
        return expect(service.patch(randomUUID(), { email: 'not valid' } as any)).to.eventually.be.rejectedWith(
          BadRequest,
          'ARG_INVALID_USER_PAYLOAD'
        );
      });

      it('should throw if id does not exist', async () => {
        let err: Error | undefined;
        try {
          await service.patch(randomUUID(), { email: 'test@test.com' });
        } catch (error) {
          err = error as any;
        }

        expect(err).to.be.an.instanceOf(GeneralError);
        expect(errorSpy.args[0][0]).to.include('ERROR patching user!');
      });

      it('should patch user', async () => {
        const firstName = 'some new name';
        const patch = await service.patch(testUser.id, { firstName });

        expect(patch.id).to.eql(testUser.id);
        expect(patch.email).to.eql(testUser.email);
        expect(patch.firstName).to.eql(firstName);
        expect(patch.lastName).to.eql(testUser.lastName);
        expect(patch.createdAt).to.eql(testUser.createdAt);
        expect(moment(patch.updatedAt).isAfter(patch.createdAt)).to.be.true;
      });
    });

    describe('remove', () => {
      it('should throw if given an invalid id', async () => {
        return expect(service.remove('')).to.eventually.be.rejectedWith(BadRequest, 'ARG_INVALID_USER_ID');
      });

      it('should throw if an error is thrown from the db', async () => {
        tableStub.rejects('UNEXPECTED_ERROR');

        let err: Error | undefined;
        try {
          await service.remove(testUser.id);
        } catch (error) {
          err = error as any;
        }

        expect(err).to.be.an.instanceOf(GeneralError);
        expect(errorSpy.args[0][0]).to.include('ERROR removing user!');
      });

      it('should remove user', async () => {
        return expect(service.remove(testUser.id)).to.eventually.eql(testUser);
      });
    });
  });
});
