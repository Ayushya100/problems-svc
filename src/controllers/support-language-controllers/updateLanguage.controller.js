'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { updateLanguageInfo } from '../../db/index.js';
import { getLangById } from './getLanguage.controller.js';

const log = logger('Controller: update-support-language');

const updateLanguageInfoById = async (langId, userId, langDtl, payload) => {
  try {
    log.info('Controller function to update the language info process initiated');
    payload.typeId = payload.typeId || langDtl.typeId;
    payload.language = payload.language || langDtl.language;
    payload.metadata = payload.metadata || langDtl.metadata;
    langId = convertPrettyStringToId(langId);
    userId = convertPrettyStringToId(userId);
    payload.typeId = convertPrettyStringToId(payload.typeId);

    log.info('Call db query to update the language info in system');
    await updateLanguageInfo(langId, userId, payload);
    const updatedLangDtl = await getLangById(langId);
    if (!updatedLangDtl.isValid) {
      throw updatedLangDtl;
    }

    log.success('Language details updated successfully');
    return {
      status: 200,
      message: 'Language details updated successfully',
      data: updatedLangDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating language info for requested id in system');
    return {
      status: 500,
      message: 'An error occurred while updating language info',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateLanguageInfoById };
