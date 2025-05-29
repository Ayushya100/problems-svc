'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getAssignSheetById, getSheetTagsById, getAllAssignedSheetsByPlaylistId, getSheetCountByPlaylist } from '../../db/index.js';

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
      typeId: convertIdToPrettyString(sheetDtl.type_id),
      sheetCode: sheetDtl.problem_cd,
      title: sheetDtl.problem_title,
      difficulty: sheetDtl.difficulty,
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

const fetchAssignedSheets = async (userId, playlistId, page, limit) => {
  try {
    log.info('Controller function to fetch assigned sheets for the provided playlist id');
    userId = convertPrettyStringToId(userId);
    playlistId = convertPrettyStringToId(playlistId);
    const offset = (page - 1) * limit;

    log.info('Call db query to fetch assigned sheet details');
    let sheetDtl = await getAllAssignedSheetsByPlaylistId(playlistId, userId, limit, offset);
    if (sheetDtl.rowCount === 0) {
      log.info('No assigned sheets found for the reuested playlist');
      return {
        status: 204,
        message: 'No assigned problems available',
        data: [],
      };
    }
    sheetDtl = sheetDtl.rows;

    const sheetData = [];
    for (const sheet of sheetDtl) {
      const sheetInfo = {
        id: convertIdToPrettyString(sheet.id),
        typeId: convertIdToPrettyString(sheet.type_id),
        sheetCode: sheet.problem_cd,
        title: sheet.problem_title,
        difficulty: sheet.difficulty,
        tags: [],
      };

      let tagDtl = await getSheetTagsById(sheet.problem_id, false);
      if (tagDtl.rowCount > 0) {
        tagDtl = tagDtl.rows;
        for (const tag of tagDtl) {
          sheetInfo.tags.push({
            id: convertIdToPrettyString(tag.tag_id),
            tag: tag.tag_desc,
          });
        }
      }
      sheetData.push(sheetInfo);
    }

    log.info('Call db query to fetch the total number of records for sheet available');
    const sheetCount = await getSheetCountByPlaylist(playlistId, userId);
    const totalItems = sheetCount.rows[0].total;

    const totalPages = Math.ceil(totalItems / limit);
    const currentPageItems = Math.min(limit, totalItems - (page - 1) * limit);

    const data = {
      currentPageItems: currentPageItems,
      limit: Number(limit),
      page: Number(page),
      totalItems: Number(totalItems),
      totalPages: totalPages,
      nextPage: page < totalPages,
      previousPage: page > 1,
      data: sheetData,
    };
    console.log(data);

    log.success('Assigned sheets found successfully');
    return {
      status: 200,
      message: 'Assigned problems found',
      data: data,
    };
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while fetching assigned sheets to the provided playlist');
    throw {
      status: 500,
      message: 'An error occurred while fetching assigned sheets to the playlist',
      errors: err,
    };
  }
};

export { getAssignedSheetsByPlaylistId, fetchAssignedSheets };
