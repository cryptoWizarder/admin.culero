/**
 *
 * @param {import('express').Request} req The request
 * @param {import('express').Response} res The response
 * @param {Function} next Go to the next middleware
 */

import { Request, Response } from 'express';
import { sendError, signToken, getPublic } from '../helpers/jwt.helper';
import axios from 'axios';
import debug from 'debug';
const log = debug('app:controllers:social');

const CLIENT_ID = '86e6qf8zqc75ve';
const CLIENT_SECRET = '2hpm6KXIBu4B0bO1';
const REDIRECT_URI = 'http://localhost:4000';
const SCOPES = 'r_liteprofile r_emailaddress r_network';

const getGithub = async (req: Request, res: Response) => {
    const { user } = req;
    try {
        log(user);
        const { data, status } = await axios.get(
            'https://api.github.com/users/Silver7Tech',
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );
        return res.status(200).json({ success: true, data: data });
    } catch (e) {
        return sendError(req, res, 400, 'Invalid EOS token:');
    }
};

const getLinkedin = async (req: Request, res: Response) => {
    try {
        const { data, status } = await axios.get(
            'https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile',
            {
                params: {
                    linkedin_url: 'https://www.linkedin.com/in/liu-yu-tong-091453284/',
                    include_skills: 'false'
                },
                headers: {
                    'X-RapidAPI-Key': 'a4700a72c1mshe8c9f650a88e606p1522f6jsn878fd1070408',
                    'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com'
                }
            },
        );
        return res.status(200).json({ success: true, data: data });
    } catch (e) {
        return sendError(req, res, 400, 'Invalid EOS token:');
    }
};

const authLinkedin = async (req: Request, res: Response) => {
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPES)}`;
    log(linkedInAuthUrl);
    return res.status(200).json({ success: true, linkedInAuthUrl });
}
export default {
    getGithub,
    getLinkedin,
    authLinkedin
};
