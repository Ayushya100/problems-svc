'use strict';

import registerPlaylist from './registerPlaylist.route.js';
import getPlaylist from './getPlaylist.route.js';
import updatePlaylistById from './updatePlaylistById.route.js';
import deletePlaylistByID from './deletePlaylistById.route.js';
import assignSheetToPlaylist from './assignPlaylist.route.js';
import unassignSheetToPlaylist from './unassignPlaylist.route.js';
import getAssignedSheetsToPlaylist from './getAssignPlaylist.route.js';

export default {
  registerPlaylist,
  getPlaylist,
  updatePlaylistById,
  deletePlaylistByID,
  assignSheetToPlaylist,
  unassignSheetToPlaylist,
  getAssignedSheetsToPlaylist,
};
