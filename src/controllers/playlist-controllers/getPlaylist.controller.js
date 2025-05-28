'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getPlaylistByReqId, getPlaylistInfoForUser } from '../../db/index.js';

const log = logger('Controller: get-playlist');

const getPlaylistById = async (playlistId, userId, deletedRecords = false) => {
  try {
    log.info('Controller operation to fetch the playlist details for user by the requested id process initiated');
    playlistId = convertPrettyStringToId(playlistId);
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to fetch the playlist details');
    let playlistDtl = await getPlaylistByReqId(playlistId, userId, deletedRecords);
    if (playlistDtl.rowCount === 0) {
      log.error('No record found');
      throw {
        status: 404,
        message: 'No record found',
      };
    }
    playlistDtl = playlistDtl.rows[0];

    const data = {
      id: convertIdToPrettyString(playlistDtl.id),
      userId: convertIdToPrettyString(playlistDtl.user_id),
      name: playlistDtl.playlist_name,
      description: playlistDtl.playlist_desc,
      createdDate: convertToNativeTimeZone(playlistDtl.created_date),
      modifiedDate: convertToNativeTimeZone(playlistDtl.modified_date),
    };

    log.success('Playlist details found for user');
    return {
      status: 200,
      message: 'Playlist details found',
      data: data,
    };
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while fetching playlist details for user');
    throw {
      status: 500,
      message: 'An error occurred while fetching playlist details for user',
      errors: err,
    };
  }
};

const getAllPlaylist = async (userId) => {
  try {
    log.info('Controller operation to fetch the playlist info for the requested user process initiated');
    userId = convertPrettyStringToId(userId);

    log.info('Call db query to fetch the playlist info');
    let playlistDtl = await getPlaylistInfoForUser(userId);
    if (playlistDtl.rowCount === 0) {
      log.info('No record found');
      return {
        status: 204,
        message: 'No record found',
        data: [],
      };
    }
    playlistDtl = playlistDtl.rows;

    playlistDtl = playlistDtl.map((playlist) => {
      return {
        id: convertIdToPrettyString(playlist.id),
        userId: convertIdToPrettyString(playlist.user_id),
        name: playlist.playlist_name,
      };
    });

    log.success('Requested Records found successfully!');
    return {
      status: 200,
      message: 'Playlist found',
      data: playlistDtl,
    };
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while fetching playlist info for user');
    throw {
      status: 500,
      message: 'An error occurred while fetching playlist for user',
      errors: err,
    };
  }
};

export { getPlaylistById, getAllPlaylist };
