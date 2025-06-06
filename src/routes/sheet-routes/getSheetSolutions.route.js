'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-sheet-solutions');
const sheetController = controllers.sheetController;

// API Function
const getSheetSolutions = async (req, res, next) => {
  try {
    log.info('Get sheet solutions request process initiated');
    const sheetId = req.params.sheetId;

    log.info('Call controller function to validate if sheet for requested id exist');
    const sheetDtl = await sheetController.getSheetBasicInfoById(sheetId);
    if (!sheetDtl.isValid) {
      throw sheetDtl;
    }

    log.info('Call controller function to fetch sheet reference solutions for requested sheet id');
    const solutionDtl = await sheetController.getSolutionsBySheetId(sheetId);
    if (!solutionDtl.isValid) {
      throw solutionDtl;
    }

    res.status(200).json(buildApiResponse(solutionDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getSheetSolutions;
