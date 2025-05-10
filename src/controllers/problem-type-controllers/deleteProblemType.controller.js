'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteProblemTypeInfoById } from '../../db/index.js';
import { getTypeById } from './getProblemType.controller.js';

const log = logger('Controller: delete-problem-type');

const deleteProblemTypeById = async (typeId, userId, typeDtl) => {
  try {
    log.info('Controller function to delete the problem type info process initiated');
    typeId = convertPrettyStringToId(typeId);
    userId = convertPrettyStringToId(userId);

    if (typeDtl.core) {
      log.error('Core problem types cannot be deleted');
      return {
        status: 400,
        message: 'Core problem types cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteProblemTypeById function call',
        isValid: false,
      };
    }

    log.info('Call db query to soft delete the requested problem type from system');
    await deleteProblemTypeInfoById(typeId, userId);
    let deletedProblemTypeInfo = await getTypeById(typeId, true);
    deletedProblemTypeInfo = deletedProblemTypeInfo.data;

    log.success('Requested problem type has been soft deleted successfully');
    return {
      status: 200,
      message: 'Problem type info deleted successfully',
      data: deletedProblemTypeInfo,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting problem type for requested id in system');
    return {
      status: 500,
      message: 'An error occurred while deleting problem type',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteProblemTypeById };
