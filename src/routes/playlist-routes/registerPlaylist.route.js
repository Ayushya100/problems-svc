'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-playlist');
const playlistController = controllers.playlistController;

// API Function
const registerPlaylist = async (req, res, next) => {
  try {
    log.info('Rgister playlist for user process initiated');
    const payload = req.body;
    const userId = req.user.id;
    payload.name = payload.name[0].toUpperCase() + payload.name.slice(1);

    log.info('Call controller function to verify if playlist with same title exists');
    const playlistDtl = await playlistController.verifyPlalist(userId, payload.name);

    log.info('Call controller function to register a new playlist in system');
    const listDtl = await playlistController.registerUserPlaylist(userId, payload);

    log.success('Playlist registered successfully');
    res.status(201).json(buildApiResponse(listDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerPlaylist;
