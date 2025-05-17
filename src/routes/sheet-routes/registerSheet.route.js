'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-sheet-type');
const sheetTypeController = controllers.sheetTypeController;
const sheetController = controllers.sheetController;

// API Function
const registerSheet = async (req, res, next) => {
  try {
    log.info('Register sheet request process initiated');
    const payload = req.body;
    const userId = req.user.id;
    const protocol = req.protocol;
    const scopes = req.user.scopes;
    const userApproveStatus = scopes.includes('APPRPROBLEM.U');

    log.info('Call controller function to validate if sheet type for the provided id valid');
    const sheetTypeDtl = await sheetTypeController.getTypeById(payload.typeId);
    if (!sheetTypeDtl.isValid) {
      throw sheetTypeDtl;
    }

    log.info('Call controller function to validate if sheet with same title already exists');
    const sheetExist = await sheetController.verifySheetExist(payload.title);
    if (!sheetExist.isValid) {
      throw sheetExist;
    }

    log.info('Call controller function to validate if provided tags are valid');
    const tagExist = await sheetController.verifyTagsForSheet(payload.tags);
    if (!tagExist.isValid) {
      throw tagExist;
    }

    log.info('Call controller function to validate reference solutions and test cases for the requested sheet');
    const solutionValid = await sheetController.validateSolutions(protocol, payload);
    if (!solutionValid.isValid) {
      throw solutionValid;
    }

    log.info('Call controller function to store sheet details in db');
    const sheetDtl = await sheetController.registerNewSheet(userId, userApproveStatus, payload, solutionValid.data);
    if (!sheetDtl.isValid) {
      throw sheetDtl;
    }

    log.success('Sheet registered successfully');
    res.status(201).json(buildApiResponse(sheetDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerSheet;
