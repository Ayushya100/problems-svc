'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { updatePlaylistInfo } from '../../db/index.js';
import { getPlaylistById } from './getPlaylist.controller.js';

const log = logger('Controller: update-playlist');

const updatePlaylistDetails = async (userId, playlistId, payload, existingPlaylist) => {
  try {
    log.info('Controller function to update the playlist details for the requested playlist ID');
    userId = convertPrettyStringToId(userId);
    playlistId = convertPrettyStringToId(playlistId);
    payload.name = payload.name ? payload.name.trim() : existingPlaylist.name;
    payload.description = payload.description || existingPlaylist.description;

    log.info('Call db query to update the existing playlist info for user');
    await updatePlaylistInfo(userId, playlistId, payload);
    const playlistDtl = await getPlaylistById(playlistId, userId, false);

    log.success('Playlist info updated successfully');
    return {
      status: 200,
      message: 'Playlist updated',
      data: playlistDtl.data,
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

export { updatePlaylistDetails };
