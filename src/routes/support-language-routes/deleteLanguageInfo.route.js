'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: delete-language');
const languageController = controllers.languageController;

// API Function
const deleteLanguage = async (req, res, next) => {
  try {
    log.info('Language info for requested id delete operation initiated');
    const langId = req.params.langId;
    const userId = req.user.id;

    log.info('Call controller function to validate if language info for requested id exists');
    const langDtl = await languageController.getLangById(langId);
    if (!langDtl.isValid) {
      throw langDtl;
    }

    log.info('Call controller function to delete the requested support language info');
    const deletedLangDtl = await languageController.deleteLanguageById(langId, userId);
    if (!deletedLangDtl.isValid) {
      throw deletedLangDtl;
    }

    res.status(200).json(buildApiResponse(deletedLangDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteLanguage;
