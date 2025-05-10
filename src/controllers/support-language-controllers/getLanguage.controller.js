'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getLangInfoById, getAllLanguages } from '../../db/index.js';

const log = logger('Controller: get-problem-type');

const getLangById = async (langId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch support language for requested id process initiated');
    langId = convertPrettyStringToId(langId);

    log.info(`Call db query to fetch support language details for provided id: ${langId}`);
    let langDtl = await getLangInfoById(langId, deletedRecord);
    if (langDtl.rowCount === 0) {
      log.error('Support Language requested with the id does not exists in system');
      return {
        status: 404,
        message: 'Language info not found',
        data: [],
        errors: [],
        stack: 'getLangById function call',
        isValid: false,
      };
    }

    langDtl = langDtl.rows[0];
    langDtl = {
      id: convertIdToPrettyString(langDtl.id),
      langCode: langDtl.lang_cd,
      language: langDtl.language,
      typeDesc: langDtl.type_desc,
      createdDate: convertToNativeTimeZone(langDtl.created_date),
      modifiedDate: convertToNativeTimeZone(langDtl.modified_date),
    };

    log.success('Requested language details fetched successfully');
    return {
      status: 200,
      message: 'Support language info fetched successfully',
      data: langDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching support language detail for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching language detail for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getAllLanguageInfo = async () => {
  try {
    log.info('Controller function to fetch all the language info from system initiated');
    log.info('Call db query to fetch all languages from db');
    let langDtl = await getAllLanguages();
    if (langDtl.rowCount === 0) {
      log.info('No language info available to display');
      return {
        status: 204,
        message: 'No language info available',
        data: [],
        isValid: true,
      };
    }

    langDtl = langDtl.rows;
    const data = langDtl.map((lang) => {
      return {
        id: convertIdToPrettyString(lang.id),
        langCode: lang.lang_cd,
        language: lang.language,
      };
    });

    log.success('Support Languages fetch operation completed successfully');
    return {
      status: 200,
      message: 'Support language fetched successfully',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching all support languages from system');
    return {
      status: 500,
      message: 'An error occurred while fetching all languages from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getLangById, getAllLanguageInfo };
