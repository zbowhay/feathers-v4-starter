import { expect } from 'chai';
import { isValidNonEmptyArray, isString, isValidNonEmptyString } from '../../src/libs/utils';

describe('utils', () => {
  describe('isString', () => {
    it('should return false', () => {
      expect(isString(true)).to.be.false;
      expect(isString(null)).to.be.false;
      expect(isString(undefined)).to.be.false;
      expect(isString(1)).to.be.false;
      expect(isString({})).to.be.false;
      expect(isString([])).to.be.false;
    });

    it('should return true', () => {
      expect(isString('')).to.be.true;
      expect(isString('not empty')).to.be.true;
    });
  });

  describe('isValidNonEmptyString', () => {
    it('should return false', () => {
      expect(isValidNonEmptyString('')).to.be.false;
    });

    it('should return true', () => {
      expect(isValidNonEmptyString('not empty')).to.be.true;
    });
  });

  describe('isValidNonEmptyArray', () => {
    it('should return false', () => {
      expect(isValidNonEmptyArray([])).to.be.false;
      expect(isValidNonEmptyArray({})).to.be.false;
      expect(isValidNonEmptyArray('')).to.be.false;
      expect(isValidNonEmptyArray(true)).to.be.false;
      expect(isValidNonEmptyArray(1)).to.be.false;
    });

    it('should return false', () => {
      expect(isValidNonEmptyArray(['not empty'])).to.be.true;
    });
  });
});
