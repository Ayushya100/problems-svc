'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-problem-type');
const problemTypeController = controllers.problemTypeController;
const languageController = controllers.languageController;

// API Function
const updateLanguageInfo = async (req, res, next) => {
  try {
    log.info('Language info for requested id update operation initiated');
    const langId = req.params.langId;
    const userId = req.user.id;
    const payload = req.body;

    log.info('Call controller function to validate if language info for requested id exists');
    const langDtl = await languageController.getLangById(langId);
    if (!langDtl.isValid) {
      throw langDtl;
    }

    if (payload.typeId && payload.typeId !== langDtl.data.typeId) {
      log.info('Call controller function to validate if problem type for newly provided id exists');
      const typeDtl = await problemTypeController.getTypeById(payload.typeId);
      if (!typeDtl.isValid) {
        throw typeDtl;
      }

      payload['langCode'] = langDtl.data.langCode;

      log.info('Call controller function to verify if language with new id and code valid to create');
      const languageExist = await languageController.verifyLanguageExist(payload);
      if (!languageExist.isValid) {
        throw languageExist;
      }
    }

    log.info('Call controller function to update the language info for provided id');
    const updatedLangDtl = await languageController.updateLanguageInfoById(langId, userId, langDtl.data, payload);
    if (!updatedLangDtl.isValid) {
      throw updatedLangDtl;
    }

    log.success('Language info has been updated successfully');
    res.status(200).json(buildApiResponse(updatedLangDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateLanguageInfo;
