'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: fetch-playlist-details');
const playlistController = controllers.playlistController;

// API Function
const getPlaylist = async (req, res, next) => {
  try {
    log.info('Get playlist for user process initiated');
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    let playlistDtl = {};
    if (playlistId) {
      log.info('Call controller function to fetch the requested playlist details');
      playlistDtl = await playlistController.getPlaylistById(playlistId, userId);
    } else {
      log.info('Call controller function to fetch all playlist info for requested user');
      playlistDtl = await playlistController.getAllPlaylist(userId);
    }

    log.success('Playlist fetched successfully');
    res.status(playlistDtl.status).json(buildApiResponse(playlistDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getPlaylist;
