'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: update-playlist');
const playlistController = controllers.playlistController;

// API Function
const updatePlaylistById = async (req, res, next) => {
  try {
    log.info('Update playlist for requested ID process initiated');
    const payload = req.body;
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    log.info('Call controller function to verify if the playlist for provided id exists');
    const playlistDtl = await playlistController.getPlaylistById(playlistId, userId);

    if (payload.name && playlistDtl.data.name !== payload.name) {
      payload.name = payload.name[0].toUpperCase() + payload.name.slice(1);
      log.info('Call controller function to verify if playlist with new title exists');
      await playlistController.verifyPlalist(userId, payload.name);
    }

    log.info('Call controller function to update a playlist detail in system');
    const listDtl = await playlistController.updatePlaylistDetails(userId, playlistId, payload, playlistDtl.data);

    log.success('Playlist updated successfully');
    res.status(200).json(buildApiResponse(listDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updatePlaylistById;
