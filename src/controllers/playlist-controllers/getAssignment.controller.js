'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getAssignSheetById, getSheetTagsById } from '../../db/index.js';

const log = logger('Controller: fetch-assigned-sheets');

const getAssignedSheetsByPlaylistId = async (assignmentId) => {
  try {
    log.info('Call controller function to fetch assigned sheet in the playlist');
    assignmentId = convertPrettyStringToId(assignmentId);

    log.info('Call db query to fetch assigned sheet detail');
    let sheetDtl = await getAssignSheetById(assignmentId);
    if (sheetDtl.rowCount === 0) {
      log.error('No sheet information found');
      throw {
        status: 404,
        message: 'No problem info found',
      };
    }
    sheetDtl = sheetDtl.rows[0];
    const sheetId = sheetDtl.problem_id;

    const data = {
      id: convertIdToPrettyString(sheetDtl.problem_id),
      sheetCode: sheetDtl.problem_cd,
      title: sheetDtl.problem_title,
      tags: [],
    };

    let tagDtl = await getSheetTagsById(sheetId, false);
    if (tagDtl.rowCount > 0) {
      tagDtl = tagDtl.rows;
      for (const tag of tagDtl) {
        data.tags.push({
          id: convertIdToPrettyString(tag.tag_id),
          tag: tag.tag_desc,
        });
      }
    }

    log.success('Assigned sheets info found successfully');
    return {
      status: 200,
      message: 'Problem details found',
      data: data,
    };
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while fetching assigned sheets to the playlist');
    throw {
      status: 500,
      message: 'An error occurred while fetching assigned sheets to the playlist',
      errors: err,
    };
  }
};

export { getAssignedSheetsByPlaylistId };
