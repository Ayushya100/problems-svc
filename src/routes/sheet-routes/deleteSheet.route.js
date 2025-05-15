'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: delete-sheet');
const sheetController = controllers.sheetController;

// API Function
const deleteSheetInfo = async (req, res, next) => {
  try {
    log.info('Delete sheet request process initiated');
    const sheetId = req.params.sheetId;
    const userId = req.user.id;

    log.info('Call controller function to validate if sheet for requested id exist');
    const sheetDtl = await sheetController.getSheetBasicInfoById(sheetId);
    if (!sheetDtl.isValid) {
      throw sheetDtl;
    }

    log.info('Call controller function to delete the requested sheet based on the provided id');
    const deletedSheetDtl = await sheetController.deleteSheetById(sheetId, userId);
    if (!deletedSheetDtl.isValid) {
      throw deletedSheetDtl;
    }

    res.status(200).json(buildApiResponse(deletedSheetDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteSheetInfo;
