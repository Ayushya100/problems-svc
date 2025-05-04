'use strict';

import { logger } from 'common-node-lib';
import { isProblemExistAvailable, registerNewType } from '../../db/index.js';
import { getTypeById } from './getProblemType.controller.js';

const log = logger('Controller: register-problem-type');

const verifyProblemTypeExist = async (typeCd) => {
  try {
    log.info('Controller for validating problem type existence in system activated');
    log.info('Call db query to validate if type code already exists');
    const typeDtl = await isProblemExistAvailable(typeCd);
    if (typeDtl.rowCount > 0) {
      log.error('Problem Type already exists in system');
      return {
        status: 409,
        message: 'Problem type already exists',
        data: [],
        errors: [],
        stack: 'verifyProblemTypeExist function call',
        isValid: false,
      };
    }

    log.success('Problem type verification completed successfully');
    return {
      status: 200,
      message: 'Problem type does not exists in system',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new problem type in system');
    return {
      status: 500,
      message: 'An error occurred while validating problem type in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewProblemType = async (payload) => {
  try {
    log.info('Controller function to register new problem type in system initiated');
    log.info('Call db query to register new problem type in system');
    const newType = await registerNewType(payload);
    const newTypeId = newType.rows[0].id;

    const newTypeDtl = await getTypeById(newTypeId);
    if (!newTypeDtl.isValid) {
      log.error('Error while fetching newly created problem type from system');
      return {
        status: 404,
        mesage: 'An error occurred while registering new problem type in system',
        data: [],
        errors: [],
        stack: 'registerNewProblemType function call',
        isValid: false,
      };
    }

    log.success('New Problem type registered successfully in system');
    return {
      status: 201,
      message: 'New problem type regsitered',
      data: newTypeDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new problem type in system');
    return {
      status: 500,
      message: 'An error occurred while registering new problem type in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyProblemTypeExist, registerNewProblemType };
