/**
 *
 * @param {import('express').Request} req The request
 * @param {import('express').Response} res The response
 * @param {Function} next Go to the next middleware
 */

import { Request, Response } from 'express';
import { sendError, signToken, getPublic } from '../helpers/jwt.helper';
import Review from '../models/review.model';
import debug from 'debug';
import axios from 'axios';
import { parseGithubLink, parseSocialLink, verifyGithub, verifyLinkedin } from '../helpers/socialVerify.helper';
import { PLATFOMR_TYPES } from '../helpers/constants.helper';
import User from '../models/users.model';
const log = debug('app:controllers:review');

const getRecentReview = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find().populate('reviewed_user_id', 'email username picture avg_score').populate('review.reviewer_id', 'email username picture').limit(10).sort({ 'createdAt': -1 });
        return res.status(200).json({ success: true, reviews });
    } catch (e) {
        return sendError(req, res, 400, 'Invalid data');
    }
};

const getReviewByUser = async (req: Request, res: Response) => {
    const { skip, index, reviewed_user_id } = req.body;
    try {
        const reviews = await Review.findOne({ reviewed_user_id })
            .populate('review.reviewer_id', 'email username picture').limit(skip).skip((index - 1) * skip).sort({ 'createdAt': 1 });
        const count = await Review.find({ reviewed_user_id })
            .populate('review.reviewer_id').countDocuments();
        return res.status(200).json({ success: true, reviews, count });
    } catch (e) {
        return sendError(req, res, 400, 'Invalid data');
    }
};

const getReviewByID = async (req: Request, res: Response) => {
    const { review_id } = req.body;
    try {
        const data = await Review.findById(review_id).sort({ 'createdAt': -1 });
        return res.status(200).json({ success: true, data });
    } catch (e) {
        return sendError(req, res, 400, 'Invalid EOS token:');
    }
};

const editReview = async (req: Request, res: Response) => {
    const { review_id, text, score, anonymous_user, reviewed_user_id } = req.body;
    try {
        const update = {
            $set: {
                'review.$.content': text,
                'review.$.score': score,
                'review.$.anonymous_user': anonymous_user,
                'review.$.date': new Date(),
            }
        };

        // if (anonymous_user) {
        //     update.$unset = { 'review.$.reviewer_id': "" }; // Unset reviewer_id
        // }

        const result = await Review.updateOne(
            { 'review._id': review_id },
            update
        );

        if (result) {
            // Update Avg score after edit review
            const reviewed_user = await Review.findOne({ reviewed_user_id });
            if (reviewed_user) {
                let score_sum = 0;
                for (let index = 0; index < reviewed_user.review.length; index++) {
                    score_sum += Number(reviewed_user.review[index].score);
                }
                const avgscore = score_sum / reviewed_user.review.length
                const reviewed_user_in = await User.findById(reviewed_user_id);
                if (reviewed_user_in) {
                    reviewed_user_in.avg_score = avgscore;
                    await reviewed_user_in.save()
                }
            }
            return res.status(200).json({ success: true });
        } else {
            return sendError(req, res, 403, 'No review found with the given id');
        }
    } catch (error) {
        console.error('Error updating review:', error);
        return sendError(req, res, 500, 'Internal server error');
    }
};

const deleteReview = async (req: Request, res: Response) => {
    const { review_id, reviewed_user_id } = req.body;
    try {
        const result = await Review.updateOne(
            { "review._id": review_id },
            { $pull: { review: { _id: review_id } } }
        );
        if (result) {
            // Update Avg score after delete review
            const reviewed_user = await Review.findOne({ reviewed_user_id });
            if (reviewed_user) {
                let score_sum = 0;
                for (let index = 0; index < reviewed_user.review.length; index++) {
                    score_sum += Number(reviewed_user.review[index].score);
                }
                const avgscore = score_sum / reviewed_user.review.length
                const reviewed_user_in = await User.findById(reviewed_user_id);
                if (reviewed_user_in) {
                    reviewed_user_in.avg_score = avgscore;
                    await reviewed_user_in.save()
                }
            }
            return res.status(200).json({ success: true });
        } else {
            return sendError(req, res, 403, 'No review found with the given id');
        }
    } catch (error) {
        return sendError(req, res, 500, 'Internal server error');
    }
};

