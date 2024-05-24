import { EnvKeys } from './interfaces';
import dotenv from 'dotenv';
export type VariableValue = string | boolean | number;

export type GVariable<T extends VariableValue> = {
  defaultValue?: T;
  group?: string;
  log?: boolean;
  description?: string;
  name: string;
};

export type StringVariable = GVariable<string> & {
  type: 'string';
};

export type BooleanVariable = GVariable<boolean> & {
  type: 'boolean';
};

export type NumberVariable = GVariable<number> & {
  type: 'number';
};

export type Variable = StringVariable | BooleanVariable | NumberVariable;

dotenv.config({
  path: '.env/.common.env',
});

dotenv.config({
  path: `.env/.${process.env.NODE_ENV || 'development'}.env`,
});

const ENV = process.env.NODE_ENV || 'development';

const variables: Record<EnvKeys, Variable> = {
  NODE_ENV: {
    name: 'Env Type',
    type: 'string',
    defaultValue: 'local',
  },
  MEDIA_STRICT_MODE: {
    name: 'Strict Mode',
    group: 'app',
    type: 'boolean',
    defaultValue: true,
  },
  /**
   * App
   */
  PORT: {
    name: 'Port',
    type: 'number',
    defaultValue: 3000,
  },
  API_PREFIX: {
    name: 'API Prefix',
    type: 'string',
    defaultValue: 'api',
  },
  API_EXCLUDES: {
    name: 'Enable API Excludes',
    defaultValue: true,
    type: 'boolean',
  },
  PUBLIC_URL: {
    type: 'string',
    name: 'Public URL',
    defaultValue: `http://localhost:${process.env.PORT || 3000}`,
  },
  HOST: {
    type: 'string',
    name: 'Host',
    defaultValue: '0.0.0.0',
  },
  APP_NAME: {
    type: 'string',
    name: 'App Name',
    defaultValue: 'Inkedfur',
  },
  CORS_ORIGIN: {
    type: 'string',
    name: 'Origin',
    group: 'CORS',
    defaultValue: '*',
  },
  CORS_ENABLED: {
    name: 'Enabled',
    group: 'CORS',
    defaultValue: false,
    type: 'boolean',
  },
  MORGAN_ENABLED: {
    name: 'Enable logging',
    group: 'morgan',
    defaultValue: false,
    type: 'boolean',
  },
  MORGAN_TYPE: {
    type: 'string',
    name: 'Type',
    group: 'morgan',
    defaultValue: 'dev',
  },

  /**
   * Security
   */
  SECURITY_DELAY: {
    name: 'Delay',
    group: 'security',
    type: 'number',
    defaultValue: 30000,
  },
  SECURITY_MAX_TRIES: {
    name: 'Max Tries',
    group: 'security',
    type: 'number',
    defaultValue: 5,
  },
  SECURITY_CODE_LENGTH: {
    name: 'Code Length',
    group: 'security',
    defaultValue: 6,
    type: 'number',
  },
  SECURITY_MAX_SENDS: {
    name: 'Max Resends',
    group: 'Security',
    defaultValue: 5,
    type: 'number',
  },
  SECURITY_TRY_DELAY: {
    name: 'Retry Delay',
    group: 'Security',
    defaultValue: 5000, // 5s
    type: 'number',
  },
  SECURITY_CODE_TTL: {
    name: 'Verification Delay',
    group: 'Security',
    defaultValue: 7200000, // 2h
    type: 'number',
  },
  /**
   * MongoDB
   */
  DATABASE_URL: {
    type: 'string',
    name: 'URI',
    group: 'MongoDB',
    defaultValue: `mongodb://127.0.0.1:27017/app-${ENV}`,
  },
  MONGODB_AUTHSOURCE: {
    name: 'Auth. DB',
    log: false,
    type: 'string',
    defaultValue: 'admin',
    group: 'MongoDB',
  },
  MONGODB_USERNAME: {
    name: 'Username',
    log: false,
    type: 'string',
    group: 'MongoDB',
    defaultValue: '',
  },
  MONGODB_PASSWORD: {
    name: 'Password',
    log: false,
    type: 'string',
    group: 'MongoDB',
    defaultValue: '',
  },
  MONGODB_IS_TLS: {
    name: 'Enable TLS',
    log: false,
    group: 'MongoDB',
    defaultValue: false,
    type: 'boolean',
  },
  MONGODB_TLS_KEY: {
    name: 'TLS Certificate Key',
    log: false,
    type: 'string',
    group: 'MongoDB',
    defaultValue: 'certs/mongodb.pem',
  },
  MONGODB_TLS_INSECURE: {
    name: 'Insecure TLS',
    log: false,
    group: 'MongoDB',
    description: 'Relax TLS constraints, disabling validation',
    defaultValue: false,
    type: 'boolean',
  },
  MONGODB_DEBUG: {
    name: 'Debug Mode',
    log: false,
    group: 'MongoDB',
    defaultValue: false,
    type: 'boolean',
  },
  /**
   * JWT
   */
  JWT_ISSUER: {
    type: 'string',
    name: 'Issuer',
    log: false,
    group: 'JWT',
    defaultValue: 'https://api.culero.io',
  },
  JWT_AUDIENCE: {
    type: 'string',
    name: 'Audience',
    log: false,
    group: 'JWT',
    defaultValue: 'api.culero.io',
  },
  JWT_EXPIRATION: {
    name: 'Expiration',
    log: false,
    group: 'JWT',
    defaultValue: 2592000, // 30 days
    type: 'number',
  },
  JWT_PUBLIC_KEY: {
    type: 'string',
    name: 'Private Key',
    log: false,
    group: 'JWT',
    defaultValue: 'certs/es512-public.pem',
  },
  JWT_PRIVATE_KEY: {
    type: 'string',
    name: 'Private Key',
    log: false,
    group: 'JWT',
    defaultValue: 'certs/es512-private.pem',
  },
} as const;

export default variables;
