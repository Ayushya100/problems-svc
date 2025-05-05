'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { updateTypeInfoById } from '../../db/index.js';
import { getTypeById } from './getProblemType.controller.js';

const log = logger('Controller: register-problem-type');

const updateProblemTypeById = async (typeId, userId, typeDtl, payload) => {
  try {
    log.info('Controller function to update the problem type info process initiated');
    payload.typeDesc = payload.typeDesc || typeDtl.typeDesc;
    typeId = convertPrettyStringToId(typeId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to update the problem type description in system');
    await updateTypeInfoById(payload, userId, typeId);
    const updatedType = await getTypeById(typeId);
    if (!updatedType.isValid) {
      throw updatedType;
    }

    log.success('Problem type info updated successfully');
    return {
      status: 200,
      message: 'Problem type updated successfully',
      data: updatedType.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while update problem type for requested id in system');
    return {
      status: 500,
      message: 'An error occurred while updating problem type',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateProblemTypeById };
