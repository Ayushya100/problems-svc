'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { verifySheetAssignedToPlaylist, getSheetInfoById, assignSheetToPlaylist } from '../../db/index.js';
import { getAssignedSheetsByPlaylistId } from './getAssignment.controller.js';
import { getPlaylistById } from './getPlaylist.controller.js';

const log = logger('Controller: assign-sheets-playlist');

const verifySheets = async (sheetId) => {
  try {
    log.info('Call controller function to validate the provided sheets');
    log.info('Call db query to verify if all sheets valid');
    const sheetDtl = await getSheetInfoById(sheetId, false);
    if (sheetDtl.rowCount === 0) {
      log.error('Provided sheet ID is incorrect');
      throw {
        status: 404,
        message: 'Provided sheet ID is incorrect',
      };
    }

    return true;
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while verifying sheets provided for the assignment');
    throw {
      status: 500,
      message: 'An error occurred while verifying sheets',
      errors: err,
    };
  }
};

const verifySheetAssigned = async (playlistId, sheetId) => {
  try {
    log.info('Controller function to verify the sheet assignment for the requested playlist operation initiated');
    log.info('Call db query to verify if sheet already assigned');
    const assignedSheetDtl = await verifySheetAssignedToPlaylist(playlistId, sheetId);
    if (assignedSheetDtl.rowCount > 0) {
      return true;
    }
    return false;
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while verifying sheets assignment');
    throw {
      status: 500,
      message: 'An error occurred while verifying sheets assignment',
      errors: err,
    };
  }
};

const assignSheets = async (userId, playlistId, sheetId) => {
  try {
    log.info('Controller function to assign the sheets to the playlist operation initiated');
    userId = convertPrettyStringToId(userId);
    playlistId = convertPrettyStringToId(playlistId);
    sheetId = convertPrettyStringToId(sheetId);

    log.info('Validate requested sheet exists');
    await verifySheets(sheetId);

    log.info('Validate if sheet already assigned');
    const isSheetAssigned = await verifySheetAssigned(playlistId, sheetId);
    if (isSheetAssigned) {
      log.error('Sheet already assigned to the playlist');
      throw {
        status: 400,
        message: 'Problem already assigned to the playlist',
      };
    }

    log.info('Call db query to assign sheet to the playlist');
    const sheetAssignedDtl = await assignSheetToPlaylist(playlistId, sheetId, userId);
    let assignmentId = sheetAssignedDtl.rows[0];
    assignmentId = assignmentId.id;
    const playlistDtl = await getPlaylistById(playlistId, userId, false);
    const sheetDtl = await getAssignedSheetsByPlaylistId(assignmentId);
    playlistDtl.data.sheets = [sheetDtl.data];

    log.success('Sheet assigned to playlist successfully');
    return {
      status: 201,
      message: 'Problem assigned successfully',
      data: playlistDtl.data,
    };
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while assigning sheets to the provided playlist');
    throw {
      status: 500,
      message: 'An error occurred while assigning sheets to the playlist',
      errors: err,
    };
  }
};

export { assignSheets };
