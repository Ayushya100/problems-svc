'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-sheet-type');
const sheetTypeController = controllers.sheetTypeController;

// API Function
const registerSheetType = async (req, res, next) => {
  try {
    log.info('Register sheet types request process initiated');
    const payload = req.body;
    payload.typeCode = payload.typeCode.toUpperCase().trim();

    log.info('Call controller function to validate if sheet type code is valid to create');
    const typeExist = await sheetTypeController.verifySheetTypeExist(payload.typeCode);
    if (!typeExist.isValid) {
      throw typeExist;
    }

    log.info('Call controller function to register new sheet type in system');
    const typeDtl = await sheetTypeController.registerNewSheetType(payload);
    if (!typeDtl.isValid) {
      throw typeDtl;
    }

    log.success('Sheet Type registered successfully');
    res.status(201).json(buildApiResponse(typeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerSheetType;
