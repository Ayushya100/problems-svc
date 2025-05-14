'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { isLanguageExistAvailable, registerNewLanguage, getDefaultLangForTypeId, changeLangToNonDefaultById } from '../../db/index.js';
import { getLangById } from './getLanguage.controller.js';

const log = logger('Controller: register-support-language');

const verifyLanguageExist = async (payload) => {
  try {
    log.info('Controller for validating support language existence in system initiated');
    const typeId = convertPrettyStringToId(payload.typeId);
    const langCode = payload.langCode;

    log.info('Call db query to validate if language code already exists');
    const langDtl = await isLanguageExistAvailable(typeId, langCode);
    if (langDtl.rowCount > 0) {
      log.error('Language code already exists in system');
      return {
        status: 409,
        message: 'Support Language already exists',
        data: [],
        errors: [],
        stack: 'verifyLanguageExist function call',
        isValid: false,
      };
    }

    log.success('Support language verification completed successfully');
    return {
      status: 200,
      message: 'Support language does not exists in system',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new support language in system');
    return {
      status: 500,
      message: 'An error occurred while validating new language in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewLanguageType = async (userId, payload) => {
  try {
    log.info('Controller function to register new support language in system initiated');
    const typeId = convertPrettyStringToId(payload.typeId);
    const langCode = payload.langCode.toUpperCase().trim();
    const language = payload.language.trim();
    const metadata = payload.metadata || null;
    let isDefault = payload.default || false;

    log.info('Call db query to fetch the default support language from system for requested type id');
    const defaultLang = await getDefaultLangForTypeId(typeId);
    if (isDefault && defaultLang.rowCount > 0) {
      log.info('Call db query to convert the existing default support language to non-default');
      const defaultLangId = defaultLang.rows[0].id;
      await changeLangToNonDefaultById(userId, defaultLangId);
    } else if (!isDefault && defaultLang.rowCount === 0) {
      isDefault = true;
    }

    log.info('Call db query to register new language in system');
    const newLanguage = await registerNewLanguage(typeId, langCode, language, metadata, isDefault);
    const newLangId = newLanguage.rows[0].id;

    const newLangDtl = await getLangById(newLangId);
    if (!newLangDtl.isValid) {
      log.error('Error while fetching newly created language info from system');
      return {
        status: 404,
        message: 'An error occurred while registering new language info in system',
        data: [],
        errors: [],
        stack: 'registerNewLanguageType function call',
        isValid: false,
      };
    }

    log.success('New Support Language registered successfully in system');
    return {
      status: 201,
      message: 'New Support Language registered',
      data: newLangDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new problem type in system');
    return {
      status: 500,
      message: 'An error occurred while registering new problem type in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyLanguageExist, registerNewLanguageType };
