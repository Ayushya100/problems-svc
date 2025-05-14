'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-support-language');
const sheetTypeController = controllers.sheetTypeController;
const languageController = controllers.languageController;

// API Function
const registerSupportLanguage = async (req, res, next) => {
  try {
    log.info('Register Support language request process initiated');
    const payload = req.body;
    const userId = req.user.id;
    payload.langCode = payload.langCode.toUpperCase();
    console.log(payload);

    log.info('Call controller function to verify if provided sheet type exists');
    const typeExist = await sheetTypeController.getTypeById(payload.typeId);
    if (!typeExist.isValid) {
      throw typeExist;
    }

    log.info('Call controller function to verify if language code is valid to create');
    const languageExist = await languageController.verifyLanguageExist(payload);
    if (!languageExist.isValid) {
      throw languageExist;
    }

    log.info('Call controller function to register new support language in system');
    const languageDtl = await languageController.registerNewLanguageType(userId, payload);
    if (!languageDtl.isValid) {
      throw languageDtl;
    }

    log.success('Support Language registered successfully');
    res.status(201).json(buildApiResponse(languageDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerSupportLanguage;
