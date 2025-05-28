'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { deletePlaylistInfo } from '../../db/index.js';

const log = logger('Controller: update-playlist');

const deletePlaylistDetails = async (userId, playlistId) => {
  try {
    log.info('Controller function to delete the playlist details for the requested id from the system');
    userId = convertPrettyStringToId(userId);
    playlistId = convertPrettyStringToId(playlistId);

    log.info('Call db query to soft delete the requested playlist from the system');
    await deletePlaylistInfo(userId, playlistId);

    log.success('Requested playlist deleted successfully');
    return {
      status: 200,
      message: 'Playlist deleted successfully',
      data: [],
    };
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while validating the sheet information for provided sheet id');
    throw {
      status: 500,
      message: 'An error occurred while retrieving problem statement',
      errors: err,
    };
  }
};

export { deletePlaylistDetails };
