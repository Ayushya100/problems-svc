'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getTagInfoById, getTags, getTagInfoByCd } from '../../db/index.js';

const log = logger('Controller: get-tags');

const formatTagDtl = (tagDtl) => {
  tagDtl = tagDtl.rows[0];
  tagDtl = {
    id: convertIdToPrettyString(tagDtl.id),
    tagCode: tagDtl.tag_cd,
    tagDesc: tagDtl.tag_desc,
    category: tagDtl.category,
    metadata: JSON.parse(tagDtl.metadata),
    core: tagDtl.core,
    createdDate: convertToNativeTimeZone(tagDtl.created_date),
    modifiedDate: convertToNativeTimeZone(tagDtl.modified_date),
  };

  return tagDtl;
};

const getTagById = async (tagId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch tag info by id process initiated');
    tagId = convertPrettyStringToId(tagId);

    log.info(`Call db query to fetch tag details for provided id: ${tagId}`);
    let tagDtl = await getTagInfoById(tagId, deletedRecord);
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

    tagDtl = formatTagDtl(tagDtl);
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

const getAllTagInfo = async (category = null) => {
  try {
    log.info('Controller function to fetch all the tag info from system initiated');
    if (category) {
      category = category.trim().toUpperCase();

      if (category !== 'TOPIC' && category !== 'COMPANY') {
        log.error('Incorrect category query value provided');
        return {
          status: 404,
          message: 'Incorrect category provided',
          errors: [],
          isValid: false,
        };
      }
    }

    log.info('Call db query to fetch all tags from db');
    let tagDtl = await getTags(category);
    if (tagDtl.rowCount === 0) {
      log.info('No tag info available to display');
      return {
        status: 204,
        message: 'No tag found',
        data: [],
        isValid: false,
      };
    }

    tagDtl = tagDtl.rows;
    const data = tagDtl.map((tag) => {
      return {
        id: convertIdToPrettyString(tag.id),
        tagCode: tag.tag_cd,
        tagDesc: tag.tag_desc,
        category: tag.category,
      };
    });

    log.success('Tags fetch operation completed successfully');
    return {
      status: 200,
      message: 'Tags fetched successfully',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching tag info from system');
    return {
      status: 500,
      message: 'An error occurred while fetching tag info from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getTagByCode = async (tagCd, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch tag info for provided tag code initiated');
    tagCd = tagCd.toUpperCase().trim();

    log.info(`Call db query to fetch tag details for provided code: ${tagCd}`);
    let tagDtl = await getTagInfoByCd(tagCd, deletedRecord);
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

    tagDtl = formatTagDtl(tagDtl);
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

export { getTagById, getAllTagInfo, getTagByCode };
