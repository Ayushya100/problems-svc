'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { isPlaylistAvailable, registerNewPlaylist } from '../../db/index.js';
import { getPlaylistById } from './getPlaylist.controller.js';

const log = logger('Controller: register-playlist');

const verifyPlalist = async (userId, listName) => {
  try {
    log.info('Controller function to verify if the playlist for the same user exists');
    userId = convertPrettyStringToId(userId);
    listName = listName.trim();

    log.info('Call db query to check if record exist');
    let playlistDtl = await isPlaylistAvailable(userId, listName);
    if (playlistDtl.rowCount === 0) {
      log.success('No existing playlist found');
      return {
        status: 200,
        message: 'Playlist info not found',
      };
    }

    log.error('Playlist found, cannot proceed further');
    throw {
      status: 400,
      message: 'Playlist available, cannot proceed further!',
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

const registerUserPlaylist = async (userId, payload) => {
  try {
    log.info('Controller function to register new playlist for user operation initiated');
    userId = convertPrettyStringToId(userId);
    payload.name = payload.name.trim();
    payload.description = payload.description || payload.name;

    log.info('Call db query to register new playlist for user');
    const playlist = await registerNewPlaylist(userId, payload);
    const playlistId = playlist.rows[0].id;
    const playlistDtl = await getPlaylistById(playlistId, userId, false);

    log.success('Playlist registered successfully');
    return {
      status: 201,
      message: 'Playlist registered',
      data: playlistDtl.data,
    };
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while registering new playlist for user in system');
    throw {
      status: 500,
      message: 'An error occurred while registering new playlist for user',
      errors: err,
    };
  }
};

export { verifyPlalist, registerUserPlaylist };
