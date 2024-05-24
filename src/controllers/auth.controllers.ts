/**
 *
 * @param {import('express').Request} req The request
 * @param {import('express').Response} res The response
 * @param {Function} next Go to the next middleware
 */

import { Request, Response, NextFunction } from 'express';
import { sendError, signToken, getPublic } from '../helpers/jwt.helper';
import { jwtDecode } from "jwt-decode";
const { OAuth2Client } = require('google-auth-library');
import debug from 'debug';
import User from '../models/users.model';
import { GoogleTokenInterface } from '../interfaces';
const log = debug('app:controllers:auth');

const login = async (req: Request, res: Response) => {
  const { email, firstname, lastname, name, picture, type } = req.body;
  try {
    let user;
    user = await User.findOne({
      email: email,
    });
    if (!user) {
      user = await User.create({
        email: email,
        username: name,
        firstname: firstname,
        lastname: lastname,
        picture
      });
    }
    const jwtToken = user && (await signToken(user.id));
    return res.status(200).json({
      success: true,
      user: user && getPublic(user, 'user'),
      jwtToken,
    });
  } catch (err) {
    log('Error while login the user', err);
    return sendError(req, res, 400, 'Invalid user data');
  }
};


const logout = async (req: Request, res: Response) => {
  const { user } = req;
  try {
    log(user);
  } catch (e) {
    return sendError(req, res, 400, 'Invalid EOS token:');
  }

  return res.status(200).json({ success: true });
};

export default {
  login,
  logout,
};
