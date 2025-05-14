'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: delete-sheet-type');
const sheetTypeController = controllers.sheetTypeController;

// API Function
const deleteSheetType = async (req, res, next) => {
  try {
    log.info('Sheet type for requested id delete operation initiated');
    const typeId = req.params.typeId;
    const userId = req.user.id;

    log.info('Call controller function to validate if sheet type for requested id exists');
    const typeDtl = await sheetTypeController.getTypeById(typeId);
    if (!typeDtl.isValid) {
      throw typeDtl;
    }

    log.info('Call controller funciton to delete the requested sheet type');
    const deletedTypeDtl = await sheetTypeController.deleteSheetTypeById(typeId, userId, typeDtl.data);
    if (!deletedTypeDtl.isValid) {
      throw deletedTypeDtl;
    }

    log.success('Sheet type has been deleted successfully');
    res.status(200).json(buildApiResponse(deletedTypeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteSheetType;
