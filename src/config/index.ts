import { readFileSync } from 'node:fs';
import { CorsOptionsDelegate } from 'cors';

import { get } from './tools';
import { Request } from 'express';

const jwtCerts = (
  [
    {
      name: 'Public Key',
      key: 'publicKey',
      envVar: 'JWT_PUBLIC_KEY',
    },
    {
      name: 'Private Key',
      key: 'privateKey',
      envVar: 'JWT_PRIVATE_KEY',
    },
  ] as {
    name: string;
    key: string;
    envVar: 'JWT_PRIVATE_KEY' | 'JWT_PUBLIC_KEY';
  }[]
).reduce((prev, curr) => {
  const path = get(curr.envVar);

  if (path.startsWith('-----BEGIN')) {
    return { ...prev, [curr.key]: path };
  }

  try {
    const content = readFileSync(path, { encoding: 'utf-8' });
    return { ...prev, [curr.key]: content };
  } catch (e) {
    console.warn('Cannot find the "%s". please check the "%s" file', curr.name, path);
  }

  return prev;
}, {});

const publicUrl = get('PUBLIC_URL');

export default {
  env: get('NODE_ENV'),
  mediaStrictMode: get('MEDIA_STRICT_MODE'),
  port: get('PORT'),
  prefix: get('API_PREFIX'),
  apiExcludes: get('API_EXCLUDES'),
  host: get('HOST'),
  appName: get('APP_NAME'),
  publicUrl,
  domain: new URL(publicUrl).host,
  morgan: {
    enabled: get('MORGAN_ENABLED'),
    type: get('MORGAN_TYPE'),
  },
  cors: {
    enabled: get('CORS_ENABLED'),
    options(req: Request, done) {
      const value = get('CORS_ORIGIN');
      const origin = req.get('origin');

      if (value === '*') return done(null, { origin: '*' });

      if (!origin) return done(null, { origin: false });

      const whitelist: string[] = value.split(',');
      const found = whitelist.find((o) => origin.startsWith(o));
      return done(null, { origin: !!found });
    },
  } as {
    enabled: boolean;
    options: CorsOptionsDelegate;
  },
  security: {
    code: {
      min: 10 ** (get('SECURITY_CODE_LENGTH') - 1),
      max: 10 ** get('SECURITY_CODE_LENGTH') - 1,
      delay: get('SECURITY_DELAY'),
      tryDelay: get('SECURITY_TRY_DELAY'),
      ttl: get('SECURITY_CODE_TTL'),
      maxTries: get('SECURITY_MAX_TRIES'),
      maxSends: get('SECURITY_MAX_SENDS'),
    },
  },
  dbUrl: get('DATABASE_URL'),
  mongodb: {
    url: get('DATABASE_URL'),
    /**
     * @type {import('mongoose').ConnectOptions}
     */
    options: {},
    // Enable mongoose debug mode
    debug: get('MONGODB_DEBUG'),
  },
  jwt: {
    publicKey: '',
    privateKey: '',
    ...jwtCerts,
    aud: get('JWT_AUDIENCE')?.split(','),
    iss: get('JWT_ISSUER'),
    exp: get('JWT_EXPIRATION'),
  },
};
