import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import debug from 'debug';
import { Request, Response, NextFunction } from 'express';

const log = debug('app:ajv');

const ajv = new Ajv({
  allErrors: true,
});

addFormats(ajv, { mode: 'fast', formats: ['uuid', 'time', 'email'], keywords: true });
ajvErrors(ajv);

/**
 * Validates a payload with a given schema
 * @param {Object} schema The schema of the payload
 * @param {'body' | 'query' | 'params'} type
 */

export interface validateProps {
  schema: object;
  type?: 'body' | 'query' |'params';
}

const validate = ({schema, type = 'body'} : validateProps ) =>
  async function validateSchema(req: Request, res: Response, next: NextFunction) {
    let validate;
    let obj;
    try {
      validate = ajv.compile(schema);
    } catch (e) {
      return next(e);
    }
    
    switch (type) {
      case 'params':
        obj = req.params;
        break;
      case 'query':
        obj = req.query;
        break;
      default:
        obj = req.body;
        break;
    }
    
    if (validate(obj)) {
      return next();
    }

    log('error', validate.errors);

    return res.status(400).json({
      success: false,
      errors: validate.errors?.map(({message, instancePath}) => ({
        message,
        instancePath
      })),
    });
  };

  export default validate;
