'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteSheetTypeInfoById } from '../../db/index.js';
import { getTypeById } from './getSheetType.controller.js';

const log = logger('Controller: delete-sheet-type');

const deleteSheetTypeById = async (typeId, userId, typeDtl) => {
  try {
    log.info('Controller function to delete the sheet type info process initiated');
    typeId = convertPrettyStringToId(typeId);
    userId = convertPrettyStringToId(userId);

    if (typeDtl.core) {
      log.error('Core sheet types cannot be deleted');
      return {
        status: 400,
        message: 'Core sheet types cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteSheetTypeById function call',
        isValid: false,
      };
    }

    log.info('Call db query to soft delete the requested sheet type from system');
    await deleteSheetTypeInfoById(typeId, userId);
    let deletedSheetTypeInfo = await getTypeById(typeId, true);
    deletedSheetTypeInfo = deletedSheetTypeInfo.data;

    log.success('Requested sheet type has been soft deleted successfully');
    return {
      status: 200,
      message: 'Sheet type info deleted successfully',
      data: deletedSheetTypeInfo,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting sheet type for requested id in system');
    return {
      status: 500,
      message: 'An error occurred while deleting sheet type',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteSheetTypeById };
