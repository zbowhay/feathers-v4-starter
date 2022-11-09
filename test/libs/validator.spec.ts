import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { stub, restore, SinonStub } from 'sinon';
import Ajv from 'ajv';
import { Type } from '@sinclair/typebox';
import { validator, addValidator, getValidator, createAjv } from '../../src/libs/validator';

use(sinonChai);

describe('validator', () => {
  let addSchemaStub: SinonStub;

  beforeEach(() => {
    addSchemaStub = stub(Ajv.prototype, 'addSchema');
  });

  afterEach(() => {
    restore();
  });

  describe('addValidator', () => {
    it('should add a schema to the validator', () => {
      const schema = Type.Object({
        test: Type.Boolean(),
      });
      addValidator(schema, 'test-schema');

      expect(addSchemaStub).to.have.been.calledOnce;
    });
  });

  describe('getValidator', () => {
    const schemaKey = 'test-schema';

    before(() => {
      const schema = Type.Object({
        test: Type.Boolean(),
      });
      validator.addSchema(schema, schemaKey);
    });

    after(() => {
      validator.removeSchema(schemaKey);
    });

    it('should get a validator', () => {
      expect(getValidator(schemaKey)).to.not.be.undefined;
    });

    it('should throw if no schema is found', () => {
      const invalidKey = 'does-not-exist';

      expect(() => getValidator(invalidKey)).to.throw(`SCHEMA_KEY_INVALID_${invalidKey}`);
    });
  });

  describe('validator', () => {
    it('should be defined', () => {
      expect(validator).to.not.be.undefined;
    });
  });

  describe('createAjv', () => {
    it('should return an ajv instance', () => {
      expect(createAjv()).to.not.be.undefined;
    });
  });
});
