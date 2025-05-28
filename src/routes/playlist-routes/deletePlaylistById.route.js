'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: update-playlist');
const playlistController = controllers.playlistController;

// API Function
const deletePlaylistByID = async (req, res, next) => {
  try {
    log.info('Update playlist for requested ID process initiated');
    const payload = req.body;
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    log.info('Call controller function to verify if the playlist for provided id exists');
    const playlistDtl = await playlistController.getPlaylistById(playlistId, userId);

    log.info('Call controller function to delete the requested playlist from system');
    const deletedPlaylistDtl = await playlistController.deletePlaylistDetails(userId, playlistId);

    log.success('Requested Playlist deleted successfully');
    res.status(200).json(buildApiResponse(deletedPlaylistDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deletePlaylistByID;
