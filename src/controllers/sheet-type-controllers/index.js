'use strict';

import { verifySheetTypeExist, registerNewSheetType } from './registerSheetType.controller.js';
import { getTypeById, getAllSheetTypes, getSheetByType } from './getSheetType.controller.js';
import { updateSheetTypeById } from './updateSheetType.controller.js';
import { deleteSheetTypeById } from './deleteSheetType.controller.js';

export default {
  verifySheetTypeExist,
  registerNewSheetType,
  getTypeById,
  getAllSheetTypes,
  updateSheetTypeById,
  deleteSheetTypeById,
  getSheetByType,
};
