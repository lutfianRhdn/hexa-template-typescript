import { EntityMapConfig } from '../../adapters/postgres/repositories/Repository';

export const UserMapConfig: EntityMapConfig = {
  fields: [
    { dbField: 'id', entityField: 'id' },
    { dbField: 'name', entityField: 'name' },
    { dbField: 'username', entityField: 'username' },
    { dbField: 'password', entityField: 'password' },
    { dbField: 'role', entityField: 'role' },
    { dbField: 'isActive', entityField: 'isActive' },
    { dbField: 'createdAt', entityField: 'createdAt' },
    { dbField: 'updatedAt', entityField: 'updatedAt' },
  ],
  relations: [],
};
