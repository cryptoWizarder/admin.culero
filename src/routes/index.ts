import express from 'express';
import chalk from 'chalk';
import { sync } from 'glob';
import debug from 'debug';
import { resolve, relative } from 'node:path';


import config from '../config';
import { setDefaultMime, loadUser } from '../controllers/common.controllers';
const log = debug('app:router');

export const router = express.Router();
router.use(setDefaultMime);
router.use(loadUser);

sync(resolve(__dirname, '*.routes.ts').replaceAll('\\', '/')).forEach((routePath) => {
  /**
   * @type {Routes.default}
   */

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const m: any = require(resolve(routePath));

  const r = express.Router();
  const rPath = m.is_global === true ? m.prefix : `/${config.prefix}${m.prefix}`;

  if (config.apiExcludes && m.exclude) {
    log('Excluding the module', relative('.', routePath));
    return;
  }
  // console.log(rPath);
  // Add the before middlewares
  if (Array.isArray(m.before)) {
    m.before.forEach((middleware: any) => {
      r.use(middleware);
    });
  }

  // Parse the routes
  if (Array.isArray(m.routes)) {
    m.routes.forEach((route: any) => {
      if (
        !route ||
        typeof route !== 'object' ||
        !route.methods ||
        typeof route.methods !== 'object' ||
        !route.path
      ) {
        console.warn('Invalid route', route);
        return;
      }
      if (config.apiExcludes && route.exclude) {
        log('Excluding the route "%s"', `${rPath}${route.path}`);
        return;
      }

      let routeTmp: any = r.route(route.path);

      let allMiddlwares = route.all || route['*'];

      if (allMiddlwares && !Array.isArray(allMiddlwares)) {
        allMiddlwares = [allMiddlwares];
      }

      if (!Array.isArray(allMiddlwares)) {
        allMiddlwares = [];
      }

      // const { groups: { name } } = /(?<name>([^/]*))\.routes\.js$/.exec(routePath);
      // console.log(`[${name.toUpperCase()}] ${route.path}`);

      // Add 'all' middlewares
      routeTmp = routeTmp.all(allMiddlwares);

      // Scan the routes
      Object.keys(route.methods).forEach(async (k) => {
        if (
          typeof routeTmp[k] === 'function' &&
          Object.prototype.hasOwnProperty.call(route.methods, k) &&
          route.methods[k] &&
          typeof route.methods[k] === 'object' &&
          route.methods[k].middlewares
        ) {
          /**
           * @type {Routes.Method}
           */
          const method = route.methods[k];

          if (config.apiExcludes && method.exclude) {
            log('Excluding the method "[%s] %s"', k.toUpperCase(), `${rPath}${route.path}`);
            return;
          }

          try {
            routeTmp[k](method.middlewares);
          } catch (e) {
            const routes = method.middlewares.map((middleware: any) => {
              const result = typeof middleware === 'function' ? '⨍' : 'null';
              return result;
            });
            log(
              'error',
              `
                Error while adding route:

                ${chalk.red('Route')}   : ${route.path}
                ${chalk.red('Module')}  : ${routePath}
                ${chalk.red('Method')}  : ${k}
                ${chalk.red('Routes')}  : [${routes.join(' , ')}]

                Please check your IAM configuraion
              `,
            );
            process.exit(1);
          }
        }
      });
    });
  }

  // Add the params middlewares
  if (Array.isArray(m.params)) {
    m.params.forEach((p: any) => {
      r.param(p.name, p.middleware);
    });
  }

  // Add the after middlewares
  if (Array.isArray(m.after)) {
    m.after.forEach((middleware: any) => {
      r.use(middleware);
    });
  }

  // Add the router to the app with the prefix
  router.use(rPath, r);

});

