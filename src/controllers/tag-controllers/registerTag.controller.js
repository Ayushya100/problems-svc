'use strict';

import { logger } from 'common-node-lib';
import { isTagExist, registerNewTagInfo } from '../../db/index.js';
import { getTagById } from './getTag.controller.js';

const log = logger('Controller: register-tags');

const verifyTagExist = async (tagCd) => {
  try {
    log.info('Controller for verifying if tag exist in system activated');
    log.info('Call db query to verify if tag code already exists');
    const tagDtl = await isTagExist(tagCd);
    if (tagDtl.rowCount > 0) {
      log.error('Tag info already exists in system');
      return {
        status: 409,
        message: 'Tag already exists',
        data: [],
        errors: [],
        stack: 'verifyTagExist function call',
        isValid: false,
      };
    }

    log.success('Tag verification completed successfully');
    return {
      status: 200,
      message: 'Tag does not exists in system',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new tag in system');
    return {
      status: 500,
      message: 'An error occurred while validating tag in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewTag = async (payload) => {
  try {
    log.info('Controller function to register new tags in system initiated');
    log.info('Call db query to register new tag in system');
    const newTag = await registerNewTagInfo(payload.tagCode, payload.tagDesc);
    const newTagId = newTag.rows[0].id;

    const newTagDtl = await getTagById(newTagId);
    if (!newTagDtl.isValid) {
      log.error('Error while fetching newly created tag info from system');
      return {
        status: 404,
        message: 'An error occurred while registering new tag in system',
        data: [],
        errors: [],
        stack: 'registerNewTag function call',
        isValid: false,
      };
    }

    log.success('New tag registered successfully in system');
    return {
      status: 201,
      message: 'New tag registered',
      data: newTagDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while registering new tags in system');
    return {
      status: 500,
      message: 'An error occurred while registering new tags in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyTagExist, registerNewTag };
