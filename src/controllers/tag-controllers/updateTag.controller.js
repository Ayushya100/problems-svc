'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { updateTagInfo } from '../../db/index.js';
import { getTagById } from './getTag.controller.js';

const log = logger('Controller: update-tag');

const updateTagById = async (tagId, userId, tagDtl, payload) => {
  try {
    log.info('Controller function to update the tag information process initiated');
    payload.tagDesc = payload.tagDesc || tagDtl.tagDesc;
    tagId = convertPrettyStringToId(tagId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to update the tag description');
    await updateTagInfo(payload, userId, tagId);
    const updatedType = await getTagById(tagId);
    if (!updatedType.isValid) {
      throw updatedType;
    }

    log.success('Tag information updated successfully');
    return {
      status: 200,
      message: 'Tag info updated successfully',
      data: updatedType.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating tag description for requested id in system');
    return {
      status: 500,
      message: 'An error occurred while updating tag description',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateTagById };
