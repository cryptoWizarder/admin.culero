import User from '../models/users.model';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../helpers/jwt.helper';
import jwt from 'jsonwebtoken';
import config from '../config'


/**
 * Set the default format to json
 * @param {import('express').Request} req The request
 * @param {import('express').Response} res The response
 * @param {Function} next Go to the next middleware
 */
const setDefaultMime = async function setDefaultMime(req: Request, res: Response, next: NextFunction) {
  if (req.get('accept') === '*/*') res.type('json');
  return next();
};

/**
 * Set the default format to json
 * @param {import('express').Request} req The request
 * @param {import('express').Response} res The response
 * @param {Function} next Go to the next middleware
 */

const loadUser = async function loadUser(req: Request, res: Response, next: NextFunction) {
  const token = req.get('authorization') || '';

  if (!token) return next();

  const [type, value] = token.split(' ');

  if (type !== 'Bearer') return next();

  let decrypted;

  try {
    decrypted = jwt.verify(value, config.jwt.publicKey, {
      algorithms: ['ES512'],
      audience: config.jwt.aud,
      issuer: config.jwt.iss,
    });

  } catch (e) {
    return sendError(req, res, 401, 'Invalid access token');
  }

  const user = await User.findOne({
    _id: decrypted.sub,
  });
  if (!user) return sendError(req, res, 401, 'Invalid access token');
  req.user = user;
  return next();
};

/**
 * Check if the current user is authenticated
 * @param {import('express').Request} req The request
 * @param {import('express').Response} res The response
 * @param {Function} next Go to the next middleware
 */
const isAuthenticated = async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const { user } = req;

  if (!user) {
    return sendError(req, res, 401, 'Not authenticated');
  }

  return next();
};

export { setDefaultMime, loadUser, isAuthenticated };