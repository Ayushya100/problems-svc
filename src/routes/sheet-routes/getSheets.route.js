'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-sheet-type');
const sheetController = controllers.sheetController;
const languageController = controllers.languageController;

// API Function
const getSheet = async (req, res, next) => {
  try {
    log.info('Get sheet types request process initiated');
    const sheetId = req.params.sheetId;
    const langId = req.params.langId;

    let sheetDtl = {};
    if (sheetId && langId) {
      log.info('Call controller funciton to validate if provided language id exist');
      const validLangId = await languageController.getLangById(langId, false);
      if (!validLangId.isValid) {
        throw validLangId;
      }

      log.info('Call controller function to fetch the requested sheet snippet by langId');
      sheetDtl = await sheetController.getSheetSnippetById(sheetId, langId);
    } else if (sheetId) {
      log.info('Call controller function to fetch sheet details for provided id');
      sheetDtl = await sheetController.getSheetById(sheetId);
    } else {
      log.info('Call controller function to fetch all sheets from system');
      sheetDtl = await sheetController.getAllSheets();
    }
    if (!sheetDtl.isValid) {
      throw sheetDtl;
    }

    log.success('Sheets fetched successfully');
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

export default getSheet;
