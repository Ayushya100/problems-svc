'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-problem-type');
const languageController = controllers.languageController;

// API Function
const getLanguageInfo = async (req, res, next) => {
  try {
    log.info('Get support language request process initiated');
    const langId = req.params.langId;

    let langDtl = {};
    if (langId) {
      log.info('Call controller function to fetch the language detail for requested id');
      langDtl = await languageController.getLangById(langId);
    } else {
      log.info('Call controller function to fetch all the language details from system');
      langDtl = await languageController.getAllLanguageInfo();
    }
    if (!langDtl.isValid) {
      throw langDtl;
    }

    log.success('Language details fetched successfully');
    res.status(200).json(buildApiResponse(langDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getLanguageInfo;
