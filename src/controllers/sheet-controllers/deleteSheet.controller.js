'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteSheetRecords } from '../../db/index.js';
import { getSheetDetailsById } from './getSheetInfo.controller.js';

const log = logger('Controller: delete-sheet');

const deleteSheetById = async (sheetId, userId) => {
  try {
    log.info('Controller function to delete the sheet for the requested id process initiated');
    sheetId = convertPrettyStringToId(sheetId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to delete sheet details from system');
    await deleteSheetRecords(sheetId, userId);

    log.info('Call controller function to fetch deleted sheet details');
    const sheetDtl = await getSheetDetailsById(sheetId, true);
    log.success('Sheet deleted successfully');
    return {
      status: 200,
      message: 'Sheet deleted successfully',
      data: sheetDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting sheet from system');
    return {
      status: 500,
      message: 'An error occurred while deleting sheet from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteSheetById };
