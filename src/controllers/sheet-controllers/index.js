'use strict';

import { verifySheetExist, verifyTagsForSheet, validateSolutions, registerNewSheet } from './registerSheet.controller.js';
import { getSheetById, getAllSheets, getSheetDetailsById, getSheetSnippetById, getSheetBasicInfoById, getSolutionsBySheetId } from './getSheetInfo.controller.js';
import { deleteSheetById } from './deleteSheet.controller.js';
import { updateSheet } from './updateSheetInfo.controller.js';

export default {
  verifySheetExist,
  verifyTagsForSheet,
  validateSolutions,
  registerNewSheet,
  getSheetById,
  getAllSheets,
  getSheetDetailsById,
  getSheetSnippetById,
  getSheetBasicInfoById,
  getSolutionsBySheetId,
  deleteSheetById,
  updateSheet,
};
