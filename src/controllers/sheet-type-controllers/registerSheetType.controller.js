'use strict';

import { logger } from 'common-node-lib';
import { isSheetExistAvailable, registerNewType } from '../../db/index.js';
import { getTypeById } from './getSheetType.controller.js';

const log = logger('Controller: register-sheet-type');

const verifySheetTypeExist = async (typeCd) => {
  try {
    log.info('Controller for validating sheet type existence in system activated');
    log.info('Call db query to validate if type code already exists');
    const typeDtl = await isSheetExistAvailable(typeCd);
    if (typeDtl.rowCount > 0) {
      log.error('Sheet Type already exists in system');
      return {
        status: 409,
        message: 'Sheet type already exists',
        data: [],
        errors: [],
        stack: 'verifySheetTypeExist function call',
        isValid: false,
      };
    }

    log.success('Sheet type verification completed successfully');
    return {
      status: 200,
      message: 'Sheet type does not exists in system',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new sheet type in system');
    return {
      status: 500,
      message: 'An error occurred while validating sheet type in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewSheetType = async (payload) => {
  try {
    log.info('Controller function to register new sheet type in system initiated');
    log.info('Call db query to register new sheet type in system');
    const newType = await registerNewType(payload);
    const newTypeId = newType.rows[0].id;

    const newTypeDtl = await getTypeById(newTypeId);
    if (!newTypeDtl.isValid) {
      log.error('Error while fetching newly created sheet type from system');
      return {
        status: 404,
        mesage: 'An error occurred while registering new sheet type in system',
        data: [],
        errors: [],
        stack: 'registerNewSheetType function call',
        isValid: false,
      };
    }

    log.success('New Sheet type registered successfully in system');
    return {
      status: 201,
      message: 'New sheet type regsitered',
      data: newTypeDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new sheet type in system');
    return {
      status: 500,
      message: 'An error occurred while registering new sheet type in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifySheetTypeExist, registerNewSheetType };
