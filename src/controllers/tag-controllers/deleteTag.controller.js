'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { getTagById } from './getTag.controller.js';
import { deleteTagInfoById } from '../../db/index.js';

const log = logger('Controller: delete-tag');

const deleteTagById = async (tagId, userId, tagDtl) => {
  try {
    log.info('Controller function to delete the tag info process initiated');
    tagId = convertPrettyStringToId(tagId);
    userId = convertPrettyStringToId(userId);

    if (tagDtl.core) {
      log.error('Core tag cannot be deleted');
      return {
        status: 400,
        message: 'Core tag cannot be deleted',
        data: [],
        errors: [],
        stack: 'deleteTagById function call',
        isValid: false,
      };
    }

    log.info('Call db query to soft delete the requested tag from system');
    await deleteTagInfoById(tagId, userId);
    let deletedTagInfo = await getTagById(tagId, true);
    deletedTagInfo = deletedTagInfo.data;

    log.success('Requested tag has been soft deleted successfully');
    return {
      status: 200,
      message: 'Tag deleted successfully',
      data: deletedTagInfo,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while deleting problem type for requested id in system');
    return {
      status: 500,
      message: 'An error occurred while deleting problem type',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { deleteTagById };
