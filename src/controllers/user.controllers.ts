/**
 *
 * @param {import('express').Request} req The request
 * @param {import('express').Response} res The response
 * @param {Function} next Go to the next middleware
 */

import { Request, Response } from 'express';
import { sendError, getPublic } from '../helpers/jwt.helper';
import debug from 'debug';
import User from '../models/users.model';
const log = debug('app:controllers:social');

const getUserBySearch = async (req: Request, res: Response) => {
    const { search_key } = req.body;
    try {
        const data = await User.aggregate([
            {
                $match: {
                    $or: [
                        { email: { $regex: new RegExp(search_key, 'i') } },
                        { username: { $regex: new RegExp(search_key, 'i') } },
                        { firstname: { $regex: new RegExp(search_key, 'i') } },
                        { lastname: { $regex: new RegExp(search_key, 'i') } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1, // Exclude the _id field
                    username: 1, // Include the username field
                    picture: 1  // Include the picture field
                }
            },
            {
                $sort: { createdAt: -1 } // Sorting by creation date, newest first
            },
        ]);
        return res.status(200).json({ success: true, users: data });
    } catch (e) {
        return sendError(req, res, 400, 'Invalid Data');
    }
};

const getUserByID = async (req: Request, res: Response) => {
    const { user_id } = req.body;
    try {
        const user = await User.findById(user_id);
        return res.status(200).json({
            success: true,
            user: user && getPublic(user, 'user'),
        });
    } catch (err) {
        log('Error while login the user', err);
        return sendError(req, res, 400, 'Invalid user data');
    }
};


export default {
    getUserBySearch,
    getUserByID
}