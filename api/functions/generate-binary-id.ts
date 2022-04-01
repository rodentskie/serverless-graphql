import crypto from 'crypto';

export enum EntityType {
  Account = 0,
  Product = 1,
}

export function generateId(type: EntityType): Buffer {
  return Buffer.concat([Buffer.from([type]), crypto.randomBytes(15)]);
}
