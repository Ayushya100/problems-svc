'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getTagInfoById } from '../../db/index.js';

const log = logger('Controller: get-tags');

const getTagById = async (tagId) => {
  try {
    log.info('Controller function to fetch tag info by id process initiated');
    tagId = convertPrettyStringToId(tagId);

    log.info(`Call db query to fetch tag details for provided id: ${tagId}`);
    let tagDtl = await getTagInfoById(tagId);
    if (tagDtl.rowCount === 0) {
      log.error('Tag info for requested id does not exists in system');
      return {
        status: 404,
        message: 'Tag not found',
        data: [],
        errors: [],
        stack: 'getTagById function call',
        isValid: false,
      };
    }

    tagDtl = tagDtl.rows[0];
    tagDtl = {
      id: convertIdToPrettyString(tagDtl.id),
      tagCode: tagDtl.tag_cd,
      tagDesc: tagDtl.tag_desc,
      createdDate: convertToNativeTimeZone(tagDtl.created_date),
      modifiedDate: convertToNativeTimeZone(tagDtl.modified_date),
    };

    log.success('Requested tag details fetched successfully');
    return {
      status: 200,
      message: 'Tag info fetched successfully',
      data: tagDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching tag info for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching tag for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getTagById };
