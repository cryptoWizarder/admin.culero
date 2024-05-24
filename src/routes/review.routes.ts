import { isAuthenticated } from '../controllers/common.controllers';
import reviewCtrls from '../controllers/review.controllers';

/**
 * @type { Routes.default }
 */
module.exports = {
    prefix: '/review',
    routes: [
        {
            path: '/getRecentReview',
            methods: {
                get: {
                    middlewares: [
                        reviewCtrls.getRecentReview
                    ],
                },
            },
        },
        {
            path: '/getReviewByUser',
            methods: {
                post: {
                    middlewares: [
                        reviewCtrls.getReviewByUser
                    ],
                },
            },
        },
        {
            path: '/getReviewByID',
            methods: {
                post: {
                    middlewares: [
                        reviewCtrls.getReviewByID
                    ],
                },
            },
        },
        {
            path: '/editReview',
            methods: {
                post: {
                    middlewares: [
                        isAuthenticated,
                        reviewCtrls.editReview
                    ],
                },
            },
        },
        {
            path: '/addReview',
            methods: {
                post: {
                    middlewares: [
                        isAuthenticated,
                        reviewCtrls.addReview
                    ],
                },
            },
        },
        {
            path: '/addReviewByLink',
            methods: {
                post: {
                    middlewares: [
                        reviewCtrls.addReviewByLink
                    ],
                },
            },
        },
        {
            path: '/deleteReview',
            methods: {
                post: {
                    middlewares: [
                        isAuthenticated,
                        reviewCtrls.deleteReview
                    ],
                },
            },
        }
    ],
};