const addReview = async (req: Request, res: Response) => {
    const { reviewer_id, text, score, anonymous_user, reviewed_user_id } = req.body;
    try {
        const reviewed_user = await Review.findOne({ reviewed_user_id });
        if (reviewed_user) {
            let score_sum = 0;
            for (let index = 0; index < reviewed_user.review.length; index++) {
                score_sum += Number(reviewed_user.review[index].score);
            }
            const avgscore = (score_sum + Number(score)) / (reviewed_user.review.length + 1)
            const reviewed_user_in = await User.findById(reviewed_user_id);
            if (reviewed_user_in) {
                reviewed_user_in.avg_score = avgscore;
                await reviewed_user_in.save()
            }
            if (anonymous_user) {
                reviewed_user.review.unshift({ content: text, score, anonymous_user, date: new Date() });
            }
            else {
                reviewed_user.review.unshift({ content: text, score, reviewer_id, anonymous_user, date: new Date() });
            }
            await reviewed_user.save();
        } else {
            if (anonymous_user) {
                await Review.create({ reviewed_user_id, review: [{ content: text, score, anonymous_user, date: new Date() }] });
            } else {
                await Review.create({ reviewed_user_id, review: [{ content: text, score, reviewer_id, anonymous_user, date: new Date() }] });
            }

            const reviewed_user_in = await User.findById(reviewed_user_id);
            if (reviewed_user_in) {
                reviewed_user_in.avg_score = score;
                await reviewed_user_in.save()
            }
        }

        return res.status(200).json({ success: true });
    } catch (e) {
        return sendError(req, res, 400, 'Error while adding review.');
    }
};

const addReviewByLink = async (req: Request, res: Response) => {
    const { reviewer_id, text, score, anonymous_user, platform, link } = req.body;

    try {
        if (platform === PLATFOMR_TYPES.GITHUB) {
            try {
                const data = await verifyGithub(parseGithubLink(link))

                if (data.status === 200) {

                    const github_link = data.data.html_url;
                    const picture = data.data.avatar_url;
                    const username = data.data.name;

                    const reviewer = await User.findOne({ github: github_link });

                    if (reviewer) {
                        const reviewed_user = await Review.findOne({ reviewed_user_id: reviewer._id });

                        if (reviewed_user) {
                            let score_sum = 0;
                            for (let index = 0; index < reviewed_user.review.length; index++) {
                                score_sum += Number(reviewed_user.review[index].score);
                            }
                            const avgscore = (score_sum + Number(score)) / (reviewed_user.review.length + 1)
                            reviewer.avg_score = avgscore;
                            await reviewer.save()
                            if (anonymous_user) {
                                reviewed_user.review.unshift({ content: text, score, anonymous_user, date: new Date() });
                            }
                            else {
                                reviewed_user.review.unshift({ content: text, score, reviewer_id, anonymous_user, date: new Date() });
                            }
                            await reviewed_user.save();
                        }

                    } else {
                        const reviewed_user = await User.create({ github: github_link, username, picture, avg_score: score });
                        if (anonymous_user) {
                            await Review.create({ reviewed_user_id: reviewed_user._id, review: [{ content: text, score, anonymous_user }] });
                        } else {
                            await Review.create({ reviewed_user_id: reviewed_user._id, review: [{ content: text, score, reviewer_id: reviewer_id, anonymous_user }] });
                        }

                    }
                }
            } catch (e) {
                return sendError(req, res, 400, 'Your Github URL is not valid.');
            }
        } else if (platform === PLATFOMR_TYPES.LINKEDIN) {
            try {
                const data = await verifyLinkedin(link)

                if (data.status === 200) {
                    const linkedin_link = parseSocialLink(link);
                    const picture = data.data.data.profile_image_url;
                    const username = data.data.data.full_name;
                    const firstname = data.data.data.full_name;
                    const lastname = data.data.data.last_name;
                    const email = data.data.data.email;
                    const reviewer = await User.findOne({ linkedin: linkedin_link });
                    if (reviewer) {
                        const reviewed_user = await Review.findOne({ reviewed_user_id: reviewer._id });
                        if (reviewed_user) {
                            let score_sum = 0;
                            for (let index = 0; index < reviewed_user.review.length; index++) {
                                score_sum += Number(reviewed_user.review[index].score);
                            }
                            const avgscore = (score_sum + Number(score)) / (reviewed_user.review.length + 1)
                            reviewer.avg_score = avgscore;
                            await reviewer.save()
                            if (anonymous_user) {
                                reviewed_user.review.unshift({ content: text, score, anonymous_user, date: new Date() });
                            }
                            else {
                                reviewed_user.review.unshift({ content: text, score, reviewer_id, anonymous_user, date: new Date() });
                            }
                            await reviewed_user.save();
                        }

                    } else {
                        const reviewed_user = await User.create({ linkedin: linkedin_link, firstname, lastname, username, picture, avg_score: score });
                        if (anonymous_user) {
                            await Review.create({ reviewed_user_id: reviewed_user._id, review: [{ content: text, score, anonymous_user }] });
                        } else {
                            await Review.create({ reviewed_user_id: reviewed_user._id, review: [{ content: text, score, reviewer_id: reviewer_id, anonymous_user }] });
                        }

                    }
                }
            } catch (e) {
                return sendError(req, res, 400, 'Your Linkedin URL is not valid.');
            }
        }

        return res.status(200).json({ success: true });
    } catch (e) {
        return sendError(req, res, 400, 'Error while adding review.');
    }
};

export default {
    getRecentReview,
    addReviewByLink,
    getReviewByUser,
    getReviewByID,
    addReview,
    editReview,
    deleteReview,
}