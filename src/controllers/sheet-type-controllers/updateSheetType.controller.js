'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { updateTypeInfoById } from '../../db/index.js';
import { getTypeById } from './getSheetType.controller.js';

const log = logger('Controller: update-sheet-type');

const updateSheetTypeById = async (typeId, userId, typeDtl, payload) => {
  try {
    log.info('Controller function to update the sheet type info process initiated');
    payload.typeDesc = payload.typeDesc || typeDtl.typeDesc;
    payload.executor = payload.executor || typeDtl.executor;
    typeId = convertPrettyStringToId(typeId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to update the sheet type description in system');
    await updateTypeInfoById(payload, userId, typeId);
    const updatedType = await getTypeById(typeId);
    if (!updatedType.isValid) {
      throw updatedType;
    }

    log.success('Sheet type info updated successfully');
    return {
      status: 200,
      message: 'Sheet type updated successfully',
      data: updatedType.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while update sheet type for requested id in system');
    return {
      status: 500,
      message: 'An error occurred while updating sheet type',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateSheetTypeById };
