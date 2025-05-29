'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: assign-sheets-playlist');
const playlistController = controllers.playlistController;

// API Function
const getAssignedSheetsToPlaylist = async (req, res, next) => {
  try {
    log.info('Assign sheet to the playlist for requested ID process initiated');
    const playlistId = req.params.playlistId;
    const userId = req.user.id;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    if (req.query.limit && (req.query.limit < 5 || req.query.limit > 50)) {
      limit = 10;
    }

    log.info('Call controller function to verify if the playlist for provided id exists');
    const playlistDtl = await playlistController.getPlaylistById(playlistId, userId);

    log.info('Call controller function to fetch assigned sheets details to the playlist');
    const assignedSheetsDtl = await playlistController.fetchAssignedSheets(userId, playlistId, page, limit);

    log.success('Playlist assignment for requested playlist process completed successfully');
    res.status(assignedSheetsDtl.status).json(buildApiResponse(assignedSheetsDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getAssignedSheetsToPlaylist;
