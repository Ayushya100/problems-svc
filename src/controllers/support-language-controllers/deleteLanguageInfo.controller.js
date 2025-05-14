'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deleteLanguageInfo } from '../../db/index.js';
import { getLangById } from './getLanguage.controller.js';

const log = logger('Controller: delete-support-language');

const deleteLanguageById = async (langId, userId) => {
  try {
    log.info('Controller function to delete language for provided id process initiated');
    langId = convertPrettyStringToId(langId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to soft delete the requested language info from system');
    await deleteLanguageInfo(langId, userId);
    let deletedLanguageInfo = await getLangById(langId, true);
    deletedLanguageInfo = deletedLanguageInfo.data;

    log.success('Requested language details has been soft deleted successfully');
    return {
      status: 200,
      message: 'Language info deleted successfully',
      data: deletedLanguageInfo,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting language info for requested id in system');
    return {
      status: 500,
      message: 'An error occurred while deleting language info',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteLanguageById };
