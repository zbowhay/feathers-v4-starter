import { Static, Type } from '@sinclair/typebox';
import { addValidator } from '../../libs/validator';

// User Models
export const User = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' }),
    firstName: Type.Optional(Type.Union([Type.Null(), Type.String()])),
    lastName: Type.Optional(Type.Union([Type.Null(), Type.String()])),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { additionalProperties: false }
);
export const UserCreate = Type.Pick(User, ['email', 'firstName', 'lastName']);
export const UserUpdate = UserCreate;
export const UserPatch = Type.Partial(UserCreate);

// Database user
export type User = Static<typeof User>;

// User Payloads
export type UserCreate = Static<typeof UserCreate>;
export type UserUpdate = Static<typeof UserUpdate>;
export type UserPatch = Static<typeof UserPatch>;

// User Validators
addValidator(UserCreate, 'UserCreate');
addValidator(UserUpdate, 'UserUpdate');
addValidator(UserPatch, 'UserPatch');
