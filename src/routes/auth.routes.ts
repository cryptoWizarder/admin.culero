import authCtrls from '../controllers/auth.controllers';
import { isAuthenticated } from '../controllers/common.controllers';
import validate from '../lib/ajv';
import schema from '../schemas';
import { validateProps } from '../lib/ajv';
/**
 * @type { Routes.default }
 */

module.exports = {
    prefix: '/auth',
    routes: [
        {
            path: '/login',
            methods: {
                post: {
                    middlewares: [
                        authCtrls.login
                    ],
                },
            },
        },
        {
            path: '/logout',
            methods: {
                post: {
                    middlewares: [
                        isAuthenticated,
                        authCtrls.logout
                    ],
                },
            },
        }
    ],
};
