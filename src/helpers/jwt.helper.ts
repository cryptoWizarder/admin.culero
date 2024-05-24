import jwt from 'jsonwebtoken';
import config from '../config';
import { Request, Response } from 'express';
import { pick } from 'lodash';

const jwtConfig = config.jwt;

/**
 * Create signed token
 * @param {object} payload the payload
 * @returns {string} the token
 */

export const signToken = async (id: string, payload: object = {}) => {
  return jwt.sign(
    {
      iss: jwtConfig.iss,
      aud: jwtConfig.aud,
      exp: Math.floor(Date.now() / 1000) + jwtConfig.exp,
      ...payload,
      sub: id,
    },
    jwtConfig.privateKey,
    {
      algorithm: 'ES512',
    },
  );
};

/**
 * Get the sanitized object
 * @param {Object} object The object
 * @param {'user'} type Object type
 * @returns sanitized object
 */
export const getPublic = (object: object, type = 'customer') => {
  switch (type) {
    case 'customer':
      return pick(object, [
        '_id',
        'username',
        'email',
        'firstname',
        'lastname',
        'picture',
        'active',
      ]);
    default:
      return object;
  }
};

export const sendError = (req: Request, res: Response, statusCode: number, message: string, err?: any) => {
  res.status(statusCode || 500).json({
    success: false,
    message: message || err?.message,
  });
};

