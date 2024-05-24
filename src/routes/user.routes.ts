import userCtrls from '../controllers/user.controllers';

/**
 * @type { Routes.default }
 */
module.exports = {
    prefix: '/user',
    routes: [
        {
            path: '/getUserBySearch',
            methods: {
                post: {
                    middlewares: [
                        userCtrls.getUserBySearch
                    ],
                },
            },
        },
        {
            path: '/getUserByID',
            methods: {
                post: {
                    middlewares: [
                        userCtrls.getUserByID
                    ],
                },
            },
        }
    ],
};
