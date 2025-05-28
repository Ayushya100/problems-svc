'use strict';

import { verifyPlalist, registerUserPlaylist } from './registerPlaylist.controller.js';
import { getPlaylistById, getAllPlaylist } from './getPlaylist.controller.js';
import { updatePlaylistDetails } from './updatePlaylistById.controller.js';
import { deletePlaylistDetails } from './deletePlaylistInfo.controller.js';

export default {
  verifyPlalist,
  registerUserPlaylist,
  getPlaylistById,
  getAllPlaylist,
  updatePlaylistDetails,
  deletePlaylistDetails,
};
