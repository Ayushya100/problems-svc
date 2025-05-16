'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-sheet-type');
const sheetController = controllers.sheetController;
const sheetTypeController = controllers.sheetTypeController;
const tagController = controllers.tagController;
const languageController = controllers.languageController;

// API Function
const getSheet = async (req, res, next) => {
  try {
    log.info('Get sheet types request process initiated');
    const sheetId = req.params.sheetId;
    const langId = req.params.langId;
    const type = req.query.type;
    const tag = req.query.tag;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    if (req.query.limit && (req.query.limit < 5 || req.query.limit > 20)) {
      limit = 10;
    }

    let typeId = null;
    if (type) {
      log.info('Call controller function to validate if provided sheet type exist');
      const validTypeDtl = await sheetTypeController.getSheetByType(type);
      if (!validTypeDtl.isValid) {
        throw validTypeDtl;
      }
      typeId = validTypeDtl.data.id;
    }

    let tagId = null;
    if (tag) {
      log.info('Call controller function to validate if provided sheet tag exist');
      const tagDtl = await tagController.getTagByCode(tag);
      if (!tagDtl.isValid) {
        throw tagDtl;
      }
      tagId = tagDtl.data.id;
    }

    let sheetDtl = {};
    if (sheetId && langId) {
      log.info('Call controller function to validate if provided language id exist');
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
      sheetDtl = await sheetController.getAllSheets(typeId, tagId, page, limit);
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
