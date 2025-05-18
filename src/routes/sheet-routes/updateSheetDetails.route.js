'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-sheet-type');
const sheetTypeController = controllers.sheetTypeController;
const sheetController = controllers.sheetController;

// API Function
const updateSheetInfo = async (req, res, next) => {
  try {
    log.info('Update sheet details request process initiated');
    const sheetId = req.params.sheetId;
    const userId = req.user.id;
    const payload = req.body;
    const protocol = req.protocol;

    if (payload.typeId) {
      log.info('Call controller function to validate if sheet type for the provided id valid');
      const sheetTypeDtl = await sheetTypeController.getTypeById(payload.typeId);
      if (!sheetTypeDtl.isValid) {
        throw sheetTypeDtl;
      }
    }

    if (payload.title) {
      log.info('Call controller function to validate if sheet with same title already exists');
      const sheetExist = await sheetController.verifySheetExist(payload.title, sheetId);
      if (!sheetExist.isValid) {
        throw sheetExist;
      }
    }

    if (payload.tags) {
      log.info('Call controller function to validate if provided tags are valid');
      const tagExist = await sheetController.verifyTagsForSheet(payload.tags);
      if (!tagExist.isValid) {
        throw tagExist;
      }
    }

    let solutionValid = null;
    if (payload.referenceSolutions) {
      log.info('Call controller function to validate reference solutions and test cases for the requested sheet');
      solutionValid = await sheetController.validateSolutions(protocol, payload);
      if (!solutionValid.isValid) {
        throw solutionValid;
      }
      solutionValid = solutionValid.data;
    }

    log.info('Call controller function to update sheet details in system');
    const sheetDtl = await sheetController.updateSheet(userId, sheetId, payload, solutionValid);
    if (!sheetDtl.isValid) {
      throw sheetDtl;
    }

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

export default updateSheetInfo;
