'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-sheet-type');
const sheetTypeController = controllers.sheetTypeController;

// API Function
const getSheetType = async (req, res, next) => {
  try {
    log.info('Get sheet types request process initiated');
    const typeId = req.params.typeId;

    let sheetDtl = {};
    if (typeId) {
      log.info('Call controller function to fetch the sheet type for provided id');
      sheetDtl = await sheetTypeController.getTypeById(typeId);
    } else {
      log.info('Call controller function to fetch all the sheet types from system');
      sheetDtl = await sheetTypeController.getAllSheetTypes();
    }

    if (!sheetDtl.isValid) {
      throw sheetDtl;
    }

    log.success('Sheet types fetched successfully');
    res.status(200).json(buildApiResponse(sheetDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getSheetType;
