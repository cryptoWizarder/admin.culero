import socialCtrls from '../controllers/social.controllers';

/**
 * @type { Routes.default }
 */
module.exports = {
    prefix: '/social',
    routes: [
        {
            path: '/getGithub',
            methods: {
                post: {
                    middlewares: [
                        socialCtrls.getGithub
                    ],
                },
            },
        },
        {
            path: '/getLinkedin',
            methods: {
                post: {
                    middlewares: [
                        socialCtrls.getLinkedin
                    ],
                },
            },
        },
        {
            path: '/authLinkedin',
            methods: {
                get: {
                    middlewares: [
                        socialCtrls.authLinkedin
                    ],
                },
            },
        }
    ],
};
