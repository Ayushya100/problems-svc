'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-sheet-type');
const sheetTypeController = controllers.sheetTypeController;

// API Function
const updateSheetType = async (req, res, next) => {
  try {
    log.info('Sheet type for requested id update operation initiated');
    const typeId = req.params.typeId;
    const payload = req.body;
    const userId = req.user.id;

    log.info('Call controller function to validate if sheet type for requested id exists');
    const typeDtl = await sheetTypeController.getTypeById(typeId);
    if (!typeDtl.isValid) {
      throw typeDtl;
    }

    log.info('Call controller function to update the sheet type for provided id');
    const updatedTypeDtl = await sheetTypeController.updateSheetTypeById(typeId, userId, typeDtl.data, payload);
    if (!updatedTypeDtl.isValid) {
      throw updatedTypeDtl;
    }

    log.success('Sheet type description has been updated successfully');
    res.status(200).json(buildApiResponse(updatedTypeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateSheetType;
